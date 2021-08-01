#!/usr/bin/env zx

const str = `export default [
${String(await $`ls ${__dirname}/../public/videos`)
  .split("\n")
  .filter(Boolean)
  .map(file => `  "${file}",`)
  .join("\n")}
]

export function localFilename(src: string) {
  if (!src) return ""
  return \`/videos/\${src}\`
}
`

await $`echo ${str} > ${__dirname}/../src/misc/videos.ts`
