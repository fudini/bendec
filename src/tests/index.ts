import test from "tape";
import * as _ from "lodash";
import { MsgType, types } from "./fixtures";
import {
  Bendec,
  invertLookup,
  fastReaders,
  fastWriters,
  asciiReader,
  asciiWriter,
} from "../";
import { Login } from "./types";
import { generate } from "../tools/javaGenerator";
import { convertJson } from "../tools/java/convert-json";
import { marketTypes, sharedTypes } from "../tools/java/fixtures";

// lets override readers and writers so we can deal with ascii
const readers = { "char[]": asciiReader };
const writers = { "char[]": asciiWriter };

const lookup = invertLookup(MsgType);

const getVariant = {
  encode: (message) => lookup[message.header.msgType],
  decode: (buffer) => lookup[buffer.readUInt8()],
};

const bendec = new Bendec<any>({ types, getVariant, readers, writers });

const allFastReaders = { ...fastReaders, ...readers };
const allFastWriters = { ...fastWriters, ...writers };

test("Bendec login decod", (t) => {
  console.log("start");
  const login: Login = {
    header: {
      msgType: 1,
    },
    connectionId: 1,
    token: "11111111",
  };
  const encodedLogin = bendec.encodeAs(login, "Login");
  console.log(encodedLogin);
  const decodedLogin = bendec.decodeAs(encodedLogin, "Login");
  console.log(decodedLogin);
  generate(convertJson([...(marketTypes as any), ...sharedTypes]), "java");
  t.deepEqual(encodedLogin, decodedLogin);
  t.end();
});
