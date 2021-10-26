import { generateFileDefinitions, generateFiles } from "../tools/javaGenerator"
import test from "tape"
import { types } from "./fixtures"

test("Generate java library files", ( t ) => {
  const fileDefinitions = generateFileDefinitions(types, {
    packageName: "com.my.package",
  });
  generateFiles(fileDefinitions, "src/tests/generated/java");
  t.end()
})
