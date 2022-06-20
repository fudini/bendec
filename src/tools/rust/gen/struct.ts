import { indent, smoosh } from '../../utils'
import { snakeCase } from 'lodash'
//import { doc, createDerives, toRustNS } from '../../rust/utils'
import { doc, createDerives, toRustNS } from '../../rust/utils'
import { Field } from '../../../'
import {
  Lookup, Kind, StructStrict,
  AliasStrict, EnumStrict, UnionStrict
} from '../../../types'
import {
  TypeName, TypeMapping, TypeMeta, Options, FieldName, FieldMeta
} from '../../rust/types'

export const getStruct = (
  typeDef: StructStrict,
  lookup: Lookup,
  typeMap: TypeMapping,
  meta: Record<string, TypeMeta>,
  extraDerivesArray: string[],
  camelCase: boolean
) => {
  const typeName = typeDef.name
  const fieldsMeta = meta[typeName]?.fields

  const [members, hasBigArray] = typeDef.fields
    ? getMembers(lookup, typeDef.fields, typeMap, meta, fieldsMeta)
    : [[], false]

  const membersString = members.join('\n')
  
  const derives = ['Serialize', 'Deserialize']
  const defaultDerive = hasBigArray ? [] : ['Default']
  const derivesString = createDerives([
    ...defaultDerive,
    ...derives,
    ...extraDerivesArray
  ])
  const serdeString = hasBigArray
    ? '#[serde(deny_unknown_fields)]'
    : '#[serde(deny_unknown_fields, default)]'
  const serdeCamelCase = camelCase
    ? '#[serde(rename_all = "camelCase")]'
    : ''

  return smoosh([
    doc(typeDef.description),
    `#[repr(C, packed)]`,
    derivesString,
    serdeString,
    serdeCamelCase,
    `pub struct ${typeName} {`,
    `${membersString}`,
    `}`
  ])
}

const getMembers = (
  lookup: Lookup,
  fields: Field[],
  typeMap: TypeMapping,
  meta: Record<TypeName, TypeMeta>,
  fieldsMeta: Record<FieldName, FieldMeta>,
): [string[], boolean] => {
  // TODO: remove this when Defaults get removed
  let hasBigArray = false

  let fieldsArr = fields.map(field => {
    // expand the namespace . in to ::
    const fieldTypeName = toRustNS(field.type)
    const key = fieldTypeName + (field.length ? '[]' : '')
    const rustType = field.length ? `[${fieldTypeName}; ${field.length}]` : fieldTypeName
    const finalRustType = (typeMap[key] !== undefined)
      ? typeMap[key](field.length)
      : rustType

    const fieldAnnotations = fieldsMeta?.[field.name]?.annotations || []
    const generatedField =  `  pub ${snakeCase(field.name)}: ${finalRustType},`
    
    const typeMeta = meta[fieldTypeName]
    const isNewtype = typeMeta?.newtype !== undefined

    if (field.length > 32 && !isNewtype) {
      hasBigArray = true
    }

    const type = lookup[field.type]

    if (type === undefined) {
      console.log(`Field type not found ${field.type}`)
    } else if (type.kind === Kind.Array && type.length > 32 && !isNewtype) {
      hasBigArray = true
    }

    return smoosh([
      doc(field.description, 2),
      ...fieldAnnotations.map(indent(2)),
      generatedField
    ])
  })

  return [fieldsArr, hasBigArray]
}

