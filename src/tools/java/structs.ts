import { upperFirst } from "lodash"
import {
  ExtendedStructTypeDef,
  FieldWithJavaProperties,
  TypeDefinitionStrictWithSize,
  TypeMapping,
} from "./types"
import {
  addJavaFieldProperties,
  header,
  indent,
  typesToByteOperators,
  typesToJsonOperators,
} from "./utils"

const getMembers = (fields: FieldWithJavaProperties[]) => {
  const length = fields.reduce(
    (acc, field) => (acc += field.typeSize * (field.length || 1)),
    0
  )
  return fields
    .map(
      (field) => `${indent(1)}private final ${field.javaType} ${field.name};`
    )
    .concat([`${indent(1)}private final int byteLength = ${length};`])
    .join("\n")
}

const getGetters = (fields: FieldWithJavaProperties[]) => {
  return fields
    .map(
      (field) => `${indent(1)}public ${field.javaType} get${upperFirst(
        field.name
      )}() {
${indent(2)}return this.${field.name};
${indent(1)}};`
    )
    .join("\n")
}

const getConstructors = (
  name: string,
  fields: FieldWithJavaProperties[],
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[]
) => {
  const parameters = fields
    .map((field) => {
      return `${field.javaType} ${field.name}`
    })
    .join(", ")
  const assignments = fields
    .map((field) => `${indent(2)}this.${field.name} = ${field.name};`)
    .join("\n")

  let currentLength = 0
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
      }`
      currentLength += field.typeSize * (field.length || 1);
      return outputString
    })
    .join("\n")
  return `
${indent(1)}public ${name}(${parameters}) {
${assignments}
${indent(1)}}

${indent(1)}public ${name}(byte[] bytes, int offset) {
${byteAssignments}
${indent(1)}}

${indent(1)}public ${name}(byte[] bytes) {
${indent(2)}this(bytes, 0);
${indent(1)}}
`
}

const getByteMethods = (
  fields: FieldWithJavaProperties[],
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[]
) => {
  const bufferFilling = fields
    .map((field) => {
      return `${indent(2)}${
        typesToByteOperators(
          types,
          field.name,
          field.finalTypeName,
          typeMap,
          field.typeSize,
          0,
          field.length || field.typeLength || 0
        ).write
      }`
    })
    .join("\n")
  return `
${indent(1)}@Override  
${indent(1)}public byte[] toBytes() {
${indent(2)}ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
${bufferFilling}
${indent(2)}return buffer.array();
${indent(1)}}

${indent(1)}@Override  
${indent(1)}public void toBytes(ByteBuffer buffer) {
${bufferFilling}
${indent(1)}}
`
}

const getAdditionalMethods = (
  name: string,
  fields: FieldWithJavaProperties[]
) => {
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

const getJsonMethods = (
  fields: FieldWithJavaProperties[],
  typeMap: TypeMapping
) => {
  const jsonFilling = fields
    .map((field) => {
      return `${indent(2)}${
        typesToJsonOperators(
          field.name,
          field.finalTypeName,
          typeMap,
          field.length || field.typeLength || 0
        ).write
      }`
    })
    .join("\n")
  return `
${indent(1)}@Override  
${indent(1)}public ObjectNode toJson() {
${indent(2)}ObjectMapper mapper = new ObjectMapper();
${indent(2)}ObjectNode object = mapper.createObjectNode();
${jsonFilling}
${indent(2)}return object;
${indent(1)}}

${indent(1)}@Override  
${indent(1)}public ObjectNode toJson(ObjectNode object) {
${jsonFilling}
${indent(2)}return object;
${indent(1)}}
`
}

const getStructDocumentation = (typeDef: ExtendedStructTypeDef) => {
  return `
/**
 * <h2>${typeDef.name}</h2>
 * <p>${typeDef.desc}</p>
 * <p>Byte length: ${typeDef.size}</p>
 * ${(typeDef.fields as FieldWithJavaProperties[])
   .map((field) => {
     const typeString = `${field.type}${
       field.javaType !== field.type ? ` > ${field.javaType}` : ""
     }${field.finalTypeName !== field.type ? ` (${field.finalTypeName})` : ""}`;
     return `<p>${typeString} ${field.name} - ${
       (field as any).description
     } | size ${field.typeSize * (field.length || 1)}</p>
 * `
   })
   .join("")}*/`
}

export const getStruct = (
  typeDef: ExtendedStructTypeDef,
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[],
  withJson: boolean,
  packageName: string
) => {
  const extendedTypeDef = {
    ...typeDef,
    fields: typeDef.fields.map((f) =>
      addJavaFieldProperties(f, typeMap, types)
    ),
  }
  const hasHeader = !!extendedTypeDef.fields.find((f) => f.name === "header");
  return `${header(withJson, packageName)}
${getStructDocumentation(extendedTypeDef)}

public class ${extendedTypeDef.name} implements ByteSerializable${
    withJson ? `, JsonSerializable` : ``
  }${hasHeader ? `, WithHeader` : ""} {

${getMembers(extendedTypeDef.fields)}
${getConstructors(extendedTypeDef.name, extendedTypeDef.fields, typeMap, types)}

${getGetters(extendedTypeDef.fields)}

${getAdditionalMethods(extendedTypeDef.name, extendedTypeDef.fields)}

${getByteMethods(extendedTypeDef.fields, typeMap, types)}
${withJson ? getJsonMethods(extendedTypeDef.fields, typeMap) : ""}
}
`;
}
