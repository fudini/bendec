import {upperFirst} from "lodash";
import {
  FieldWithJavaProperties,
  getInterfacesImports,
  Options,
  TypeDefinitionStrictWithSize,
  TypeMapping,
} from "./types";
import {addJavaFieldProperties, header, indent, typesToByteOperators,} from "./utils";
import {Kind, Struct, Union} from "../../types";

const getMembers = (fields: FieldWithJavaProperties[]) => {
  const length = fields.reduce(
    (acc, field) => (acc += field.typeSize * (field.length || 1)),
    0
  );
  return fields
    .map((field) => `${indent(1)}private ${field.javaType} ${field.name};`)
    .concat([`${indent(1)}public static final int byteLength = ${length};`])
    .join("\n");
};

const getterJavadoc = (field: FieldWithJavaProperties) : string => {
  return field.description ? `${indent(1)}/**
${indent(1)} * @return ${field.description}
${indent(1)} */\n` : '';
}

const getGetters = (fields: FieldWithJavaProperties[]) => {
  return fields
    .map(
      (field) =>
        `${getterJavadoc(field)}${indent(1)}public ${field.javaType} get${upperFirst(field.name)}() {
${indent(2)}return this.${field.name};
${indent(1)}};`
    )
    .join("\n");
};

const setterJavadoc = (field: FieldWithJavaProperties) : string => {
  return field.description ? `${indent(1)}/**
${indent(1)} * @param ${field.name} ${field.description}
${indent(1)} */\n` : '';
}

const getSetters = (fields: FieldWithJavaProperties[]) => {
  return fields
    .map(
      (field) =>
        `${setterJavadoc(field)}${indent(1)}public void set${upperFirst(field.name)}(${field.javaType} ${field.name}) {
${indent(2)}this.${field.name} = ${field.name};
${indent(1)}};`
    )
    .join("\n");
};

const getConstructors = (
  name: string,
  fields: FieldWithJavaProperties[],
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[],
) : string => {
  const parameters = fields
    .map((field) => {
      return `${field.javaType} ${field.name}`;
    })
    .join(", ");
  const assignments = fields
    .map((field) => `${indent(2)}this.${field.name} = ${field.name};`)
    .join("\n");

  let setLength = "";
  let setDiscriminator = "";
  const headerField = fields.find((f) => f.name === "header");
  if (headerField) {
    const headerType = types.find((t) => t.name === headerField.type && t.kind === Kind.Struct);
    if (!!(headerType as Struct).fields.find(f => f.name === "length"))
      setLength = `
${indent(2)}this.header.setLength(this.byteLength);`

    const unions : Union[] = types.filter(t => t.kind === Kind.Union) as Union[];
    for (let u of unions) {
      const discriminator = (u as Union).discriminator.length > 1 ? (u as Union).discriminator[1] : undefined;
      const headerDiscriminatorField = discriminator ? (headerType as Struct).fields.find(hf => hf.name === discriminator) : undefined;
      if (headerDiscriminatorField) {
        setDiscriminator = `
${indent(2)}this.header.set${upperFirst(discriminator)}(${upperFirst(headerDiscriminatorField.type)}.${name.toLocaleUpperCase()});`
      }
    }
  }

  let currentLength = 0;
  const byteAssignments = fields
    .map((field) => {
      const outputString = `${indent(2)}${
        typesToByteOperators(
          types,
          field.name,
          field.finalTypeName,
          typeMap,
          field.typeSize,
          currentLength,
          field.length || field.typeLength
        ).read
      }`;
      currentLength += field.typeSize * (field.length || 1);
      return outputString;
    })
    .join("\n");
  const bytesContructors = `
${indent(1)}public ${name}(byte[] bytes, int offset) {
${byteAssignments}${setLength}${setDiscriminator}
${indent(1)}}

${indent(1)}public ${name}(byte[] bytes) {
${indent(2)}this(bytes, 0);
${indent(1)}}

${indent(1)}public ${name}() {
${indent(1)}}
`;
  return `
${indent(1)}public ${name}(${parameters}) {
${assignments}${setLength}${setDiscriminator}
${indent(1)}}
${bytesContructors}
`;
};

const getStructDocumentation = (typeDef) => {
  return `
/**
 * <h2>${typeDef.name}</h2>
${typeDef.description ? " * <p>" + typeDef.description + "</p>" : ""}
 * <p>Byte length: ${typeDef.size}</p>
 * ${(typeDef.fields as FieldWithJavaProperties[])
   .map((field) => {
     const typeString = `${field.type}${
       field.javaType !== field.type ? ` > ${field.javaType}` : ""
     }${field.finalTypeName !== field.type ? ` (${field.finalTypeName})` : ""}`;
     const desc = field.description ? ` - ${field.description}` : ``;
     return `<p>${typeString} ${field.name}${desc} | size ${field.typeSize * (field.length || 1)}</p>
 * `;
   })
   .join("")}*/`;
};

const getAdditionalMethods = (
  name: string,
  fields: FieldWithJavaProperties[]
) : string => {
  const stringFields = fields.map((f, i) => `${indent(3)}"${i !== 0 ? `, ` : ``}${f.name}=" + ${f.name} +`);
  return `${indent(1)}@Override
${indent(1)}public int hashCode() {
${indent(2)}return Objects.hash(${fields.map((f) => f.name).join(", ")});
${indent(1)}}

${indent(1)}@Override
${indent(1)}public String toString() {
${indent(2)}return "${name}{" +
${stringFields.join("\n")}
${indent(3)}'}';
${indent(2)}}`
}


export const getStruct = (
  typeDef: Struct,
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[],
  options: Options,
  unionInterfaces?: string[]
) : string => {
  const extendedTypeDef = {
    ...typeDef,
    fields: typeDef.fields.map((f) =>
      addJavaFieldProperties(f, typeMap, types)
    ),
  };
  const interfaces = options.interfaces.filter(i => i.addInterfaceOrNot(typeDef))
      .map(i => i.interfaceName).concat(unionInterfaces)
      .filter((x: string) => x.length > 0).join(", ");

  return `${header(
    options.bendecPackageName,
    getInterfacesImports(options.interfaces),
  )}
${getStructDocumentation(extendedTypeDef)}

public class ${extendedTypeDef.name} implements ${interfaces} {

${getMembers(extendedTypeDef.fields)}
${getConstructors(
  extendedTypeDef.name,
  extendedTypeDef.fields,
  typeMap,
  types
)}

${getGetters(extendedTypeDef.fields)}

${getSetters(extendedTypeDef.fields)}

${options.interfaces.map(i => i.structMethods(extendedTypeDef.fields, types, typeDef, typeMap))
      .filter((x: string) => x.length > 0).join("")}
${getAdditionalMethods(extendedTypeDef.name, extendedTypeDef.fields)}
}
`;
};
