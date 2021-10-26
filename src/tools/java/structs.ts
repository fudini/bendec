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
} from "./utils"

const getMembers = (fields: FieldWithJavaProperties[]) => {
  const length = fields.reduce(
    (acc, field) => (acc += field.typeSize * (field.length || 1)),
    0
  )
  return fields
    .map(
      (field) => `${indent(1)}private ${field.javaType} ${field.name};`
    )
    .concat([`${indent(1)}public static int byteLength = ${length};`])
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
) => {
  const parameters = fields
    .map((field) => {
      return `${field.javaType} ${field.name}`
    })
    .join(", ")
  const assignments = fields
    .map((field) => `${indent(2)}this.${field.name} = ${field.name};`)
    .join("\n")

  return `
${indent(1)}public ${name}(${parameters}) {
${assignments}
${indent(1)}}

${indent(1)}public ${name}() {
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
  packageName: string
) => {
  const extendedTypeDef = {
    ...typeDef,
    fields: typeDef.fields.map((f) =>
      addJavaFieldProperties(f, typeMap, types)
    ),
  }
  return `${header(packageName)}
${getStructDocumentation(extendedTypeDef)}

public class ${extendedTypeDef.name} {

${getMembers(extendedTypeDef.fields)}
${getConstructors(extendedTypeDef.name, extendedTypeDef.fields)}

${getGetters(extendedTypeDef.fields)}

${getAdditionalMethods(extendedTypeDef.name, extendedTypeDef.fields)}

}
`;
}
