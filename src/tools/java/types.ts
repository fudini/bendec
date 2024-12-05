import {Field} from "../.."
import {Struct, TypeDefinitionStrict} from "../../types"
import {CustomSerde} from "./utils";

export interface TypeReadWriteDefinition {
  read: string;
  write: string;
}

export type TypeMapping = Record<string, string>;

export type TypeDefinitionStrictWithSize = TypeDefinitionStrict & {
  size: number;
}

export type JavaFile = {
  path: string,
  name: string,
  body: string,
}

export type JavaInterface = {
  interfaceName: string;
  interfaceBody: JavaFile;
  imports: string,
  structMethods: (properties: FieldWithJavaProperties[], genBase: GenerationBase, typeDef: Struct) => string;
  enumMethods: (properties: FieldWithJavaProperties[], genBase: GenerationBase, typeDef: TypeDefinitionStrictWithSize) => string;
  addInterfaceOrNot: (typeDef) => boolean;
}

export interface Options {
  bendecPackageName: string
  interfaces?: JavaInterface[]
  customTypeMapping?: TypeMapping
  customSerDe?: CustomSerde
  typeExtender?: TypeExtender[]
  importExtender?: ImportExtender[]
  enumVariantsOriginalCase?: boolean
}

export type TypeExtender = (genBase: GenerationBase, typeDef) => string
export type ImportExtender = TypeExtender

export const getInterfacesImports = (interfaces: JavaInterface[]): string => {
  return interfaces.map(i => i.imports).filter((x: string) => x.length > 0).join("\n");
}

export interface FieldWithJavaProperties extends Field {
  typeSize: number;
  javaType: string;
  finalTypeName: string;
  typeLength?: number;
}

export type GenerationBase = {
  types: TypeDefinitionStrictWithSize[]
  typeMap: Record<string, string>
  options: Options
  path: string
}