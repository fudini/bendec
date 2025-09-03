import {GenerationBase, Options, TypeDefinitionStrictWithSize, TypeMapping} from "./types"
import {header, indentBlock} from "./utils"
import {upperFirst} from "lodash"
import {Kind, StructStrict, TypeDefinitionStrict, Union} from "../../types"

export const getUnion = (typeDef, genBase: GenerationBase) => {
  const memberName = typeDef.members[0]
  const memberType = <StructStrict>genBase.types.find(({ name }) => name === memberName)
  const discTypeDef = typeDef.discriminator.reduce((currentTypeDef, pathSection) => {
    if (currentTypeDef.kind !== Kind.Struct) {
      throw new Error(`The path to union discriminator can only contain Structs, ${currentTypeDef.name} is not a Struct`)
    }
    const discTypeField = (<StructStrict>currentTypeDef).fields.find(({ name }) => name === pathSection)
    return <StructStrict>genBase.types.find(({ name }) => name === discTypeField.type)
  }, memberType as TypeDefinitionStrict)

  const firstDiscPathType = (<StructStrict>memberType).fields.find(({ name }) => name === typeDef.discriminator[0])

  const discOffset = typeDef.discriminator.reduce(([currentTypeDef, acc], pathSection) => {
    const discTypeField = (<StructStrict>currentTypeDef).fields.find(({ name }) => name === pathSection)
    const fieldIndex = currentTypeDef.fields.findIndex((f) => f.type === discTypeField.type)
    const fieldOffset = currentTypeDef.fields
      .filter((_f, i) => i < fieldIndex)
      .reduce((acc, field) => {
        const type = genBase.types.find((stype) => stype.name === field.type)
        acc += type.size * (field.length || 1)
        return acc
      }, 0)
    const discType = <StructStrict>genBase.types.find(({ name }) => name === discTypeField.type)
    return [discType, acc+fieldOffset]
  }, [memberType, 0])

  const imports : string = typeDef.discriminator
    .map(f => `import ${genBase.options.bendecPackageName}.${upperFirst(discTypeDef.name)};`)
    .reduce((a, b) => {
      if (a.indexOf(b) < 0) a.push(b)
      return a
    }, [])
    .join('\n')

  const members = genBase.types.filter(x => x.name == typeDef.name)
    .filter(x => (x as Union).discriminator.toString() == (typeDef as Union).discriminator.toString())
    .map(x => (x as Union).members)
    .reduce((acc, val) => acc.concat(val), [])

  let importsExtension = genBase.options.importExtender ? genBase.options.importExtender.map(t => t.call(typeDef, genBase, typeDef)).join("\n\n") : ""
  if (importsExtension) importsExtension = "\n\n" + importsExtension + "\n\n"

  let bodyExtension = genBase.options.typeExtender ? genBase.options.typeExtender.map(t => t.call(typeDef, genBase, typeDef)).join("\n\n") : ""
  if (bodyExtension) bodyExtension = "\n\n" + bodyExtension + "\n\n"

  return indentBlock(`${indentBlock(header(genBase.options.bendecPackageName, imports), 4,  0)}
    import java.util.Optional;
    ${indentBlock(importsExtension, 4, 0)}
    public interface ${typeDef.name} {
        ${indentBlock(generateGetDiscriminator(typeDef, discTypeDef, firstDiscPathType, discOffset), 8, 0)}

        ${indentBlock(generateSimplifiedFactory(typeDef.name, discTypeDef), 8, 0)}

        ${indentBlock(generateFactory(typeDef.name, discTypeDef, genBase.options.enumVariantsOriginalCase, members), 8, 0)}
        ${indentBlock(bodyExtension, 8, 0)}
        ${indentBlock(generateTypeClassMap(discTypeDef, genBase.options.enumVariantsOriginalCase, members), 8, 0)}
    }`)
}

const generateGetDiscriminator = (typeDef, discTypeDef, firstDiscPathType, discTypeOffset) => {
  let nestedObjects : string = ''
  for (let field of typeDef.discriminator) {
    nestedObjects += `.get${upperFirst(field)}()`
  }
  return indentBlock(`default ${upperFirst(discTypeDef.name)} get${upperFirst(discTypeDef.name)}() {
        return this${nestedObjects};
    }
    ${upperFirst(firstDiscPathType.type)} get${upperFirst(firstDiscPathType.name)}();

    static ${discTypeDef.name} get${discTypeDef.name}(byte[] bytes) {
        return ${discTypeDef.name}.get${discTypeDef.name}(bytes, ${discTypeOffset[1]});
    }\n`)
}

const generateSimplifiedFactory = (unionName, discTypeDef) : string => {
  return indentBlock(`static Optional<${unionName}> createObject(byte[] bytes) {
        return createObject(get${upperFirst(discTypeDef.name)}(bytes), bytes);
    }\n`)
}

const toUpperCaseIf = (s: string, originalCase: boolean) : string => {

  if(originalCase) {
    return s
  }
  return s.toUpperCase()
}

const generateFactory = (unionName, discTypeDef, originalCase: boolean, members) => {
  const cases = members.map(v => {
      return indentBlock(`case ${toUpperCaseIf(v, originalCase)}:
          return Optional.of(new ${v}(bytes));
      `, 4, 0)
    }).join("\n")

  return indentBlock(`static Optional<${unionName}> createObject(${discTypeDef.name} type, byte[] bytes) {
        switch (type) {
            ${indentBlock(cases, 12, 0)}
            default:
                return Optional.empty();
        }
    }`)
}

const generateTypeClassMap = (discTypeDef, originalCase: boolean, members) => {
  const classToTypeMapInitializer = members.map((v) => `put(${v}.class, ${discTypeDef.name}.${toUpperCaseIf(v, originalCase)});`).join("\n");
  const typeToClassMapInitializer = members.map((v) => `put(${discTypeDef.name}.${toUpperCaseIf(v, originalCase)}, ${v}.class);`).join("\n")
  return indentBlock(`
    static Class findClassByDiscriminator(${discTypeDef.name} type) {
        return  typeToClassMap.get(type);
    }

    static ${discTypeDef.name} findDiscriminatorByClass(Class clazz) {
        return  classToTypeMap.get(clazz);
    }

    HashMap<Class, ${discTypeDef.name}> classToTypeMap = new HashMap<>(){{
        ${indentBlock(classToTypeMapInitializer, 8, 0)}
    }};

    HashMap<${discTypeDef.name}, Class> typeToClassMap = new HashMap<>() {{
        ${indentBlock(typeToClassMapInitializer, 8, 0)}
    }};`)
}