import {header, indent, typesToJsonOperators} from "./utils";
import {FieldWithJavaProperties, JavaInterface, TypeDefinitionStrictWithSize, TypeMapping} from "./types";
import {Kind} from "../../types";

export function jsonSerializableGenerator(packageName: string) : JavaInterface {
    return {
        interfaceName: "JsonSerializable",
        interfaceBody: {
            path: packageName.replace(/\./g, "/"),
            name: "JsonSerializable.java",
            body: jsonSerializableFile(packageName)
        },
        imports: `import ${packageName}.JsonSerializable;
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
    `import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;`
)}

public interface JsonSerializable {

    public abstract ObjectNode toJson();

    public abstract ObjectNode toJson(ObjectNode object);

}
`;

const getStructJsonMethods = (
    fields: FieldWithJavaProperties[],
    types: TypeDefinitionStrictWithSize[],
    typeDef: TypeDefinitionStrictWithSize,
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