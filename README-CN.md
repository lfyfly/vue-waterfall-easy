# vue-waterfall-easy 2.x
1. 这是一个vue组件，包含瀑布流布局和无限滚动加载
2. 相比其他实现方式，无需在返回的数据中指定图片的宽度和高度
3. 正是因为第2条，所以采用的是图片预加载之后，再排版
4. 响应式，兼容移动端
5. 支持无图模式(@2.4.0)
6. 使用及其简单

## [在线DEMO](https://lfyfly.github.io/vue-waterfall-easy/demo/)
## [Demo案例代码](https://github.com/lfyfly/vue-waterfall-easy/blob/master/src/App.vue)
## [更新列表](https://github.com/lfyfly/vue-waterfall-easy/issues/8)
## [github](https://github.com/lfyfly/vue-waterfall-easy)

## 1. 使用
### 1.1 npm安装

```
npm install vue-waterfall-easy --save-dev
```
### 1.2 es6语法引用
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
### 1.3 js引用
[下载vueWaterfallEasy.js](https://github.com/lfyfly/vue-waterfall-easy/blob/master/src/vue-waterfall-easy/script/vueWaterfallEasy.js)
```html
<script src="path/to/vue/vue.js"></script>
<script src="path/to/vueWaterfallEasy.js"></script>
```
```js
new Vue({
  el: '#app',
  components: {
    vueWaterfallEasy
  }
})
```
### 1.4 支持 require.js sea.js 模块引用

## 2. 基本示例
html
```html
<vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData"></vue-waterfall-easy>
```

**如果imgArr是替换更新，getData新请求返回的数据覆盖原来的数据。**

**如果imgArr是增量更新，getData新请求返回的数据与原来的数据进行合并，此时不建议使用替换更新，会浪费性能。下面这个例子就是增量更新。**

js
```js
import vueWaterfallEasy from './vue-waterfall-easy/vue-waterfall-easy.vue'
import axios from 'axios'

export default {
  name: 'app',
  data() {
    return {
      imgsArr: [],
      group: 0, // request param
    }
  },
  components: {
    vueWaterfallEasy
  },
  methods: {
    getData() {
      axios.get('./static/mock/data.json?group=' + this.group) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个惊呆json文件模拟
        .then(res => {
          this.imgsArr = this.imgsArr.concat(res.data)
          this.group++
        })
    },
  },
  created() {
    this.getData()
  }
}
```
[详情见仓库App.vue文件](https://github.com/lfyfly/vue-waterfall-easy/blob/master/src/App.vue)

## 3. 组件参数

参数 | 类型 | 默认值 | 描述
---|---|---|---
width | Number |  - | 容器宽度（px），默认是相对父元素宽度100%，**由于响应式，此时其所有上级元素宽度必须都是相对浏览器窗口100%**，具体看该表格下面实例。<br>**如果为定宽的话，必须设置width值**，而不能只是其父元素设置定宽
height | Number\|String | - | 容器高度,值为Number类型时默认单位px，值为String类型时可指定单位<br>**当不传递height值时，默认是相对父元素高度100%，此时父元素必须具有高度**
gap | Number | 20 | 单位：px<br> pc端图片之间的间距
mobileGap | Number | 8 | 单位：px<br> 移动端图片之间的间距
imgsArr | Array | [] | **必填**<br>用于渲染瀑布流的数据<br>每个数组元素是个对象，应该要有src和href属性<br>src属性代表图片的src属性<br>href属性代表点击跳转的链接<br>**如果你的键值不是`src`和`href`，你可以使用`srcKey`和`hrefKey`这两个属性进行键值装换**
srcKey | String | 'src' | 当你的图片地址键值不为`src`，可以使用该属性进行转换
hrefKey | String | 'href' | 当你的图片地址键值不为`href`，可以使用该属性进行转换
imgWidth | Number | 240 | 单位：px<br>图片的宽度
maxCols | Number | 5 | 瀑布流显示最大的列数
linkRange | String | 'card' | 标识点击触发跳转链接范围，值有：<br>'card' 整张卡牌范围跳转链接<br> 'img' 卡片内图片范围 <br> custom 自定义可以通过slot插槽自定义跳转链接元素
isRouterLink | Boolean | false | 值为false时渲染a标签，值为true时渲染router-link组件
reachBottomDistance | Number | 0 | 单位：px<br>滚动触发scrollReachBottom事件时的距离容器底部的距离
loadingDotCount | Number | 3 | 默认loading动画点的数量
loadingDotStyle | Object | null | 默认loading动画内小圆点的样式对象，可以自定义其样式
loadingTimeOut | Number | 500 | 单位：ms<br> 预加载事件小于500毫秒就不显示加载动画，增加用户体验
cardAnimationClass | String | 'default-card-animation' | 用于给图片设置出现时的动画的calssName，如要去掉默认动画可以这样设置`cardAnimationClass=""`
enablePullDownEvent | Boolean | false | 开启下拉事件
### waterfall组件祖先元素css样式
[详情见 App.vue 文件](https://github.com/lfyfly/vue-waterfall-easy/blob/master/src/App.vue)
```
html,
body,
#app {
  height: 100%; // 父元素必须要有高度
  width: 100%; // 如果已经是block元素，则可以忽略
}
```


## 4. 事件
事件名 | 描述
---|---
scrollReachBottom | 滚动条滚动到底部时,用于请求新的图片数据
preloaded | 每次图片预加载完成执行
click | 当卡片被点击时触发，看下面的实例
imgError | 图片加载错误事件，第一个参数可获取到当前加载错误图片的相关数据
pullDownMove | 移动端生效，触摸下拉事件，第一个参数可获取Y轴移动距离差，常用于下拉刷新
pullDownEnd | 移动端生效，触摸下拉事件手指抬起，常用于下拉刷新

click事件使用实例
```html
<vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData" @click="clickFn"></vue-waterfall-easy>
```
```js
  clickFn(event, { index, value }) {
    // 阻止a标签跳转
    event.preventDefault()
    // 只有当点击到图片时才进行操作
    if (event.target.tagName.toLowerCase() == 'img') {
      console.log('img clicked',index, value)
    }
  }
```
## 5. 组件方法
### 5.1 waterfallOver
当滚动加载数据结束时，手动调用，将会取消滚动加载
```
this.$refs.waterfall.waterfallOver()
```
[详情见仓库App.vue文件](https://github.com/lfyfly/vue-waterfall-easy/blob/master/src/App.vue)
## 6. slot插槽
### 6.1 默认slot
进行自定义图片的描述信息
#### 参数说明
参数 | 描述
---|---
props.index | 图片在数组中的索引，从0开始
props.value | 遍历参数imgsArr的元素值

```html
<vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData">
  <div class="img-info" slot-scope="props">
    <p class="some-info">第{{props.index+1}}张图片</p>
    <p class="some-info">{{props.value.info}}</p>
  </div>
</vue-waterfall-easy>
```
### 6.2 slot="loading"
自定义加载动画
```html
<div slot="loading" slot-scope="{isFirstLoad}">
  <div slot="loading" v-if="isFirstLoad">first-loading...</div>
  <div v-else="v-else">loading...</div>
</div>
```
### 6.3 slot="waterfall-head"
容器头部内容插槽
```html
<vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData">
  <div slot="waterfall-head">waterfall-head</div>
</vue-waterfall-easy>
```

### 6.4 slot="waterfall-over"
调用`waterfallOver`方法后才会显示，用于瀑布流结束提醒，默认值是`被你看光了`
```html
<vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData">
  <div slot="waterfall-over">waterfall-over</div>
</vue-waterfall-easy>
```

## 7. 兼容移动端
别忘记在index.html head中添加一下代码
```html
<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
```


