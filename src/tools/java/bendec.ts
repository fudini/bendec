import { lowerFirst } from "lodash";
import { Kind } from "../..";
import { TypeDefinitionStrictWithSize } from "./types";
import { header, indent } from "./utils";

export const generateBendec = (
  msgTypeOffset: number,
  messageTypeDefinition: TypeDefinitionStrictWithSize & { kind: Kind.Enum },
  packageName?: string
) => {
  return `
${header(false, packageName)}
import java.util.Optional;
  
public class Bendec {
${indent(1)}void handleMessage(byte[] bytes) {
${indent(2)}MsgType msgType = MsgType.getMsgType(bytes, ${msgTypeOffset});
${indent(3)}switch (msgType) {
${messageTypeDefinition.variants
  .map(
    (v) => `
${indent(4)}case ${v[0].toUpperCase()}:
${indent(5)}${v[0]} ${lowerFirst(v[0])} = new ${v[0]}(bytes, 0);
${indent(5)}handle${v[0]}(${lowerFirst(v[0])});
`
  )
  .join("")}
${indent(4)}default:
${indent(
  5
)}System.out.println("unknown message type: " + msgType + bytes.toString());
${indent(5)}break;
${indent(3)}}
${indent(1)}}


${messageTypeDefinition.variants
  .map(
    (v) => `
${indent(1)}void handle${v[0]}(${v[0]} ${lowerFirst(v[0])}) {
${indent(2)}System.out.println(${lowerFirst(v[0])}.toString());
${indent(1)}}
`
  )
  .join("")}

${indent(
  1
)}public static Optional<Object> createBendecObject(MsgType type, byte[] bytes){
${indent(2)}switch (type) {
${messageTypeDefinition.variants
  .map(
    (v) => `
${indent(3)}case ${v[0].toUpperCase()}:
${indent(4)}return Optional.of(new ${v[0]}(bytes));
`
  )
  .join("")}
${indent(3)}default:
${indent(4)}return Optional.empty();
${indent(2)}}

${indent(1)}}
}
`;
};
