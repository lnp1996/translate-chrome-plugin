### translate-chrome-plugin

> 基于webpack5的 chrome 插件基础项目 - 顺滑的划词翻译

### 项目使用技术栈

- 🔥 `webpack5`、`webpack-cli`,`webpack-dev-server`
- 🔥 `react`, `react-router`,`typescript`
- 🔥`babel`,`typescript`、`tailwindcss`, `sass`
- ...

### 如何运行

- 克隆该项目地址

```bash
  git clone git@github.com:lnp1996/translate-chrome-plugin.git
```

- 进入当前目录

```bash
  cd translate-chrome-plugin
```

- 安装依赖包

```bash
  npm i
  // or
  pnpm i
  // or
  yarn i
```

- 编辑器中全局搜索"TODO"（其实就是到 src/pages/content/index.js 中），修改自己的appID 以及密钥。
- 然后打包、浏览器加载dist/base-chrome-plugin 文件夹即可
- 目前支持：百度翻译引擎。 英文 => 中文
- API appid申请地址： https://fanyi-api.baidu.com/api/trans/product/desktop?req=detail
- 自己注册一个appID，每月200万字符免费，自用够了。

- 打包运行插件,生成插件`manifest.json`包

```bash
npm run build
// or
pnpm run build
```

- 浏览器输入`chrome://extensions`or `扩展程序>管理扩展程序>加载已解压的扩展程序`>加载含有`manifest.json`文件夹

### 插件不同环境

- 本地开发环境

```bash
  npm run build:dev
  // or
  pnpm run build:dev
```

- 测试环境

```bash
  npm run build:test
  // or
  pnpm run build:test
```

- 生产环境

```bash
  npm run build
  // or
  pnpm run build
```

### 插件预览

- 选择文本，则会在文本上方出现对应翻译
![](./src/assets/imgs/demo1.png)
![](./src/assets/imgs/demo2.png)


### 最后

- 如果看完项目，觉得有所收获或帮助，就不要吝啬给个`star`鼓励下作者吧~
