import {upperFirst} from "lodash"
import {
  FieldWithJavaProperties,
  getInterfacesImports,
  Options,
  TypeDefinitionStrictWithSize,
  TypeMapping,
} from "./types"
import {addJavaFieldProperties, header, indentBlock, typesToByteOperators,} from "./utils"
import {Struct} from "../../types"

const getMembers = (fields: FieldWithJavaProperties[]) => {
  const length = fields.reduce((acc, field) => (acc += field.typeSize * (field.length || 1)), 0)
  return fields
    .map((field) => `private ${field.javaType} ${field.name};`)
    .concat([`public static final int byteLength = ${length};`])
    .join("\n")
}

const getterJavadoc = (field: FieldWithJavaProperties) : string => {
  if (field.description) {
    return indentBlock(
      `/**
        * @return ${field.description}
        */
       \n`, 1, 0)
  } else {
    return ''
  }
}

const getGetters = (fields: FieldWithJavaProperties[]) => {
  return fields
    .map(field =>
        indentBlock(`${indentBlock(getterJavadoc(field), 9, 0)}
        public ${field.javaType} get${upperFirst(field.name)}() {
            return this.${field.name};
        }`)
    ).join("\n\n")
}

const setterJavadoc = (field: FieldWithJavaProperties) : string => {
  if (field.description) {
    return indentBlock(
      `/**
         * @param ${field.name} ${field.description}
         */
       \n`, 1, 0)
  } else {
    return ''
  }
}

const getSetters = (fields: FieldWithJavaProperties[]) => {
  return fields
    .map(field =>
        indentBlock(`${indentBlock(setterJavadoc(field), 9, 0)}
        public void set${upperFirst(field.name)}(${field.javaType} ${field.name}) {
            this.${field.name} = ${field.name};
        }`)
    ).join("\n\n")
}

const getConstructors = (
  name: string,
  fields: FieldWithJavaProperties[],
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[],
) : string => {
  const parameters = fields
    .map(field => `${field.javaType} ${field.name}`)
    .join(", ")
  const assignments = fields
    .map(field => `this.${field.name} = ${field.name};`)
    .join("\n")
  const parametersConstructor = indentBlock(`
    public ${name}(${parameters}) {
        ${indentBlock(assignments, 8, 0)}
    }`)

  let currentLength = 0
  const byteAssignments = fields.map((field) => {
      const outputString = `${
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
      currentLength += field.typeSize * (field.length || 1)
      return outputString
    }).join("\n")
  const bytesConstructors = indentBlock(`
    public ${name}(byte[] bytes, int offset) {
        ${indentBlock(byteAssignments, 8, 0)}
    }
    
    public ${name}(byte[] bytes) {
        this(bytes, 0);
    }
    
    public ${name}() {
    }`)
  return indentBlock(parametersConstructor + "\n\n" + bytesConstructors,0)
}

const getStructDocumentation = typeDef => {
  const fieldsDoc = (typeDef.fields as FieldWithJavaProperties[])
    .map((field) => {
      const typeString = `${field.type}${
        field.javaType !== field.type ? ` > ${field.javaType}` : ""
      }${field.finalTypeName !== field.type ? ` (${field.finalTypeName})` : ""}`
      const desc = field.description ? ` - ${field.description}` : ``
      return `* <p>${typeString} ${field.name}${desc} | size ${field.typeSize * (field.length || 1)}</p>`
      }).join("\n");
  return indentBlock(`
    /**
     * <h2>${typeDef.name}</h2>
    ${typeDef.description ? " * <p>" + typeDef.description + "</p>" : ""}
     * <p>Byte length: ${typeDef.size}</p>
     ${indentBlock(fieldsDoc, 5, 0)}
     */`)
}

const getAdditionalMethods = (
  name: string,
  fields: FieldWithJavaProperties[]
) : string => {
  const stringFields = fields.map((f, i) => `"${i !== 0 ? `, ` : ``}${f.name}=" + ${f.name} +`)
  return indentBlock(
    `@Override
    public int hashCode() {
        return Objects.hash(${fields.map((f) => f.name).join(",\n        ")});
    }
    
    @Override
    public String toString() {
        return "${name} {" +
            ${stringFields.join("\n            ")}
            "}";
    }`)
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
  }
  const interfaces = options.interfaces.filter(i => i.addInterfaceOrNot(typeDef))
    .map(i => i.interfaceName).concat(unionInterfaces)
    .filter((x: string) => x.length > 0).join(", ")

  const interfacesBody = options.interfaces.map(i => i.structMethods(extendedTypeDef.fields, types, typeDef, typeMap))
    .filter((x: string) => x.length > 0).join("\n\n");

  return indentBlock(`${indentBlock(header(options.bendecPackageName, getInterfacesImports(options.interfaces)), 4, 0)}
    
    ${indentBlock(getStructDocumentation(extendedTypeDef), 5, 0)}
    public class ${extendedTypeDef.name} implements ${interfaces} {
        ${indentBlock(getMembers(extendedTypeDef.fields), 8,  0)}
        
        ${indentBlock(getConstructors(extendedTypeDef.name, extendedTypeDef.fields, typeMap, types), 8, 0)}
        
        ${indentBlock(getGetters(extendedTypeDef.fields), 8, 0)}
        
        ${indentBlock(getSetters(extendedTypeDef.fields), 8, 0)}
        
        ${indentBlock(interfacesBody, 8, 0)}
        
        ${indentBlock(getAdditionalMethods(extendedTypeDef.name, extendedTypeDef.fields), 8, 0)}
    }`);

}
