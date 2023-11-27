import {header, indent} from "./utils";
import {
    FieldWithJavaProperties,
    JavaInterface,
    TypeDefinitionStrictWithSize,
    TypeMapping,
    TypeReadWriteDefinition
} from "./types";
import {Kind, Struct} from "../../types";
import {includes, upperFirst} from "lodash";

export function jsonSerializableGenerator(packageName: string) : JavaInterface {
    return {
        interfaceName: "JsonSerializable",
        interfaceBody: {
            path: packageName.replace(/\./g, "/"),
            name: "JsonSerializable.java",
            body: jsonSerializableFile(packageName)
        },
        imports: `import ${packageName}.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;`,
        structMethods: getStructJsonMethods,
        enumMethods: getEnumJsonMethods,
        addInterfaceOrNot: (typeDef) => true
    };
};

export const jsonSerializableFile = (packageName: string) => `${header(
    packageName,
    `import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;`
)}

public interface JsonSerializable {

    JsonMapper MAPPER = new JsonMapper();
    
    abstract ObjectNode toJson();
    abstract ObjectNode toJson(ObjectNode object);

}
`;

const getStructJsonMethods = (
    fields: FieldWithJavaProperties[],
    types: TypeDefinitionStrictWithSize[],
    typeDef: Struct,
    typeMap: TypeMapping
) : string => {
    const jsonFilling = fields
        .map((field) => {
            return `${indent(2)}${
                typesToJsonOperators(
                    field.name,
                    field.finalTypeName,
                    typeMap,
                    field.length || field.typeLength || 0
                ).write
            }`;
        })
        .join("\n");
    return `
${indent(1)}@Override  
${indent(1)}public ObjectNode toJson() {
${indent(2)}ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
${jsonFilling}
${indent(2)}return object;
${indent(1)}}

${indent(1)}@Override  
${indent(1)}public ObjectNode toJson(ObjectNode object) {
${jsonFilling}
${indent(2)}return object;
${indent(1)}}
`;
};

const getEnumJsonMethods = (
    fields: FieldWithJavaProperties[],
    types: TypeDefinitionStrictWithSize[],
    typeDef: TypeDefinitionStrictWithSize,
    typeMap: TypeMapping
) : string => {
    if (typeDef.kind === Kind.Enum) {
        return `

${indent(1)}public TextNode toJson() {
${indent(2)}return JsonNodeFactory.instance.textNode(name());
${indent(1)}}
`;
    } else {
        return "";
    }
};

const  typesToJsonOperators = (
  fieldName: string,
  type: string,
  typeMap: TypeMapping,
  length?: number
): TypeReadWriteDefinition => {
    switch (type) {
        case "u8":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "u16":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "u32":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "u64":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "i64":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "f64":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "bool":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "char":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "char[]":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        case "u8[]":
            return {
                read: ``,
                write: `object.put("${fieldName}", ${fieldName});`,
            };
        default:
            if (type.includes("[]")) {
                const unarrayedType = type.replace("[]", "");
                const isSimpleType = includes(["u8", "u16", "u32", "u64", "i64", "f64", "bool", "char"],
                  unarrayedType)
                return {
                    read: ``,
                    write: `ArrayNode array${upperFirst(fieldName)}=JsonSerializable.MAPPER.createArrayNode();
${indent(2)}for(int i = 0; i < ${fieldName}.length; i++) {
${indent(3)}array${upperFirst(fieldName)}.add(${fieldName}[i]${isSimpleType ? "" : ".toJson()"});
${indent(2)}}
${indent(2)}object.set("${fieldName}", array${upperFirst(fieldName)});`,
                };
            } else {
                return {
                    read: ``,
                    write: `object.set("${fieldName}", ${fieldName}.toJson());`,
                };
            }
    }
}