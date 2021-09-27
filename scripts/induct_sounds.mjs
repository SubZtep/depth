#!/usr/bin/env zx

function effectNameByFileName(fileName) {
  if (fileName.includes("access-denied")) {
    return "access-denied"
  }
  return fileName.split(".")[0]
}

function stdoutToArray(stdout) {
  return stdout.trimRight().split("\n")
}

function fileToEffectEntry(fileName) {
  return [effectNameByFileName(fileName), `/sounds/${fileName}`]
}

function entriesToJson(entries) {
  return JSON.stringify(Object.fromEntries(entries), null, 2)
}

const files = await $`ls ${__dirname}/../public/sounds`
const entries = stdoutToArray(files.stdout).map(fileToEffectEntry)
await $`echo ${entriesToJson(entries)} > ${__dirname}/../public/sounds.json`
