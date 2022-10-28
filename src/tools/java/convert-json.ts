import {Kind, TypeDefinition} from "../../types";

export function convertJson(json): TypeDefinition[] {
  return json.map(convertByType);
}

function convertByType(
  object: any
): TypeDefinition {
  switch (object.kind) {
    case "Primitive":
      return {
        name: object.name,
        kind: Kind.Primitive,
        size: primitiveSize(object.name),
        description: object.description,
      };
    case "Alias":
      return {
        name: object.name,
        kind: Kind.Alias,
        alias: (object as any).alias || (object as any).underlying,
        description: object.description,
      };
    case "Struct":
      return {
        name: object.name,
        kind: Kind.Struct,
        fields: object.fields!,
        description: object.description,
      };
    case "Enum":
      return {
        name: object.name,
        kind: Kind.Enum,
        underlying: object.underlying!,
        variants: object.variants! as any,
        description: object.description,
      };
    case "Union":
      return {
        name: object.name,
        kind: Kind.Union,
        members: object.members!,
        discriminator: object.discriminator!,
        description: object.description,
      };
    case "Array":
      return {
        name: object.name,
        kind: Kind.Array,
        type: object.type!,
        length: object.length,
        description: object.description,
      };
    default:
      throw new Error(
        `Unknown kind ${object.kind} in ${JSON.stringify(object)}`
      );
  }
}

function primitiveSize(name: string): number {
  switch (name) {
    case "u8":
      return 1;
    case "bool":
      return 1;
    case "u16":
      return 2;
    case "u32":
      return 4;
    case "u64":
      return 8;
    case "i64":
      return 8;
    case "f64":
      return 8;
    default:
      throw new Error(`Unknown primitive type ${name}`);
  }
}
