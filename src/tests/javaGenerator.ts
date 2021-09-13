import { generate } from "../tools/javaGenerator";
import { convertJson } from "../tools/java/convert-json";
import { marketTypes, sharedTypes } from "../tools/java/fixtures";
import test from "tape";

test("Generate java library files", (t) => {
  generate(
    convertJson([...(marketTypes as any), ...sharedTypes]),
    "java-generated",
    {
      withJson: true,
    }
  );
  t.end();
});
