export * from '../../rust/types'

import { NewtypeKind, NewtypeDef, TypeMeta } from '../../rust/types'
import { smoosh } from '../../utils'
import { doc, createDerives, toRustNS } from '../../rust/utils'

// Generate code for alias
export const getAlias = (
  name: string,
  alias: string,
  meta: TypeMeta,
  defaultDerives: string[],
  extraDerivesArray: string[],
  description?: string,
): string => {
 
  let newtype = meta?.newtype;
  let rustAlias = toRustNS(alias);
  let docString = doc(description)

  if (newtype === undefined) {
    return smoosh([
      docString,
      `pub type ${name} = ${rustAlias};`
    ])
  }

  let derivesString = createDerives([
    ...defaultDerives,
    ...extraDerivesArray
  ])
  let newtypeCode = getNewtypeBody(name, alias, newtype)

  return smoosh([docString, derivesString, newtypeCode])
}

// Returns a deref code for newtype impl Deref
const getNewtypeDeref = (
  typeName: string,
  rustAlias: string
): string => {
  return `impl std::ops::Deref for ${typeName} {
  type Target = ${rustAlias};
  fn deref(&self) -> &Self::Target {
    &self.0
  }
}` 
}

const getNewtypeIntoInner = (
  typeName: string,
  rustAlias: string,
): string => {
  return `impl ${typeName} {
  pub fn into_inner(self) -> ${rustAlias} {
    self.0
  }
}` 
}

// Returns a as_inner code for newtype impl
const getNewtypeAsInner = (
  typeName: string,
  rustAlias: string,
): string => {
  return `impl ${typeName} {
  pub fn as_inner(&self) -> ${rustAlias} {
    self.0
  }
}` 
}

const getNewtypeConstr = (
  typeName: string,
  rustAlias: string
): string => {
  return `impl ${typeName} {
  pub fn new(v: ${rustAlias}) -> Self {
    Self(v)
  }
}`
}

// Return the body of new type
const getNewtypeVisibility = (
  name: string, 
  alias: string,
  newtype: NewtypeDef
): string => {

  let rustAlias = toRustNS(alias);

  switch (newtype.kind) {
    case NewtypeKind.Public:
      return `pub struct ${name}(pub ${rustAlias});`
    case NewtypeKind.Private:
      return `pub struct ${name}(${rustAlias});`
    case NewtypeKind.InPath:
      return `pub struct ${name}(pub(in ${newtype.module}) ${rustAlias});`
    case NewtypeKind.InCrate:
      return `pub struct ${name}(pub(crate) ${rustAlias});`
  }

}

const getNewtypeBody = (
  name: string, 
  alias: string,
  newtype: NewtypeDef 
): string => {

  let rustAlias = toRustNS(alias);
  let visibility = [getNewtypeVisibility(name, alias, newtype)]

  if (newtype.constr == true) {
    visibility.push(getNewtypeConstr(name, rustAlias))
  }

  if (newtype.intoInner == true) {
    visibility.push(getNewtypeIntoInner(name, rustAlias))
  }

  if (newtype.asInner == true) {
    visibility.push(getNewtypeAsInner(name, rustAlias))
  }

  if (newtype.deref == true) {
    visibility.push(getNewtypeDeref(name, rustAlias))
  }

  return smoosh(visibility)
}
