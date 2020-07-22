# mogai-admin



### 本模板初衷

之前一直在寻找合适的后台管理系统模板，但很多并不适合中小企业，模板功能过于部分，功能过于臃肿，不便于快速开发；于是我整合了IView的admin模板，相当于魔改，主要改动的地方是将iview组件替换成饿了么的elementui框架，原模板保留的其他功能如拖拽组件、富文本编辑等仍保留，只是没有在项目中引用，如果有需求可根据自己的要求进行修改优化



这套模板优点在于有完整的侧边栏菜单、路由页面标签化、样式简洁高效、并且elementui框架提供的组件非常多 ，基本满足日常开发；一些常用的工具函数也进行了封装；

原模板也对axios进行了封装，封装文件存放在：

```
/src/libs/api.request.js
/src/libs/axios.js
```

这两个文件对axios调用做了封装，返回Promise对象，规范了使用；基于我自己的需求，在之前的项目我也做了封装，有所区别；我自己封装的文件存放在：

```
/config/api.js
```



### 其他变动：

iviewadmin使用的vuecli是旧版本，这里我升级到vuecli4.4.1



其他文档说明可查看：

http://admin.iviewui.com/login

https://lison16.github.io/iview-admin-doc/#/



### 页面截图：



![RUNOOB 图标](https://raw.githubusercontent.com/mcjisok/admin-template/master/srceen/admin1.png)

![RUNOOB 图标](https://raw.githubusercontent.com/mcjisok/admin-template/master/srceen/admin2.png)


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
