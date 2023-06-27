import { indent, smoosh } from '../../utils'
import { snakeCase } from 'lodash'
import { doc, createDerives, toRustNS } from '../../rust/utils'
import { Field } from '../../../'
import { Lookup, StructStrict } from '../../../types'
import { TypeMapping, TypeMeta, FieldName, FieldMeta } from '../../rust/types'

export const getStruct = (
  typeDef: StructStrict,
  lookup: Lookup,
  typeMap: TypeMapping,
  meta: TypeMeta,
  defaultDerives: string[],
  extraDerivesArray: string[],
  camelCase: boolean
) => {
  const typeName = typeDef.name
  const fieldsMeta = meta?.fields

  const members = typeDef.fields
    ? getMembers(lookup, typeDef.fields, typeMap, fieldsMeta)
    : []

  const membersString = members.join('\n')
  
  // TODO: maybe glue it together and pass in
  const allDerives = [...defaultDerives, ...extraDerivesArray]
  const derivesString = createDerives(allDerives)
  // Only if the struct has Default we can deserialize from missing fields
  const serdeString = !allDerives.includes('Default')
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
  fieldsMeta: Record<FieldName, FieldMeta>,
): string[] => {

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
    
    const type = lookup[field.type]

    if (type === undefined) {
      console.log(`Field type not found ${field.type}`)
    }

    return smoosh([
      doc(field.description, 2),
      ...fieldAnnotations.map(indent(2)),
      generatedField
    ])
  })

  return fieldsArr
}

