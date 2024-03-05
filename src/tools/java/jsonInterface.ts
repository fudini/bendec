import {header, indentBlock} from "./utils"
import {
  FieldWithJavaProperties,
  JavaInterface,
  TypeDefinitionStrictWithSize,
  TypeMapping,
  TypeReadWriteDefinition
} from "./types"
import {Kind, Struct} from "../../types"
import {includes, upperFirst} from "lodash"

export function jsonSerializableGenerator(packageName: string) : JavaInterface {
  return {
    interfaceName: "JsonSerializable",
    interfaceBody: {
      path: packageName.replace(/\./g, "/"),
      name: "JsonSerializable.java",
      body: jsonSerializableFile(packageName)
    },
    imports: indentBlock(`import ${packageName}.JsonSerializable;
          import com.fasterxml.jackson.databind.node.ArrayNode;
          import com.fasterxml.jackson.databind.node.ObjectNode;
          import com.fasterxml.jackson.databind.ObjectMapper;
          import com.fasterxml.jackson.databind.node.JsonNodeFactory;
          import com.fasterxml.jackson.databind.node.TextNode;`),
    structMethods: getStructJsonMethods,
    enumMethods: getEnumJsonMethods,
    addInterfaceOrNot: (typeDef) => true
  }
}

export const jsonSerializableFile = (packageName: string) => indentBlock(`${header(
  packageName,
  indentBlock(`import com.fasterxml.jackson.databind.json.JsonMapper;
    import com.fasterxml.jackson.databind.node.ObjectNode;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.fasterxml.jackson.databind.node.JsonNodeFactory;
    import com.fasterxml.jackson.databind.node.TextNode;`, 4))}
    
    public interface JsonSerializable {
    
        JsonMapper MAPPER = new JsonMapper();
      
        abstract ObjectNode toJson();
        abstract ObjectNode toJson(ObjectNode object);
    
    }
    `)

const getStructJsonMethods = (
  fields: FieldWithJavaProperties[],
  types: TypeDefinitionStrictWithSize[],
  typeDef: Struct,
  typeMap: TypeMapping
) : string => {
  const jsonFilling = fields
    .map((field) => {
      return `${typesToJsonOperators(
        field.name,
        field.finalTypeName,
        typeMap,
        field.length || field.typeLength || 0
        ).write}`
    })
    .join("\n")
  return indentBlock(`@Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        ${indentBlock(jsonFilling, 8, 0)}
        return object;
    }
    
    @Override  
    public ObjectNode toJson(ObjectNode object) {
        ${indentBlock(jsonFilling, 8, 0)}
        return object;
    }`)
}

const getEnumJsonMethods = (
  fields: FieldWithJavaProperties[],
  types: TypeDefinitionStrictWithSize[],
  typeDef: TypeDefinitionStrictWithSize,
  typeMap: TypeMapping
) : string => {
  if (typeDef.kind === Kind.Enum) {
    if (typeDef.bitflags) {
      return indentBlock(`
        public ArrayNode toJson() {
            ArrayNode arrayNode = JsonSerializable.MAPPER.createArrayNode();
            this.getFlags().stream().map(Enum::toString).forEach(arrayNode::add);
            return arrayNode;
        }
        `)
    } else {
      return indentBlock(`
        public TextNode toJson() {
            return JsonNodeFactory.instance.textNode(name());
        }
        `)
    }
  } else {
    return "";
  }
}

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
      }
    case "u16":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    case "u32":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    case "u64":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    case "i64":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    case "f64":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    case "bool":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    case "char":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    case "char[]":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    case "u8[]":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      }
    default:
      if (type.includes("[]")) {
        const unarrayedType = type.replace("[]", "");
        const isSimpleType = includes(["u8", "u16", "u32", "u64", "i64", "f64", "bool", "char"], unarrayedType)
        return {
          read: ``,
          write: indentBlock(`ArrayNode array${upperFirst(fieldName)}=JsonSerializable.MAPPER.createArrayNode();
            for(int i = 0; i < ${fieldName}.length; i++) {
                array${upperFirst(fieldName)}.add(${fieldName}[i]${isSimpleType ? "" : ".toJson()"});
            }
            object.set("${fieldName}", array${upperFirst(fieldName)});`),
        };
      } else {
        return {
          read: ``,
          write: `object.set("${fieldName}", ${fieldName}.toJson());`,
        }
      }
  }
}