import {Field} from "../..";
import {Kind, Struct, TypeDefinitionStrict} from "../../types";

export interface TypeReadWriteDefinition {
  read: string;
  write: string;
}

export type TypeMapping = Record<string, string>;

export type TypeDefinitionStrictWithSize = TypeDefinitionStrict & {
  size: number;
};

export type JavaFile = {
  path: string,
  name: string,
  body: string,
};

export type JavaInterface = {
  interfaceName: string;
  interfaceBody: JavaFile;
  imports: string,
  structMethods: (properties: FieldWithJavaProperties[], types: TypeDefinitionStrictWithSize[], typeDef: TypeDefinitionStrictWithSize, typeMap: TypeMapping) => string;
  enumMethods: (properties: FieldWithJavaProperties[], types: TypeDefinitionStrictWithSize[], typeDef: TypeDefinitionStrictWithSize, typeMap: TypeMapping) => string;
  addInterfaceOrNot: (typeDef) => boolean;
};

export interface Options {
  typeMapping?: TypeMapping;
  bendecPackageName: string;
  repositories?: Repository[];
  interfaces?: JavaInterface[];
};
export const getInterfacesImports = (interfaces: JavaInterface[]): string => {
  return interfaces.map(i => i.imports).filter((x: string) => x.length > 0).join("\n");
}

export interface FieldWithJavaProperties extends Field {
  typeSize: number;
  javaType: string;
  finalTypeName: string;
  typeLength?: number;
}

export interface FieldWithJavaAndDbProperties extends FieldWithJavaProperties {
  id?: boolean;
  enum?: boolean;
  relation?: Relation;
}

export interface Relation {
  type: 'ManyToOne' | 'OneToMany',
  structs: string[];
}

export type PredefinedRelations = Relation & { byField: string }

export interface Repository {
  schema?: string;
  packageName: string;
  mainStructs: string[];
  predefinedRelations: Record<string, PredefinedRelations[]>;
  withFilters?: boolean;
}

export type RepositoryWithDependecies = Repository & {
  mainTypes: DbStruct[];
  dependentTypes: { type: DbStruct, dependentTo: string, dependentByField: string, parent?: boolean, parentTo?: string[] }[];
}

type KindRequiredOmitFields<T extends { kind?: Kind }> = Pick<T, Exclude<keyof T, 'kind' | 'fields'>> & {
  kind: T['kind']
}
export type DbStruct =
  KindRequiredOmitFields<Struct>
  & { fields: FieldWithJavaAndDbProperties [], childOf?: DbStruct, parent?: boolean };