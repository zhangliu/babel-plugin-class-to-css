# babel-plugin-class-to-css

plugin can generate css by class name.

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-class-to-css
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["class-to-css"]
}
```

### Via CLI

```sh
$ babel --plugins class-to-css script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["class-to-css"]
});
```
