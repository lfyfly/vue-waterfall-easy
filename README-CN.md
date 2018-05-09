# vue-waterfall-easy
1. 这是一个vue组件，包含瀑布流布局和无限滚动加载
2. 相比其他实现方式，无需在返回的数据中指定图片的宽度和高度
3. 正是因为第2条，所以采用的是图片预加载之后，再排版
4. 响应式，兼容移动端
5. 使用及其简单

## [在线DEMO](http://lfyfly.gitee.io/vue-waterfall-easy/docs/)
## [Demo案例代码](https://github.com/lfyfly/vue-waterfall-easy/blob/master/src/App.vue)

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
[下载vueWaterfallEasy.js](https://github.com/MopTym/vue-waterfall/tree/master/src/vue-waterfall-easy/script/vueWaterfallEasy.js)
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

**getData新请求返回的数据与原来的数据进行合并**

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
    getData(group) {
      axios.get('./static/mock/data.json?group=' + this.group) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个惊呆json文件模拟
        .then(res => {
          this.imgsArr = this.imgsArr.concat(res.data)
          group++
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
width | Number |  - | 容器宽度，默认是相对父元素宽度100%
height | Number | - | 容器高度，默认是相对父元素高度100%
gap | Number | 20 | 单位：px<br> 图片之间的间距
imgsArr | Array | [] | **必填**<br>用于渲染瀑布流的数据<br>每个数组元素是个对象，必须要有src和href属性<br>src属性代表图片的src属性<br>href属性代表点击跳转的链接
imgWidth | Number | 240 | 单位：px<br>图片的宽度
maxCols | Number | 5 | 瀑布流显示最大的列数
linkRange | String | card | 标识点击触发跳转链接范围，值有：<br>card 整张卡牌范围跳转链接<br> img 卡片内图片范围 <br> custom 自定义可以通过slot插槽自定义跳转链接元素
reachBottomDistance | Number | 0 | 单位：px<br>滚动触发scrollReachBottom事件时的距离容器底部的距离
loadingDotCount | Number | 3 | 默认loading动画点的数量
loadingDotStyle | Object | null | 默认loading动画内小圆点的样式对象，可以自定义其样式
loadingTimeOut | Number | 500 | 单位：ms<br> 预加载事件小于500毫秒就不显示加载动画，增加用户体验




## 4. 事件
事件名 | 描述
---|---
scrollReachBottom | 滚动条滚动到底部时,用于请求新的图片数据
preloaded | 每次图片预加载完成执行

## 5. slot插槽
### 5.1 默认slot
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
### 5.2 slot="loading"
自定义加载动画
```html
<div slot="loading" slot-scope="{isFirstLoad}">
  <div slot="loading" v-if="isFirstLoad">first-loading...</div>
  <div v-else="v-else">loading...</div>
</div>
```
### 5.3 slot="waterfall-head"
容器头部内容插槽
```html
<vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData">
  <div slot="waterfall-head">waterfall-head</div>
</vue-waterfall-easy>
```



## 6. 兼容移动端
别忘记在index.html head中添加一下代码
```html
<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
```


