import * as fs from "fs";
import { getTypeSize, normalizeTypes } from "../utils";
import { TypeDefinition, TypeDefinitionStrict, Field } from "../";
import { Kind } from "../types";
import {
  javaTypeMapping,
  typesToByteOperators,
  indent,
  defaultMapping,
  defaultOptions,
  getTypeFormTypeMap,
} from "./java/utils";
import {
  Options,
  TypeDefinitionStrictWithSize,
  TypeMapping,
} from "./java/types";
import { fill, keyBy } from "lodash";

const generateBendec = (
  msgTypeOffset: number,
  messageTypeDefinition: TypeDefinitionStrictWithSize & { kind: Kind.Enum }
) => {
  return `
class Bendec {
${indent(1)}void handleMessage(byte[] bytes) {
${indent(2)}MsgType msgType = MsgType.getMsgType(bytes, ${msgTypeOffset});
${indent(3)}switch (msgType) {
${messageTypeDefinition.variants
  .map(
    (v) => `
${indent(4)}case ${v[0].toUpperCase()}:
${indent(5)}handle${v[0]}(bytes);
${indent(5)}break;
`
  )
  .join("")}
${indent(4)}default:
${indent(
  5
)}System.out.println("unknown message type: " + msgType + bytes.toString());
${indent(5)}break;
${indent(3)}}
${indent(1)}}


${messageTypeDefinition.variants
  .map(
    (v) => `
${indent(1)}void handle${v[0]}(byte[] bytes) {
${indent(2)}${v[0]} ${v[0].toLocaleLowerCase()} = new ${v[0]}(bytes, 0);
${indent(2)}System.out.println(${v[0].toLocaleLowerCase()}.toString());
${indent(1)}}
`
  )
  .join("")}
}
`;
};

const getMembers = (
  fields: Field[],
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[]
) => {
  const length = fields.reduce((acc, field) => {
    const finalTypeName = typeMap[field.type] || field.type;
    const type =
      types.find((stype) => stype.name === finalTypeName) ||
      types.find((stype) => stype.name === field.type);
    return (acc += type.size * (field.length || 1));
  }, 0);

  return fields
    .map((field) => {
      const key = field.type + (field.length ? "[]" : "");
      const finalTypeName = getTypeFormTypeMap(key, typeMap);
      const javaTypeName = javaTypeMapping(finalTypeName) || finalTypeName;
      return `${indent(1)}private final ${javaTypeName} ${field.name};`;
    })
    .concat([`${indent(1)}private final int byteLength = ${length};`])
    .join("\n");
};

const getConstructors = (
  name: string,
  fields: Field[],
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[]
) => {
  const parameters = fields
    .map((field) => {
      const key = `${field.type}${field.length ? "[]" : ""}`;
      const typeName = getTypeFormTypeMap(key, typeMap);
      const finalTypeName = javaTypeMapping(typeName) || typeName;
      return `${finalTypeName} ${field.name}`;
    })
    .join(", ");
  const assignments = fields
    .map((field) => `${indent(2)}this.${field.name} = ${field.name};`)
    .join("\n");

  let currentLength = 0;
  const byteAssignments = fields
    .map((field) => {
      const fieldType = `${field.type}${field.length ? "[]" : ""}`;
      const finalTypeName = getTypeFormTypeMap(fieldType, typeMap);
      const type = types.find((stype) => stype.name === field.type);
      const outputString = `${indent(2)}${
        typesToByteOperators(
          types,
          field.name,
          finalTypeName,
          typeMap,
          type.size,
          currentLength,
          field.length || (type as any).length
        ).read
      }`;
      currentLength += type.size * (field.length || 1);
      return outputString;
    })
    .join("\n");
  return `
${indent(1)}${name}(${parameters}) {
${assignments}
${indent(1)}}

${indent(1)}${name}(byte[] bytes, int offset) {
${byteAssignments}
${indent(1)}}
`;
};

const getMethods = (
  fields: Field[],
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[]
) => {
  const bufferFilling = fields
    .map((field) => {
      const fieldType = `${field.type}${field.length ? "[]" : ""}`;
      const finalTypeName = getTypeFormTypeMap(fieldType, typeMap);
      const type = types.find((stype) => stype.name === field.type);
      return `${indent(2)}${
        typesToByteOperators(
          types,
          field.name,
          finalTypeName,
          typeMap,
          type.size,
          0,
          field.length ||
            (type as TypeDefinitionStrictWithSize & { kind: Kind.Array })
              .length ||
            0
        ).write
      }`;
    })
    .join("\n");
  return `
${indent(1)}@Override  
${indent(1)}byte[] toBytes() {
${indent(2)}ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
${bufferFilling}
${indent(2)}return buffer.array();
${indent(1)}}

${indent(1)}@Override  
${indent(1)}void toBytes(ByteBuffer buffer) {
${bufferFilling}
${indent(1)}}
`;
};

const getStructDocumentation = (
  typeDef,
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[]
) => {
  return `
/**
 * <h2>${typeDef.name}</h2>
 * <p>${typeDef.desc}</p>
 * <p>Byte length: ${typeDef.size}</p>
 * ${(typeDef.fields as Field[]).map((field) => {
   const fieldType = `${field.type}${field.length ? "[]" : ""}`;
   const finalTypeName = getTypeFormTypeMap(fieldType, typeMap);
   const type = types.find((stype) => stype.name === field.type);
   const javaType = javaTypeMapping(finalTypeName);
   const typeString = `${field.type}${
     javaType !== field.type ? ` > ${javaType}` : ""
   }${finalTypeName !== field.type ? ` (${finalTypeName})` : ""}`;
   return `<p>${typeString} ${field.name} - ${(field as any).description} ${
     type.size * (field.length || 1)
   }</p>
 *`;
 })}/`;
};

const getStruct = (
  typeDef,
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[]
) => {
  return `
${getStructDocumentation(typeDef, typeMap, types)}
class ${typeDef.name} extends ByteSerializable {

${getMembers(typeDef.fields, typeMap, types)}
${getConstructors(typeDef.name, typeDef.fields, typeMap, types)}
${getMethods(typeDef.fields, typeMap, types)}
}
`;
};

const getEnumMembers = (typeDef: TypeDefinitionStrictWithSize) => {
  if (typeDef.kind === Kind.Enum) {
    return typeDef.variants
      .map(
        (v) => `
${indent(1)}${v[0].toUpperCase()}(${v[1]}),`
      )
      .concat([
        `
  UNKNOWN(99999);`,
      ])
      .join("");
  } else {
    return "";
  }
};

const getEnumMethods = (
  typeDef: TypeDefinitionStrictWithSize,
  typeMap: TypeMapping,
  javaType: string
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
${indent(1)}private static Map<Integer, ${
      typeDef.name
    }> TYPES = new HashMap<>();
${indent(1)}static {
${indent(2)}for (${typeDef.name} type : ${typeDef.name}.values()) {
${indent(3)}TYPES.put(type.value, type);
${indent(2)}}
${indent(1)}}


${indent(1)}${typeDef.name}(${javaType} newValue) {
${indent(2)}value = newValue;
${indent(1)}}

${indent(1)}/**
${indent(1)} Get ${typeDef.name} from java input
${indent(1)} * @param newValue
${indent(1)} * @return MsgType enum
${indent(1)} */
${indent(1)}public static ${typeDef.name} get${
      typeDef.name
    }(${javaType} newValue) {
${indent(2)}${typeDef.name} val = TYPES.get(newValue);
${indent(2)}return val == null ? ${typeDef.name}.UNKNOWN : val;
${indent(1)}}

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

${indent(1)}/**
${indent(1)} * Get ${typeDef.name} int value
${indent(1)} * @return int value
${indent(1)} */
${indent(1)}public ${javaType} get${typeDef.name}Value() { return value; }

${indent(1)}byte[] toBytes() {
${indent(2)}ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
${indent(2)}${byteOperators.write}
${indent(2)}return buffer.array();
${indent(1)}}

${indent(1)}void toBytes(ByteBuffer buffer) {
${indent(2)}${byteOperators.write}
${indent(1)}}
`;
  } else {
    return "";
  }
};

const getEnum = (
  typeDef: TypeDefinitionStrictWithSize,
  typeMap: TypeMapping
) => {
  if (typeDef.kind === Kind.Enum) {
    const javaTypeName = javaTypeMapping(
      typeMap[typeDef.underlying] || typeDef.underlying
    );
    return `
/**
 * Enum: ${typeDef.name}
 * ${typeDef.desc}
 */
public enum ${typeDef.name} {

${getEnumMembers(typeDef)}

${indent(1)}private final ${javaTypeName} value;

${indent(1)}private final int byteLength = ${typeDef.size};

${getEnumMethods(typeDef, typeMap, javaTypeName)}

}
`;
  } else {
    return "";
  }
};

/**
 * Generate TypeScript interfaces from Bendec types definitions
 */
export const generateString = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
) => {
  const normalizedTypes: TypeDefinitionStrict[] = normalizeTypes(typesDuck);
  const lookup = { ...keyBy(normalizedTypes, (i) => i.name) };
  const types = normalizedTypes.map((t) => ({
    ...t,
    size: getTypeSize(lookup)(t.name),
  }));
  const {
    extras = [],
    typeMapping,
    header = true,
  } = { ...defaultOptions, ...options };
  const aliasTypeMapping = types
    .filter((t) => t.kind === Kind.Alias)
    .reduce((acc, v) => ({ ...acc, [v.name]: (v as any).alias }), {});

  const arrayTypeMapping = types.reduce(
    (acc, t) => (t.kind === Kind.Array ? { ...acc, [t.name]: `char[]` } : acc),
    {}
  );

  const typeMap: TypeMapping = {
    ...defaultMapping,
    ...typeMapping,
    ...aliasTypeMapping,
    ...arrayTypeMapping,
  };

  const head = types.find(
    (t) => t.name === "Header"
  ) as TypeDefinitionStrictWithSize & { kind: Kind.Struct };
  const messageTypeDefinition = types.find((t) => t.name === "MsgType");
  const msgTypeIndex = head.fields.findIndex((f) => f.type === "MsgType");
  const msgTypeOffset = head.fields
    .filter((_f, i) => i < msgTypeIndex)
    .reduce((acc, field) => {
      const fieldType = `${field.type}${field.length ? "[]" : ""}`;
      const type = types.find((stype) => stype.name === field.type);
      acc += type.size * (field.length || 1);
      return acc;
    }, 0);

  const definitions = types.map((typeDef) => {
    switch (typeDef.kind) {
      case Kind.Struct:
        return getStruct(typeDef, typeMap, types as any);

      case Kind.Enum:
        return getEnum(typeDef, typeMap);
      default:
        return "";
    }
  });

  const result = definitions.join("\n\n");
  const extrasString = extras.join("\n");
  const HEADER = header ? "/** GENERATED BY BENDEC TYPE GENERATOR */\n" : "";
  return `${HEADER}${extrasString}
${generateBendec(msgTypeOffset, messageTypeDefinition as any)}
${result}
`;
};

/**
 * Generate TypeScript interfaces from Bender types definitions
 */
export const generate = (
  types: TypeDefinition[],
  fileName: string,
  options?: Options
) => {
  const moduleWrapped = generateString(types, options);

  fs.writeFileSync(fileName, moduleWrapped);
  console.log(`WRITTEN: ${fileName}`);
};
