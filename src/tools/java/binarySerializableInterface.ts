import {FieldWithJavaProperties, JavaInterface, TypeDefinitionStrictWithSize, TypeMapping} from "./types";
import {header, indent, typesToByteOperators} from "./utils";
import {Kind} from "../../types";


export function binSerializableGenerator(packageName: string) : JavaInterface {
    return {
        interfaceName: "ByteSerializable",
        interfaceBody: {
            path: packageName.replace(/\./g, "/"),
            name: "ByteSerializable.java",
            body: byteSerializableFile(packageName)
        },
        imports: `import java.nio.ByteBuffer;`,
        structMethods: getStructMethods,
        enumMethods: getEnumMethods,
        addInterfaceOrNot: (typeDef) => true
    };
};

export const byteSerializableFile = (packageName?: string) => `${header(
    packageName, "import java.nio.ByteBuffer;"
)}

public interface ByteSerializable {

    public int byteLength = 0;

    public abstract void toBytes(ByteBuffer buffer);

    public abstract byte[] toBytes();

}
`;

const getStructMethods = (
    fields: FieldWithJavaProperties[],
    types: TypeDefinitionStrictWithSize[],
    typeDef: TypeDefinitionStrictWithSize,
    typeMap: TypeMapping
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
            }`;
        })
        .join("\n");
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
`;
};

const getEnumMethods = (
    fields: FieldWithJavaProperties[],
    types: TypeDefinitionStrictWithSize[],
    typeDef: TypeDefinitionStrictWithSize,
    typeMap: TypeMapping
) => {
    if (typeDef.kind === Kind.Enum) {
        const byteOperators = typesToByteOperators(
            [],
            "value",
            typeDef.underlying,
            typeMap,
            typeDef.size,
            0
        );
        return `
${indent(1)}/**
${indent(1)} Get ${typeDef.name} from bytes
${indent(1)} * @param bytes byte[]
${indent(1)} * @param offset - int
${indent(1)} */
${indent(1)}public static ${typeDef.name} get${
            typeDef.name
        }(byte[] bytes, int offset) {
${indent(2)}return get${typeDef.name}(${
            byteOperators.read.split(";")[0].split("= ")[1]
        });
${indent(1)}}

${indent(1)}byte[] toBytes() {
${indent(2)}ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
${indent(2)}${byteOperators.write}
${indent(2)}return buffer.array();
${indent(1)}}

${indent(1)}void toBytes(ByteBuffer buffer) {
${indent(2)}${byteOperators.write}
${indent(1)}}
`;
    }
};