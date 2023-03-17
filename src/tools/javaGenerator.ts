import * as fs from "fs";
import {getTypeSize, normalizeTypes} from "../utils";
import {TypeDefinition, TypeDefinitionStrict, Union} from "../";
import {Kind} from "../types";
import {defaultMapping, defaultOptions,} from "./java/utils";
import {JavaFile, Options, TypeDefinitionStrictWithSize, TypeMapping,} from "./java/types";
import {keyBy} from "lodash";
import {utilsFile,} from "./java/utils-files";
import {getEnum} from "./java/enums";
import {getStruct} from "./java/structs";
import {getUnion} from "./java/unions";

/**
 * Prepare base for Java generation from Bendec types definitions
 */
export const generationBase = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
) => {
  const normalizedTypes: TypeDefinitionStrict[] = normalizeTypes(typesDuck);
  const lookup = {...keyBy(normalizedTypes, (i) => i.name)};
  const types: TypeDefinitionStrictWithSize[] = normalizedTypes.map((t) => ({
    ...t,
    size: getTypeSize(lookup)(t.name),
  }));
  const {typeMapping} = {...defaultOptions, ...options};
  const aliasTypeMapping = types
    .filter((t) => t.kind === Kind.Alias)
    .reduce((acc, v) => ({...acc, [v.name]: (v as any).alias}), {});

  const arrayTypeMapping = types.reduce(
    (acc, t) =>
      t.kind === Kind.Array
        ? {...acc, [t.name]: t.type+"[]"}
        : acc,
    {}
  );

  const typeMap: TypeMapping = {
    ...defaultMapping,
    ...typeMapping,
    ...aliasTypeMapping,
    ...arrayTypeMapping,
  };
  return {types, typeMap};
};

export const generateUtilities = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
): JavaFile[] => {
  const {types, typeMap} = generationBase(typesDuck, options);
  const path = options.bendecPackageName.replace(/\./g, "/");

  const utils = {
    path,
    name: "BendecUtils.java",
    body: utilsFile(options.bendecPackageName),
  };

  return [
    utils,
  ];
};

/**
 * Generate Java interface from Bendec unions
 */
export const generateUnions = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
): JavaFile[] => {
  const {types, typeMap} = generationBase(typesDuck, options);
  const path = options.bendecPackageName.replace(/\./g, "/");
  //const path = 'bendec';

  return types
    .filter((t) => t.kind === Kind.Union)
    .map((typeDef) => {
      const name = `${typeDef.name}.java`;
      return {
        path,
        name,
        body: getUnion(typeDef, typeMap, types, options),
      };
    });
};

/**
 * Generate Java classes from Bendec types definitions
 */
export const generateClasses = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
): JavaFile[] => {
  const {types, typeMap} = generationBase(typesDuck, options);
  const path = options.bendecPackageName.replace(/\./g, "/");

  return types
    .filter((t) => t.kind === Kind.Struct || t.kind === Kind.Enum)
    .map((typeDef) => {
      const name = `${typeDef.name}.java`;
      switch (typeDef.kind) {
        case Kind.Struct:
          let unions = types.filter((t) => t.kind === Kind.Union)
            .filter(u => (u as Union).members.includes(typeDef.name))
            .map(u => u.name);
          return {
            path,
            name,
            body: getStruct(typeDef, typeMap, types, options, unions),
          };

        case Kind.Enum:
          return {
            path,
            name,
            body: getEnum(typeDef, typeMap, types, options),
          };
      }
    });
};

/**
 * Generate Java implementation from Bendec types definitions
 */
export const generateFiles = (
  types: TypeDefinition[],
  directory: string,
  options?: Options,
  additionalGenerators?: [(typesDuck: TypeDefinition[], options: Options) => JavaFile[]]
) => {
  const definitions: JavaFile[] = [
    ...generateUnions(types, options),
    ...generateClasses(types, options),
    ...generateUtilities(types, options),
  ];

  if (options && options.interfaces) {
    options.interfaces.map(i => definitions.push(i.interfaceBody));
  };

  if (additionalGenerators)
    additionalGenerators.map(gen => gen(types, options)).forEach(x => definitions.push(...x));

  definitions.map((fd) => {
    if (!fs.existsSync(`${directory}/${fd.path}`)) {
      fs.mkdirSync(`${directory}/${fd.path}`, {recursive: true});
    }
    fs.writeFileSync(`${directory}/${fd.path}/${fd.name}`, fd.body);
    console.log(`WRITTEN: ${directory}/${fd.path}/${fd.name}`);
  });

};