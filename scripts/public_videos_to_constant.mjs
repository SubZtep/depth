#!/usr/bin/env zx

const str = `export default [
${String(await $`ls ${__dirname}/../public/videos`)
  .split("\n")
  .filter(Boolean)
  .map(file => `  "${file}",`)
  .join("\n")}
]`

await $`echo ${str} > ${__dirname}/../src/misc/videos.ts`
