import path from 'path'
import {generateFiles} from "../tools/javaGenerator";
import test from "tape";
import {codeEquals} from './utils'
import {types, unions, arrays} from './fixtures'
import {jsonSerializableGenerator} from "../tools/java/jsonInterface";
import {binSerializableGenerator} from "../tools/java/binarySerializableInterface";

const {mkdirSync, rmSync, opendirSync, readFileSync} = require('fs')

test('Java unions and enums', t => {
  const tempDir = "./java/tmp"
  mkdirSync(tempDir, {recursive: true})

  const bendecPackageName = "bendec.unions";
  generateFiles([...unions], tempDir, {
    bendecPackageName,
    interfaces: [
      binSerializableGenerator(bendecPackageName),
      jsonSerializableGenerator(bendecPackageName)
    ],
  });

  const generationPath = path.join(__dirname.replace('dist', 'src'), "../..", tempDir, bendecPackageName.replace(".", "/"))
  const referencePath = path.join(__dirname.replace('dist', 'src'), "generated/java", bendecPackageName.replace(".", "/"))
  const generationDir = opendirSync(generationPath)
  let dirent
  while ((dirent = generationDir.readSync()) !== null) {
    const referenceFile = readFileSync(path.join(referencePath, dirent.name), 'utf8')
    const generatedFile = readFileSync(path.join(generationPath, dirent.name), 'utf8')
    codeEquals(t)(generatedFile, referenceFile)
  }
  generationDir.closeSync()
  rmSync(tempDir, {recursive: true, force: true});
  t.end()
})

test('Java fixtures', t => {
  const tempDir = "./java/tmp"
  mkdirSync(tempDir, {recursive: true})

  const bendecPackageName = "bendec.fixtures";
  generateFiles([...types], tempDir, {
    bendecPackageName,
    interfaces: [
      binSerializableGenerator(bendecPackageName),
      jsonSerializableGenerator(bendecPackageName)
    ],
  });

  const generationPath = path.join(__dirname.replace('dist', 'src'), "../..", tempDir, bendecPackageName.replace(".", "/"))
  const referencePath = path.join(__dirname.replace('dist', 'src'), "generated/java", bendecPackageName.replace(".", "/"))
  const generationDir = opendirSync(generationPath)
  let dirent
  while ((dirent = generationDir.readSync()) !== null) {
    const referenceFile = readFileSync(path.join(referencePath, dirent.name), 'utf8')
    const generatedFile = readFileSync(path.join(generationPath, dirent.name), 'utf8')
    codeEquals(t)(generatedFile, referenceFile)
  }
  generationDir.closeSync()
  rmSync(tempDir, {recursive: true, force: true});
  t.end()
})

test('Java arrays', t => {
  const tempDir = "./java/tmp"
  mkdirSync(tempDir, {recursive: true})

  const bendecPackageName = "bendec.arrays";
  generateFiles([...arrays], tempDir, {
    bendecPackageName,
    interfaces: [
      binSerializableGenerator(bendecPackageName),
      jsonSerializableGenerator(bendecPackageName)
    ],
  });

  const generationPath = path.join(__dirname.replace('dist', 'src'), "../..", tempDir, bendecPackageName.replace(".", "/"))
  const referencePath = path.join(__dirname.replace('dist', 'src'), "generated/java", bendecPackageName.replace(".", "/"))
  const generationDir = opendirSync(generationPath)
  let dirent
  while ((dirent = generationDir.readSync()) !== null) {
    const referenceFile = readFileSync(path.join(referencePath, dirent.name), 'utf8')
    const generatedFile = readFileSync(path.join(generationPath, dirent.name), 'utf8')
    codeEquals(t)(generatedFile, referenceFile)
  }
  generationDir.closeSync()
  rmSync(tempDir, {recursive: true, force: true});
  t.end()
})
