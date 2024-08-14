import { snakeCase } from 'lodash'
import { TypeMetaStrict } from '../../rust/types'
import { EnumStrict, TypeDefinitionStrict } from '../../../'
import { Kind, StructStrict, UnionStrict } from '../../../types'
import { doc } from '../../rust/utils'
import { indent } from '../../utils'
import { getUnionEnum } from './union-enum'

const getUnion2 = (
  { name, discriminator, members, description }: UnionStrict,
  discTypeDef: EnumStrict
) => {

  const unionMembers = members.map(member => {
    return `  pub ${snakeCase(member)}: ${member},`
  }).join('\n')

  const union = `${doc(description)}
pub union ${name} {
${unionMembers}
}`

  const serdeMembers = members.map(member => {
    return `${discTypeDef.name}::${member} => self.${snakeCase(member)}.serialize(serializer),`
  }).map(indent(8)).join('\n')

  const discPath = discriminator.map(snakeCase).join('.')
  // we need to generate serde for union as it can't be derived
  const unionSerdeSerialize = `impl Serialize for ${name} {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    unsafe {
      match self.${snakeCase(members[0])}.${discPath} {
${serdeMembers} 
      }
    }
  }
}`

  const unionDeserializeMembers = members.map(member => {
    return `${discTypeDef.name}::${member} => ${member}::deserialize(de).map(|v| ${name} { ${snakeCase(member)}: v }),`
  }).map(indent(6)).join('\n')

  const unionDeserializeJson = `impl ${name} {
  pub fn deserialize<'de, D>(de: D, disc: ${discTypeDef.name}) -> Result<Self, D::Error>
  where
    D: Deserializer<'de>,
  {
    match disc {
${unionDeserializeMembers}
    }
  }
}`

  const unionGetSizeMembers = members.map(member => {
    return `${discTypeDef.name}::${member} => std::mem::size_of::<${member}>(),`
  }).map(indent(6)).join('\n')

  const unionGetSize = `impl ${name} {
  pub const fn size_of(disc: ${discTypeDef.name}) -> usize {
    match disc {
${unionGetSizeMembers}
    }
  }
}`

  return [union, unionSerdeSerialize, unionDeserializeJson, unionGetSize].join('\n\n')
}

export const getUnion = (
  typeDef: UnionStrict,
  types: TypeDefinitionStrict[],
  meta: TypeMetaStrict,
): string => {

  if (meta.union != null) {
    const union = meta.union
    const discTypeDef = types.find(def => def.name == union.discVariant)

    if (discTypeDef.kind != Kind.Enum) {
      console.error(`Error generating enum/union ${typeDef.name}`)
      throw new Error(`type ${union.discVariant} is not an enum`)
    }
    return getUnionEnum(typeDef, discTypeDef as EnumStrict, meta)
  }

  // determine the type of the discriminator from one of union members
  // TODO: validate if all members have discriminator
  const memberName = typeDef.members[0]
  const memberType = <StructStrict>types.find(({ name }) => name === memberName)

  const discTypeDef = typeDef.discriminator.reduce((currentTypeDef, pathSection) => {

    if (currentTypeDef.kind !== Kind.Struct) {
      throw new Error(`The path to union discriminator can only contain Structs, ${currentTypeDef.name} is not a Struct`)
    }

    const discTypeField = (<StructStrict>currentTypeDef)
      .fields
      .find(({ name }) => name === pathSection)

    // TODO: fails because it needs to know the type of the field
    if (discTypeField === undefined) {
      throw new Error(`no field '${pathSection}' in struct '${currentTypeDef.name}'`)
    }

    return <StructStrict>types.find(({ name }) => name === discTypeField.type)
  }, memberType as TypeDefinitionStrict)

  return getUnion2(typeDef, discTypeDef as EnumStrict)
}


