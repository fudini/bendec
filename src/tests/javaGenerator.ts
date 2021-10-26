import { generate } from "../tools/javaGenerator"
import test from "tape"
import { types } from "./fixtures"

test("Generate java library files", ( t ) => {
  generate(types, "java-generated", { withJson: false })
  t.end()
})
