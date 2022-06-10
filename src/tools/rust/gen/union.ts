import { snakeCase } from 'lodash'
import { TypeDefinition, TypeDefinitionStrict, Field } from '../../../'
import { Lookup, Kind, StructStrict, AliasStrict, EnumStrict, UnionStrict } from '../../../types'
import { doc, createDerives, toRustNS } from '../../rust/utils'
import { indent } from '../../utils'

const getUnion2 = (
  { name, discriminator, members, description }: UnionStrict,
  discTypeDef: TypeDefinitionStrict
) => {
  
  const unionMembers = members.map(member => {
    return `  pub ${snakeCase(member)}: ${member},`
  }).join('\n')

  const union = `${doc(description)}
#[repr(C, packed)]
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
  where S: Serializer,
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
  pub fn size_of(disc: ${discTypeDef.name}) -> usize {
    match disc {
${unionGetSizeMembers}
    }
  }
}`

  return [union, unionSerdeSerialize, unionDeserializeJson, unionGetSize].join('\n\n')
}

export const getUnion = (
  typeDef: UnionStrict,
  types: TypeDefinitionStrict[]
): string => {
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

    if (discTypeField === undefined) {
      throw new Error(`no field '${pathSection}' in struct '${currentTypeDef.name}'`)
    }
    return <StructStrict>types.find(({ name }) => name === discTypeField.type)
  }, memberType as TypeDefinitionStrict)

  return getUnion2(typeDef, discTypeDef)
}


