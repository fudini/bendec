import { Field } from "../.."
import { Kind, TypeDefinitionStrict } from "../../types"

export interface TypeReadWriteDefinition {
  read: string
  write: string
}

export type TypeMapping = Record<string, string>

export type TypeDefinitionStrictWithSize = TypeDefinitionStrict & {
  size: number
}

export type Options = {
  typeMapping?: TypeMapping
  header?: boolean
  packageName?: string
}

export interface FieldWithJavaProperties extends Field {
  typeSize: number
  javaType: string
  finalTypeName: string
  typeLength?: number
}

export interface ExtendedStructTypeDef {
  size: any
  name: string
  desc?: string
  fields: Field[]
  kind: Kind.Struct
}

export interface FormFile {
  name: string
  path: string
  body: string
}