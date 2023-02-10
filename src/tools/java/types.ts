import {Field} from "../..";
import {Kind, Struct, TypeDefinitionStrict} from "../../types";

export interface TypeReadWriteDefinition {
  read: string;
  write: string;
}

export type TypeMapping = Record<string, string>;

export type TypeDefinitionStrictWithSize = TypeDefinitionStrict & {
  size: number;
};

export type JavaFile = {
  path: string,
  name: string,
  body: string,
};

export type JavaInterface = {
  interfaceName: string;
  interfaceBody: JavaFile;
  imports: string,
  structMethods: (properties: FieldWithJavaProperties[], types: TypeDefinitionStrictWithSize[], typeDef: TypeDefinitionStrictWithSize, typeMap: TypeMapping) => string;
  enumMethods: (properties: FieldWithJavaProperties[], types: TypeDefinitionStrictWithSize[], typeDef: TypeDefinitionStrictWithSize, typeMap: TypeMapping) => string;
  addInterfaceOrNot: (typeDef) => boolean;
};

export interface Options {
  typeMapping?: TypeMapping;
  bendecPackageName: string;
  interfaces?: JavaInterface[];
};
export const getInterfacesImports = (interfaces: JavaInterface[]): string => {
  return interfaces.map(i => i.imports).filter((x: string) => x.length > 0).join("\n");
}

export interface FieldWithJavaProperties extends Field {
  typeSize: number;
  javaType: string;
  finalTypeName: string;
  typeLength?: number;
}
