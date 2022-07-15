/**
 * C++ code generator
 */

import * as fs from 'fs'
import * as path from 'path';
import { normalizeTypes } from '../utils'
import { TypeDefinition, TypeDefinitionStrict, Field } from '../'
import { Kind, StructStrict, EnumStrict, UnionStrict } from '../types'
import { DepGraph } from 'dependency-graph'

type TypeMapping = { [k: string]: (size: number) => string }

const cppTypeMap: { [k: string]: string } = {
    ['u8']: 'uint8_t',
    ['u16']: 'uint16_t',
    ['u32']: 'uint32_t',
    ['u64']: 'uint64_t',
    ['i8']: 'int8_t',
    ['i16']: 'int16_t',
    ['i32']: 'int32_t',
    ['i64']: 'int64_t',
    ['f64']: 'double',
}

type Options = {
    typeMapping?: TypeMapping
    attribute?: string
}

export const defaultOptions = {
    attribute: '',
}

export const defaultMapping: TypeMapping = {
    'char[]': size => `[]`,
}

const indent = (i: number) => (str: string) => {
    return '                    '.substr(-i) + str
}

const getCppType = (inName: string) => {
    return (inName in cppTypeMap) ? cppTypeMap[inName] : inName
}

const getMembers = (fields: Field[], typeMap: TypeMapping) => {
    return fields.map(field => {
        const cppType = getCppType(field.type)
        const name = (field.length) ? `${field.name}[${field.length}]` : field.name

        return `    ${cppType} ${name};`
    })
}

const getEnum = (
    {name, underlying, variants}: EnumStrict,
    attribute: string
) => {
    const variantsFields: string = variants.map(([key, value], index) => {
        // let out = `    ${key} = ${hexPad(value)}`;
        let out = `    ${key} = ${value}`;
        if (index < variants.length - 1) {
            out += ',';
        }
        return `${out}`
    }).join('\n')

    const name2typeMapFields: string = variants.map(([key, value], index) => {
        let out = `    { "${key}", ${name}::${key} }`;
        if (index < variants.length - 1) {
            out += ',';
        }
        return `${out}`
    }).join('\n')

    const type2nameMapFields: string = variants.map(([key, value], index) => {
        let out = `    { ${name}::${key}, "${key}" }`;
        if (index < variants.length - 1) {
            out += ',';
        }
        return `${out}`
    }).join('\n')

    const cppType = getCppType(underlying)
    return `${attribute}
enum class ${name}: ${cppType} {
${variantsFields}
};

static const std::map<std::string, ${name}> Name2${name} {
${name2typeMapFields}
};

static const std::map<${name}, std::string> ${name}2Name {
${type2nameMapFields}
};
`
}

const getUnion = (
    {name, discriminator, members}: UnionStrict,
    discTypeDef: TypeDefinitionStrict,
    attribute: string
) => {

    const unionMembers = members.map(member => {
        return `    ${member} u${member};`
    }).join('\n')

    const union = `${attribute}
union ${name} {
${unionMembers}
};`

    return union
}

/**
 * Generate C++ interfaces from Bendec types definitions
 */
export const generateString = (
    typesDuck: TypeDefinition[],
    options: Options = defaultOptions,
    filename: string | null = null
) => {

    class CppTypeDefinition {
        name: string;
        content: string;
        dependencies: string[];

        constructor(name: string, content: string, dependencies: string[]) {
            this.name = name;
            this.content = content;
            this.dependencies = dependencies;
        }
    }

    const ignoredTypes = ['char']

    const types: TypeDefinitionStrict[] = normalizeTypes(typesDuck)
    const {typeMapping} = {...defaultOptions, ...options}
    const typeMap: TypeMapping = {...defaultMapping, ...typeMapping}

    const definitions: CppTypeDefinition[] = types.map(typeDef => {
        const typeName = getCppType(typeDef.name)

        if (typeMap[typeName]) {
            return new CppTypeDefinition(typeName, `using ${typeName} = ${typeMap[typeName]};`, []);
        }

        if (ignoredTypes.includes(typeName)) {
            return new CppTypeDefinition(typeName, `// ignored: ${typeName}`, []);
        }

        if (typeDef.kind === Kind.Primitive) {
            return new CppTypeDefinition(typeName,`// primitive built-in: ${typeName}`, []);
        }

        if (typeDef.kind === Kind.Alias) {
            const typeAlias = getCppType(typeDef.alias);

            return new CppTypeDefinition(typeName,`using ${typeName} = ${typeAlias};`, [typeAlias]);
        }

        if (typeDef.kind === Kind.Union) {
            // determine the type of the discriminator from one of union members
            // TODO: validate if all members have discriminator
            const memberName = typeDef.members[0]
            const memberType = <StructStrict>types.find(({name}) => name === memberName)

            const discTypeDef = typeDef.discriminator.reduce((currentTypeDef, pathSection) => {

                if (currentTypeDef.kind !== Kind.Struct) {
                    throw new Error(`The path to union discriminator can only contain Structs, ${currentTypeDef.name} is not a Struct`)
                }

                const discTypeField = (<StructStrict>currentTypeDef).fields.find(({name}) => name === pathSection)
                return <StructStrict>types.find(({name}) => name === discTypeField.type)
            }, memberType as TypeDefinitionStrict)

            return new CppTypeDefinition(typeName, getUnion(typeDef, discTypeDef, options.attribute), typeDef.members);
        }

        if (typeDef.kind === Kind.Enum) {
            return new CppTypeDefinition(typeName, getEnum(typeDef, options.attribute), []);
        }

        if (typeDef.kind === Kind.Struct) {
            const members = typeDef.fields
                ? getMembers(typeDef.fields, typeMap)
                : []

            const membersString = members.join('\n')

            return new CppTypeDefinition(typeName, `${options.attribute}
struct ${typeName} {
${membersString}

    friend std::ostream &operator << (std::ostream &, const ${typeName} &);
} __attribute__ ((packed));`, typeDef.fields.map(field => field.type));
        }

        if (typeDef.kind === Kind.Array) {
            const cppType = getCppType(typeDef.type)

            return new CppTypeDefinition(typeName,`using ${typeName} = ${cppType}[${typeDef.length}];`, [typeDef.type]);
        }

    });

    let missingTypes: Set<string> = new Set();

    let contents: Map<string, string> = new Map();

    let depGraph = new DepGraph();

    Object.keys(cppTypeMap).forEach(primitive => depGraph.addNode(primitive));

    definitions.forEach(def => {
        contents.set(def.name, def.content);
        depGraph.addNode(def.name);
    });
    definitions.forEach(def => {
        def.dependencies.forEach(dep => {
            if (depGraph.hasNode(dep)) {
                depGraph.addDependency(def.name, dep);
            }
            else {
                missingTypes.add(dep);
            }
        });
    });

    const missingTypesString: string = Array.from(missingTypes).map(x => `// missing definition: ${x}`).join('\n');
    const result = missingTypesString + '\n' + depGraph.overallOrder().filter(
        (name: string) => contents.has(name)
    ).map(name => contents.get(name)).join('\n');
    let guardPrefix: string = "";
    let guardPostfix: string = "";
    if (filename != null) {
        const finalFilename: string = path.basename(filename);
        const guard: string = finalFilename.replace(/[^\w]/g, "_").toUpperCase();
        guardPrefix = `
#ifndef ${guard}
#define ${guard}
`;
        guardPostfix = `
#endif // ${guard}
`;
    }
    return `// Generated by BenDec Type Generator
${guardPrefix}
${result}
${guardPostfix}
`
}

/**
 * Generate C++ types from Bendec types definitions
 */
export const generate = (types: any[], fileName: string, options?: Options) => {
    const moduleWrapped = generateString(types, options, fileName)

    fs.writeFileSync(fileName, moduleWrapped)
    console.log(`WRITTEN: ${fileName}`)
}
