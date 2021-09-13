// convert json from n8 repo (fixtures.ts) to known types

import { Kind, TypeDefinition } from "../../types";
import { marketTypes, sharedTypes } from "./fixtures";

export function convertJson(json: typeof marketTypes): TypeDefinition[] {
  return json.map(convertByType);
}

function convertByType(
  object: typeof marketTypes[0] & typeof sharedTypes[0]
): TypeDefinition {
  switch (object.kind) {
    case "Primitive":
      return {
        name: object.name,
        kind: Kind.Primitive,
        size: primitiveSize(object.name),
        desc: object.description,
      };
    case "Alias":
      return {
        name: object.name,
        kind: Kind.Alias,
        alias: (object as any).alias,
        desc: object.description,
      };
    case "Struct":
      return {
        name: object.name,
        kind: Kind.Struct,
        fields: object.fields!,
        desc: object.description,
      };
    case "Enum":
      return {
        name: object.name,
        kind: Kind.Enum,
        underlying: object.underlying!,
        variants: object.variants! as any,
        desc: object.description,
      };
    case "Union":
      return {
        name: object.name,
        kind: Kind.Union,
        members: object.members!,
        discriminator: object.discriminator!,
        desc: object.description,
      };
    case "Array":
      return {
        name: object.name,
        kind: Kind.Array,
        type: object.type!,
        length: object.length,
        desc: object.description,
      };
    default:
      throw new Error(`Unknown kind ${object.kind}`);
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
