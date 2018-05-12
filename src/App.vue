<template lang="pug">
#app
  a#header(href="https://github.com/lfyfly/vue-waterfall-easy",target="_blank",title="github of vue-waterfall-easy ") vue-waterfall-easy
  #content
    vue-waterfall-easy(:imgsArr="imgsArr",@scrollReachBottom="getData", @click="clickFn")
      .img-info(slot-scope="props")
        p.some-info 第{{props.index+1}}张图片
        p.some-info {{props.value.info}}

    //- div(slot="waterfall-head")  waterfall-head

    //- 自定义加载动画
    //-div(slot="loading" slot-scope="{isFirstLoad}")
      div(slot="loading" v-if="isFirstLoad") first-loading...
      div(v-else) loading...
</template>

<script>
import vueWaterfallEasy from './vue-waterfall-easy/vue-waterfall-easy.vue'
import axios from 'axios'
export default {
  name: 'app',
  data() {
    return {
      imgsArr: [],
      group: 0, // 当前加载的加载图片的次数
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
    clickFn(event, { index, value }) {
      // event.preventDefault()
      if (event.target.tagName.toLowerCase() == 'img') {
        console.log('img clicked', index, value)
      }
    }
  },
  created() {
    this.getData()
  },
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
a {
  color: #000;
  text-decoration: none;
  &:active {
    color: #000;
  }
}
html,
body,
#app {
  height: 100%;
}

#app {
  position: relative;
  #header {
    display: block;
    text-align: center;
    background: #000;
    color: #cccccc;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 2px;
    position: fixed;
    z-index: 999;
    width: 100%;
  }
  #content {
    position: absolute;
    top: 32px;
    bottom: 0;
    width: 100%;
  }
}

#app {
  overflow: auto;
  position: relative;
  .some-info {
    line-height: 1.6;
    text-align: center;
  }
}
</style>
