<template lang="pug">
#app
  vue-waterfall-easy(:imgsArr="imgsArr",@scrollReachBottom="fetchImgsData")
    template( scope="props")
      .img-info
        p.some-info 第{{props.index+1}}张图片
        p.some-info {{props.value.info}}
</template>

<script>
import vueWaterfallEasy from './vue-waterfall-easy/vue-waterfall-easy.vue'

export default {
  name: 'app',
  data() {
    return {
      imgsArr: [],
      fetchImgsArr: []
    }
  },
  components: {
    vueWaterfallEasy
  },
  methods: {
    // 假数据
    initImgsArr(n, m) { //num 图片数量
      var arr = []
      for (var i = n; i < m; i++) {
        arr.push({ src: `./static/img/${i + 1}.jpg`, link: 'https://www.baidu.com', info: '一些图片描述文字' })
      }
      return arr
    },

    fetchImgsData() {
      this.imgsArr = this.imgsArr.concat(this.fetchImgsArr)
    }
  },
  created() {
    this.imgsArr = this.initImgsArr(0, 10)
    this.fetchImgsArr = this.initImgsArr(10, 20) // 模拟每次请求的新的图片的数据数据
  },

}

</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
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
