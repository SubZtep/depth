import { join } from "path"
import { compile, compileFromFile, Options } from "json-schema-to-typescript"

const ts = await compileFromFile("schemas/my-settings.toml.json")
console.log("qawe", ts)
//   .then(ts => fs.writeFileSync('foo.d.ts', ts))

// // or, compile a JS object
// let mySchema = {
//   properties: [...]
// }
// compile(mySchema, 'MySchema')
//   .then(ts => ...)

//  x.ts
