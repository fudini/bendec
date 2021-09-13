import { Field } from "../..";
import { TypeDefinitionStrict } from "../../types";

export interface TypeReadWriteDefinition {
  read: string;
  write: string;
}

export type TypeMapping = Record<string, string>;

export type TypeDefinitionStrictWithSize = TypeDefinitionStrict & {
  size: number;
};

export type Options = {
  withJson: boolean;
  typeMapping?: TypeMapping;
  header?: boolean;
  packageName?: string;
};

export interface FieldWithJavaProperties extends Field {
  typeSize: number;
  javaType: string;
  finalTypeName: string;
  typeLength?: number;
}
