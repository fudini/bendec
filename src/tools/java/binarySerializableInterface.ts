import {
  FieldWithJavaProperties,
  JavaInterface,
  TypeDefinitionStrictWithSize,
  TypeMapping,
} from "./types"
import {header, indentBlock, typesToByteOperators} from "./utils"
import {Kind, Struct} from "../../types"


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
  }
}

export const byteSerializableFile = (packageName?: string) => indentBlock(
  `${indentBlock(header(packageName, "import java.nio.ByteBuffer;"), 2)}
  
  public interface ByteSerializable {
  
      public int byteLength = 0;
  
      public abstract void toBytes(ByteBuffer buffer);
      public abstract byte[] toBytes();
  
  }
  `)

const getStructMethods = (
  fields: FieldWithJavaProperties[],
  types: TypeDefinitionStrictWithSize[],
  typeDef: Struct,
  typeMap: TypeMapping
) => {
  const bufferFilling = fields
    .map((field) => {
      return indentBlock(`${
        typesToByteOperators(
          types,
          field.name,
          field.finalTypeName,
          typeMap,
          field.typeSize,
          0,
          field.length || field.typeLength || 0
        ).write
      }`);
    })
    .join("\n")
  return indentBlock(`@Override
      public byte[] toBytes() {
          ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
          ${indentBlock(bufferFilling, 10, 0)}
          return buffer.array();
      }
      
      @Override  
      public void toBytes(ByteBuffer buffer) {
          ${indentBlock(bufferFilling, 10, 0)}
      }`)
}

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
    )

    const enumGetter = !typeDef.bitflags ? indentBlock(`/**
       * Get ${typeDef.name} from bytes
       * @param bytes byte[]
       * @param offset - int
       */
      public static ${typeDef.name} get${typeDef.name}(byte[] bytes, int offset) {
          return get${typeDef.name}(${byteOperators.read.split(";")[0].split("= ")[1]});
      }\n\n\n`) : ""

    return enumGetter + indentBlock(`byte[] toBytes() {
          ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
          ${byteOperators.write}
          return buffer.array();
      }
      
      void toBytes(ByteBuffer buffer) {
          ${byteOperators.write}
      }`)
  }
}