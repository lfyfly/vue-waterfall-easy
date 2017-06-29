# vue-waterfall-easy介绍
1. 是一个vue组件，包含瀑布流布局和无限滚动加载
2. 相比其他实现方式，无需在返回的数据中指定图片的宽度和高度
3. 正是因为第2条，所以采用的是图片预加载之后，再排版
4. 响应式，兼容移动端
5. 使用及其简单

# [DEMO](https://lfyfly.github.io/vue-waterfall-easy/)
# 支持vue2.1+
# [GITHUB](https://github.com/lfyfly/vue-waterfall-easy)

# vue-waterfall-easy使用
## npm安装

```
npm install vue-waterfall-easy --save-dev
```
## 局部引用
```js
import vueWaterfallEasy from 'vue-waterfall-easy'
```
```js

export default {
  name: 'app',
  components: {
    vueWaterfallEasy
  }
}

```
## 组件参数
```js
props: {
  gap: { // 图片间隔
    type: Number,
    default: 20
  },
  imgsArr: { // 请求返回的图片数据，格式：[{src:'1.jpg',info:'自定义图片信息'},{src:'2.jpg',info:'自定义图片信息'}...]
    type: Array,
    required: true
  },
  imgWidth: { // 指定图片的统一宽度
    type: Number,
    default: 240
  },
  timeOut: { // 预加载事件小于500毫秒就不显示加载动画，增加用户体验
    type: Number,
    default: 500
  }
}

```
## 事件
事件名 | 描述
---|---
scrollLoadImg | 滚动条滚动到底部时,用于请求新的图片数据
preloaded | 每次图片预加载完成执行

## 通过slot进行自定义图片描述信息

### pug
```pug
vue-waterfall-easy(:imgsArr="imgsArr",@scrollLoadImg="fetchImgsData")
  template( scope="props")
    p.some-info 第{{props.index+1}}张图片
    p.some-info {{props.value.info}}
```
### 参数说明
事件名 | 描述
---|---
props.index | 图片在数组中的索引，从0开始
props.value | 遍历参数imgsArr的元素值

## 兼容移动端
别忘记在index.html head中添加一下代码
```html
<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
```

## 关于数据请求的约定
**新请求返回的数据与原来的数据进行合并**
详情见仓库 App.vue文件
```js
this.imgsArr = this.imgsArr.concat(this.fetchImgsArr)
```
