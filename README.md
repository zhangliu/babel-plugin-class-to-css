# babel-plugin-class-to-css

这个插件可以根据你的标签className简写名称，自动的生成相应的css样式！

## Example

**转换前代码**

```js
import React from 'react'
export default () => (
  <div className="fs12 mt10 pa t0">
    <span className="p20">hello world!</span>
  </div>
)
```

**转换后代码**

```js
import React from 'react'
export default () => (
  <div className="fs12 mt10 pa t0">
    <span className="p20">hello world!</span>
    <style dangerouslySetInnerHTML={{_html: `
      .fs12{font-size: 12px}
      .mt10{margin-top: 10px}
      .pa{position: absolute}
      .t0{top: 0px}
      .p20{padding: 20px}
    `}}/>
  </div>
)
```

可以看到，只用本插件，可以省去不必要的css样式的编写工作。

## 转换规则（使用了正则转换）
|  className简写  |     转换后       |                  例子                  |
|------------------------|:------------------:|----------------------------------:|
| m(\d+) |  margin: $1px | 例如：m10 转换为 margin: 10px |
| mt(\d+) |  margin-top: $1px | 例如：mt10 转换为 margin-top: 10px |
| fs(\d+) |  font-size: $1px | 例如：fs10 转换为 font-size: 10px |
| 未完待添加... | 未完待添加... | 未完待添加... |

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
