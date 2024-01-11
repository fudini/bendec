import {Kind} from "../.."
import {header, indentBlock, javaTypeMapping} from "./utils"
import {getInterfacesImports, Options, TypeDefinitionStrictWithSize, TypeMapping} from "./types"

const getEnumVariant = (variant) => {
  const variantDesc = variant[2] ? `/**
 * ${variant[2]}
 */\n` : '';
  return variantDesc + `${variant[0].toUpperCase()}(${variant[1]}),\n`
}

const getEnumMembers = (typeDef: TypeDefinitionStrictWithSize) => {
  if (typeDef.kind === Kind.Enum) {
    return typeDef.variants
      .map(v => getEnumVariant(v))
      .concat([!!typeDef.variants.find((v) => v[0].toUpperCase() === "UNKNOWN") ? ";" : `UNKNOWN(99999);`,])
      .join("")
  } else {
    return ""
  }
}

const getEnumMethods = (
  typeDef: TypeDefinitionStrictWithSize,
  typeMap: TypeMapping,
  javaType: string,
  options: Options
) => {
  if (typeDef.kind === Kind.Enum) {
    return indentBlock(`
      private static final Map<Integer, ${typeDef.name}> TYPES = new HashMap<>();
      static {
          for (${typeDef.name} type : ${typeDef.name}.values()) {
              TYPES.put(type.value, type);
          }
      }
      
      ${typeDef.name}(${javaType} newValue) {
          value = newValue;
      }
      
      /**
       * Get ${typeDef.name} from java input
       * @param newValue
       * @return ${typeDef.name} enum
       */
      public static ${typeDef.name} get${typeDef.name}(${javaType} newValue) {
          ${typeDef.name} val = TYPES.get(newValue);
          return val == null ? ${typeDef.name}.UNKNOWN : val;
      }
      
      /**
       * Get ${typeDef.name} int value
       * @return int value
       */
      public ${javaType} get${typeDef.name}Value() {
          return value; 
      }
      `)
  } else {
    return ""
  }
}

export const getEnum = (
  typeDef: TypeDefinitionStrictWithSize,
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[],
  options: Options
) => {
  if (typeDef.kind === Kind.Enum) {
    const javaTypeName = javaTypeMapping(
      typeMap[typeDef.underlying] || typeDef.underlying
    );
    const interfaceBody = options.interfaces.map(i => i.enumMethods(null, types, typeDef, typeMap))
      .filter((x: string) => x.length > 0).join("\n\n")

    return indentBlock(`${indentBlock(header(options.bendecPackageName, getInterfacesImports(options.interfaces)), 6, 0)}
      
      /**
       * Enum: ${typeDef.name}
       * ${typeDef.description}
       */
      public enum ${typeDef.name} {
          ${indentBlock(getEnumMembers(typeDef), 10, 0)}
          
          private final ${javaTypeName} value;
          private final int byteLength = ${typeDef.size};
          
          ${indentBlock(getEnumMethods(typeDef, typeMap, javaTypeName, options), 10, 0)}
          
          ${indentBlock(interfaceBody, 10, 0)}
      }
      `)
  } else {
    return ""
  }
}
