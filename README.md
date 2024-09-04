# JSON Dependency Error using TSX (libphonenumber-js example)
When running a NodeJS application with TSX that has dependencies which load JSON modules unexpected errors occur.

## The Example Code
The following code uses the `libphonenumber-js` library which loads a JSON "metadata" file dynamically depending on usage.

```typescript
import { parsePhoneNumberWithError, type PhoneNumber } from "libphonenumber-js/max";

const testNumber = "8005555555";

let parsedNumber: PhoneNumber | null = null
try {
    parsedNumber = parsePhoneNumberWithError(testNumber, "US");
    console.log(`Parsed number: ${parsedNumber.formatNational()}`)
} catch (error) {
    console.error(error);
}
```

## Expected Behavior (compiled)
If the example is first compiled with `tsc` and the output run directly with `node` the behavior is as expected and the console output is:

```bash
@gcoonrod ➜ /workspaces/codespaces-blank/tsx-libphonenumber-js $ yarn build
yarn run v1.22.22
$ yarn tsc -p ./tsconfig.json
$ /workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/.bin/tsc -p ./tsconfig.json
Done in 1.19s.
@gcoonrod ➜ /workspaces/codespaces-blank/tsx-libphonenumber-js $ yarn start
yarn run v1.22.22
$ node ./dist/index.js
Parsed number: (800) 555-5555
Done in 0.12s.
```

## Error Condition (tsx)
However, when using `tsx` to run/watch the TS files directly an unexpected error occurs:

```bash
@gcoonrod ➜ /workspaces/codespaces-blank/tsx-libphonenumber-js $ yarn dev
yarn run v1.22.22
$ TSX_TSCONFIG_PATH=./tsconfig.json tsx watch ./src/index.ts
Error: [libphonenumber-js] `metadata` argument was passed but it's not a valid metadata. Must be an object having `.countries` child object property. Got an object of shape: { default }.
    at validateMetadata (/workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/libphonenumber-js/source/metadata.js:463:9)
    at Metadata (/workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/libphonenumber-js/source/metadata.js:23:3)
    at parse (/workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/libphonenumber-js/source/parse.js:72:13)
    at parsePhoneNumberWithError (/workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/libphonenumber-js/source/parsePhoneNumberWithError_.js:4:9)
    at parsePhoneNumberWithError (/workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/libphonenumber-js/source/parsePhoneNumberWithError.js:6:9)
    at call (/workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/libphonenumber-js/max/index.cjs:9:14)
    at parsePhoneNumberWithError (/workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/libphonenumber-js/max/index.cjs:26:9)
    at <anonymous> (/workspaces/codespaces-blank/tsx-libphonenumber-js/src/index.ts:7:20)
    at Object.<anonymous> (/workspaces/codespaces-blank/tsx-libphonenumber-js/src/index.ts:11:1)
    at Module._compile (node:internal/modules/cjs/loader:1358:14)
```

Looking at the stack trace we can see the following line: `at call (/workspaces/codespaces-blank/tsx-libphonenumber-js/node_modules/libphonenumber-js/max/index.cjs:9:14)`. This line points to the assumed root cause of the error. Specifically, the call to require in a json file in this snippet:
```javascript
'use strict'

var metadata = require('../metadata.max.json')
var core = require('../core/index.cjs')

function call(func, _arguments) {
	var args = Array.prototype.slice.call(_arguments)
	args.push(metadata) // <-- This "metadata" value does not contain the expected contents of referenced JSON file.
	return func.apply(this, args)
}
```