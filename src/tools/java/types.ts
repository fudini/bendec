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
  extras?: string[];
  typeMapping?: TypeMapping;
  header?: boolean;
};
