import {EnumStrict, Kind} from "../.."
import {header, indentBlock, javaTypeMapping} from "./utils"
import {GenerationBase, getInterfacesImports, Options, TypeDefinitionStrictWithSize, TypeMapping} from "./types"

const getEnumVariant = (variant) => {
  const variantDesc = variant[2] ? indentBlock(`/**
    * ${variant[2]}
    */`, 1, 0)+"\n" : '';
  return `${variantDesc}${variant[0].toUpperCase()}(${variant[1]})`
}

const getEnumMembers = (typeDef: TypeDefinitionStrictWithSize) => {
  return (typeDef as EnumStrict).variants
    .map(v => getEnumVariant(v))
    .join(",\n") + ";"
}

export const getEnum = (typeDef: TypeDefinitionStrictWithSize, genBase: GenerationBase) => {
  if (typeDef.kind === Kind.Enum) {
    const javaTypeName = javaTypeMapping(genBase,
      genBase.typeMap[typeDef.underlying] || typeDef.underlying
    );
    const interfaceBody = genBase.options.interfaces.map(i => i.enumMethods(null, genBase, typeDef))
      .filter((x: string) => x.length > 0).join("\n\n")

    let importsExtension = genBase.options.importExtender ? genBase.options.importExtender.map(t => t.call(typeDef, genBase, typeDef)).join("\n\n") : ""
    if (importsExtension) importsExtension = "\n\n" + importsExtension + "\n\n"

    let bodyExtension = genBase.options.typeExtender ? genBase.options.typeExtender.map(t => t.call(typeDef, genBase, typeDef)).join("\n\n") : ""
    if (bodyExtension) bodyExtension = "\n\n" + bodyExtension + "\n\n"

    if (typeDef.bitflags)
      return getBitflags(javaTypeName, typeDef, interfaceBody, genBase.options, bodyExtension, importsExtension)
    else
      return getEnumClassic(javaTypeName, typeDef, interfaceBody, genBase.options, bodyExtension, importsExtension)
  } else {
    return ""
  }
}

const getEnumClassic = (
  javaTypeName: string,
  typeDef: TypeDefinitionStrictWithSize,
  interfaceBody: string,
  options: Options,
  bodyExtension: string,
  importsExtension: string
) => {
  return indentBlock(`${indentBlock(header(options.bendecPackageName, getInterfacesImports(options.interfaces)), 4, 0)}
    ${indentBlock(importsExtension, 4, 0)}
    /**
     * Enum: ${typeDef.name}
     * ${typeDef.description}
     */
    public enum ${typeDef.name} {
        ${indentBlock(getEnumMembers(typeDef), 8, 0)}
        
        private final ${javaTypeName} value;
        private final int byteLength = ${typeDef.size};
        
        private static final Map<Integer, ${typeDef.name}> TYPES = new HashMap<>();
        static {
            for (${typeDef.name} type : ${typeDef.name}.values()) {
                TYPES.put(type.value, type);
            }
        }
        
        ${typeDef.name}(${javaTypeName} newValue) {
            value = newValue;
        }
        
        /**
         * Get ${typeDef.name} by attribute
         * @param val
         * @return ${typeDef.name} enum or null if variant is undefined
         */
        public static ${typeDef.name} get${typeDef.name}(${javaTypeName} val) {
            return TYPES.get(val);
        }
        
        /**
         * Get ${typeDef.name} int value
         * @return int value
         */
        public ${javaTypeName} get${typeDef.name}Value() {
            return value; 
        }
        ${indentBlock(bodyExtension, 8, 0)}
        ${indentBlock(interfaceBody, 8, 0)}
    }
    `)
}

const getBitflags = (
  javaTypeName: string,
  typeDef: TypeDefinitionStrictWithSize,
  interfaceBody: string,
  options: Options,
  bodyExtension: string,
  importsExtension: string
) => {
  return indentBlock(`${indentBlock(header(options.bendecPackageName, getInterfacesImports(options.interfaces)), 4, 0)}
    ${indentBlock(importsExtension, 4, 0)}
    /**
     * ${typeDef.name}
     * ${typeDef.description}
     */
    public class ${typeDef.name} {
        private ${javaTypeName} value;
        private final int byteLength = ${typeDef.size};
        
        public ${typeDef.name}(int value) {
            this.value = value;
        }
    
        public ${typeDef.name}(byte[] bytes, int offset) {
            this(BendecUtils.uInt8FromByteArray(bytes, offset));
        }
    
        public void add(${typeDef.name}Options flag) {
            this.value = this.value | flag.getOptionValue();
        }
        
        public void remove(${typeDef.name}Options flag) {
            this.value = this.value ^ flag.getOptionValue();
        }
    
        public Set<${typeDef.name}Options> getFlags() {
            HashSet<${typeDef.name}Options> options = new HashSet<>();
            for (${typeDef.name}Options option : ${typeDef.name}Options.values()) {
                if (isAdded(option))
                    options.add(option);
            }
            if (options.size() > 1)
                options.remove(${typeDef.name}Options.TYPES.get(0));
            return options;
        }
    
        public boolean isAdded(${typeDef.name}Options flag) {
            return (this.value | flag.getOptionValue()) == this.value;
        }
    
        public int getValue() {
            return value;
        }
        ${indentBlock(bodyExtension, 8, 0)}
        ${indentBlock(interfaceBody, 8, 0)}
        
        public enum ${typeDef.name}Options {
            ${indentBlock(getEnumMembers(typeDef), 12, 0)}
            
            private final ${javaTypeName} optionValue;
            private static final Map<Integer, ${typeDef.name}Options> TYPES = new HashMap<>();
            static {
                for (${typeDef.name}Options type : ${typeDef.name}Options.values()) {
                    TYPES.put(type.optionValue, type);
                }
            }
            
            /**
             * Get ${typeDef.name}Options by attribute
             * @param val
             * @return ${typeDef.name}Options enum or null if variant is undefined
             */
            public static ${typeDef.name}Options get${typeDef.name}(${javaTypeName} val) {
                return TYPES.get(val);
            }
            
            ${typeDef.name}Options(${javaTypeName} newValue) {
                this.optionValue = newValue;
            }
            
            public int getOptionValue() {
                return optionValue;
            }
        }
    }
    `)
}