import {Options, TypeDefinitionStrictWithSize, TypeMapping} from "./types";
import {header, indent} from "./utils";
import {upperFirst} from "lodash";
import {Kind, StructStrict, TypeDefinitionStrict, Union} from "../../types";

export const getUnion = (
    typeDef,
    typeMap: TypeMapping,
    types: TypeDefinitionStrictWithSize[],
    options: Options
) => {
  const memberName = typeDef.members[0]
  const memberType = <StructStrict>types.find(({ name }) => name === memberName)
  const discTypeDef = typeDef.discriminator.reduce((currentTypeDef, pathSection) => {
    if (currentTypeDef.kind !== Kind.Struct) {
      throw new Error(`The path to union discriminator can only contain Structs, ${currentTypeDef.name} is not a Struct`)
    }
    const discTypeField = (<StructStrict>currentTypeDef).fields.find(({ name }) => name === pathSection)
    return <StructStrict>types.find(({ name }) => name === discTypeField.type)
  }, memberType as TypeDefinitionStrict)

  const firstDiscPathType = (<StructStrict>memberType).fields.find(({ name }) => name === typeDef.discriminator[0])

  const discOffset = typeDef.discriminator.reduce(([currentTypeDef, acc], pathSection) => {
    const discTypeField = (<StructStrict>currentTypeDef).fields.find(({ name }) => name === pathSection)
    const fieldIndex = currentTypeDef.fields.findIndex((f) => f.type === discTypeField.type);
    const fieldOffset = currentTypeDef.fields
      .filter((_f, i) => i < fieldIndex)
      .reduce((acc, field) => {
        const type = types.find((stype) => stype.name === field.type);
        acc += type.size * (field.length || 1);
        return acc;
      }, 0);
    const discType = <StructStrict>types.find(({ name }) => name === discTypeField.type)
    return [discType, acc+fieldOffset]
  }, [memberType, 0])

  const imports : string = typeDef.discriminator
    .map(f => `import ${options.bendecPackageName}.${upperFirst(discTypeDef.name)};`)
    .reduce((a, b) => {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, [])
    .join('\n');

  const members = types.filter(x => x.name == typeDef.name)
    .filter(x => (x as Union).discriminator.toString() == (typeDef as Union).discriminator.toString())
    .map(x => (x as Union).members)
    .reduce((acc, val) => acc.concat(val), []);
  return `${header(
      options.bendecPackageName,
      imports
  )}
import java.util.Optional;

public interface ${typeDef.name} {
${generateGetDiscriminator(typeDef, discTypeDef, firstDiscPathType, discOffset)}
${generateFactory(discTypeDef, members)}

}`;
};

const generateGetDiscriminator = (typeDef, discTypeDef, firstDiscPathType, discTypeOffset) => {
  let nestedObjects : string = '';
  for (let field of typeDef.discriminator) {
    nestedObjects += `.get${upperFirst(field)}()`;
  }
  return `${indent(1)}default ${upperFirst(discTypeDef.name)} get${upperFirst(discTypeDef.name)}() {
${indent(2)}return this${nestedObjects};
${indent(1)}}
${indent(1)}${upperFirst(firstDiscPathType.type)} get${upperFirst(firstDiscPathType.name)}();

${indent(1)}static ${discTypeDef.name} get${discTypeDef.name}(byte[] bytes) {
${indent(2)}return ${discTypeDef.name}.get${discTypeDef.name}(bytes, ${discTypeOffset[1]});
${indent(1)}}\n`;
}

const generateFactory = (discTypeDef, members) => {
  return `${indent(1)}static Optional<Object> createObject(${discTypeDef.name} type, byte[] bytes){
${indent(2)}switch (type) {
${members.map(
          (v) => `
${indent(3)}case ${v.toUpperCase()}:
${indent(4)}return Optional.of(new ${v}(bytes));
`
      )
      .join("")}
${indent(3)}default:
${indent(4)}return Optional.empty();
${indent(2)}}
${indent(1)}}`
}