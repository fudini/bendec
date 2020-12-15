import { TypeDefinition } from '../../'

export type FieldName = string
// Metadata for the struct fields
export type FieldsMeta = Record<FieldName, FieldMeta>
export type FieldMeta = {
  annotations?: string[]
}

export type TypeName = string
export type TypeMapping = Record<TypeName, (size?: number) => string>

export enum NewtypeKind {
  Public = 'Public',
  Generated = 'Generated',
  InCrate = 'InCrate',
}

// Inner type is going to be public which is just a glorified alias
export type NewtypePublic = { kind: NewtypeKind.Public }

// Constructor for newtype will be generated
export type NewtypeGenerated = { kind: NewtypeKind.Generated }

// Constructor will have to be defined in the specified module
export type NewtypeInCrate = { kind: NewtypeKind.InCrate, module: string }

// Union of new type kinds
export type NewtypeDef = NewtypePublic | NewtypeGenerated | NewtypeInCrate

// Metadata for the type will contain newtype annotations
export type TypeMeta = {
  newtype?: NewtypeDef,
  fields?: FieldsMeta,
}

// Options to the type generator
export type Options = {
  // These types are just here for lookup so we can resolve shared types
  lookupTypes?: TypeDefinition[][],
  typeMapping?: TypeMapping
  extras?: string[]
  // TODO: extra derives should be moved to the options.meta property
  extraDerives?: Record<TypeName, string[]>
  meta?: Record<TypeName, TypeMeta>
  camelCase?: boolean
}


