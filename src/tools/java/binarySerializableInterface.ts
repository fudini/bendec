import {
  FieldWithJavaProperties, GenerationBase,
  JavaInterface,
  TypeDefinitionStrictWithSize,
  TypeReadWriteDefinition,
} from "./types"
import {header, indentBlock, javaTypeMapping} from "./utils"
import {Enum, Kind, Struct} from "../../types"


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
  genBase: GenerationBase,
  typeDef: Struct
) => {
  const bufferFilling = fields
    .map((field) => {
      return indentBlock(`${
        typesToByteOperators(
          genBase,
          field.name,
          field.finalTypeName,
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
  genBase: GenerationBase,
  typeDef: TypeDefinitionStrictWithSize,
) => {
  if (typeDef.kind === Kind.Enum) {
    const byteOperators = typesToByteOperators(
      genBase,
      "value",
      typeDef.underlying,
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

export function typesToByteOperators(
  genBase: GenerationBase,
  fieldName: string,
  type: string,
  size: number,
  offset?: number,
  length?: number,
  inIteration?: boolean
): TypeReadWriteDefinition {
  const iterationAppender = inIteration ? ` + i * ${size}` : "";
  const addFieldOffsetString = offset ? ` + ${offset}` : "";

  if (genBase.options.customSerDe && genBase.options.customSerDe[type]) {
    const binSerDe = genBase.options.customSerDe[type]["ByteSerializable"]
    if (binSerDe) {
      return binSerDe(fieldName, addFieldOffsetString, iterationAppender)
    }
  }

  switch (type) {
    case "u8":
      return {
        read: `this.${fieldName} = BendecUtils.uInt8FromByteArray(bytes, offset${addFieldOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt8ToByteArray(this.${fieldName}));`,
      }
    case "u16":
      return {
        read: `this.${fieldName} = BendecUtils.uInt16FromByteArray(bytes, offset${addFieldOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt16ToByteArray(this.${fieldName}));`,
      }
    case "u32":
      return {
        read: `this.${fieldName} = BendecUtils.uInt32FromByteArray(bytes, offset${addFieldOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt32ToByteArray(this.${fieldName}));`,
      }
    case "u64":
      return {
        read: `this.${fieldName} = BendecUtils.uInt64FromByteArray(bytes, offset${addFieldOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt64ToByteArray(this.${fieldName}));`,
      }
    case "i64":
      return {
        read: `this.${fieldName} = BendecUtils.int64FromByteArray(bytes, offset${addFieldOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.int64ToByteArray(this.${fieldName}));`,
      }
    case "f64":
      return {
        read: `this.${fieldName} = BendecUtils.float64FromByteArray(bytes, offset${addFieldOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.f64ToByteArray(this.${fieldName}));`,
      }
    case "bool":
      return {
        read: `this.${fieldName} = BendecUtils.booleanFromByteArray(bytes, offset${addFieldOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.booleanToByteArray(this.${fieldName}));`,
      }
    case "char":
      return {
        read: `this.${fieldName} = BendecUtils.stringFromByteArray(bytes, offset${addFieldOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(BendecUtils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      }
    case "char[]":
      return {
        read: `this.${fieldName} = BendecUtils.stringFromByteArray(bytes, offset${addFieldOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(BendecUtils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      }
    case "u8[]":
      return {
        read: `this.${fieldName} = BendecUtils.stringFromByteArray(bytes, offset${addFieldOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(BendecUtils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      }
    default:
      if (type.includes("[]")) {
        const unarrayedType = type.replace("[]", "")
        const finalTypeName = genBase.typeMap[unarrayedType] || unarrayedType
        const javaTypeName = javaTypeMapping(genBase, finalTypeName) || finalTypeName
        const typeDef = genBase.types.find((t) => t.name === finalTypeName)
        return {
          read: indentBlock(`this.${fieldName} = new ${javaTypeName}[${length}];
              for(int i = 0; i < ${fieldName}.length; i++) {
                  ${typesToByteOperators(
            genBase,
            `${fieldName}[i]`,
            unarrayedType,
            typeDef.size,
            offset,
            length,
            true
          ).read}
              }`),
          write: indentBlock(`for(int i = 0; i < ${fieldName}.length; i++) {
                ${typesToByteOperators(
            genBase,
            `${fieldName}[i]`,
            unarrayedType,
            typeDef.size,
            offset,
            length,
            true
          ).write}
            }`),
        }
      } else {
        const typeObject = genBase.types.find((t) => t.name === type)
        const isEnum = typeObject && typeObject.kind === Kind.Enum
        const constructViaFactory = isEnum && (typeObject as Enum).bitflags === false
        return {
          read: `this.${fieldName} = ${
            !constructViaFactory ? `new ` : `${type}.get`
          }${type}(bytes, offset${addFieldOffsetString}${iterationAppender});`,
          write: `${fieldName}.toBytes(buffer);`,
        }
      }
  }
}