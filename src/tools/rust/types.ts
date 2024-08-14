import { TypeDefinition, TypeDefinitionStrict, EnumStrict, EnumVariantStrict } from '../../'

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
  Private = 'Private',
  InCrate = 'InCrate',
  InPath = 'InPath',
}

// Inner type is going to be public which is just a glorified alias
export type NewtypePublic = {
  kind: NewtypeKind.Public,
  intoInner?: boolean,
  asInner?: boolean,
  constr?: boolean,
  deref?: boolean
}

// Constructor for newtype will be generated
export type NewtypePrivate = {
  kind: NewtypeKind.Private,
  intoInner?: boolean,
  asInner?: boolean,
  constr?: boolean,
  deref?: boolean
}

// Constructor will have to be defined in the specified module
export type NewtypeInCrate = {
  kind: NewtypeKind.InCrate,
  intoInner?: boolean,
  asInner?: boolean,
  constr?: boolean,
  deref?: boolean
}

// Constructor will have to be defined in the specified module
export type NewtypeInPath = {
  kind: NewtypeKind.InPath,
  module: string,
  intoInner?: boolean,
  asInner?: boolean,
  constr?: boolean,
  deref?: boolean
}

// Union of new type kinds
export type NewtypeDef = NewtypePublic
  | NewtypePrivate
  | NewtypeInCrate
  | NewtypeInPath

// Metadata for the type will contain newtype annotations
export type TypeMeta = {
  annotations?: string[]
  newtype?: NewtypeDef
  fields?: FieldsMeta
  bitflags?: boolean
  implConst?: boolean
  union?: UnionMeta
  publicFields?: string[]
  privateFields?: string[]
}

export type TypeMetaStrict = {
  annotations: string[]
  newtype: NewtypeDef | null
  fields: FieldsMeta
  bitflags: boolean
  implConst: boolean
  union: UnionMeta | null
  publicFields: string[] | null
  privateFields: string[]
}

// This is only for union types generation
// used if you want to represent your unions as enums
// You have to define the size od the discriminator
// and provide values for fields that form it
export type UnionMeta = {
  underlying: string,
  discVariant: string,
  discFn?(variant: number): number
}

export type EnumConversionError = {
  type: string,
  constructor: string,
}

export type DefaultDerives = {
  struct?: string[],
  enum?: string[],
  bitflags?: string[],
  newtype?: string[],
}

// Options to the type generator
export type Options = {
  // These types are just here for lookup so we can resolve shared types
  lookupTypes?: TypeDefinition[][],
  typeMapping?: TypeMapping
  extras?: string[]
  defaultDerives?: DefaultDerives,
  // TODO: extra derives should be moved to the options.meta property
  extraDerives?: Record<TypeName, string[]>
  meta?: Record<TypeName, TypeMeta>
  camelCase?: boolean,
  enumConversionError?: EnumConversionError,
  // You have a chance to generate extra code for each typeDefinition
  forEachType?: ([generated, context, meta]: [string, TypeDefinitionStrict, TypeMetaStrict]) => string
  transparentBitflags?: boolean
}
