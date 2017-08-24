<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
.vue-waterfall-easy {
  position: absolute;
  width: 100%; // 移动端生效
  .img-box {
    display: inline-block;
    width: 50%; // 移动端生效
    box-sizing: border-box;
    float: left; // 首行排版
    transition: left 1s, top 1s;

    .img-inner-box {
      box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
      .img-wraper {
        width: 100%;
        background: yellow;
      }
      img {
        width: 100%;
        vertical-align: bottom;
      }
      .img-info {
        background: #fff;
        padding: .6em;
      }
    }
  }
  .loading {
    text-align: center;
    width: 100%;
    position: fixed;
    bottom: 10px;
    left: 50%;
    margin-left: -15px;
    width: 30px;
    height: 30px;
  }
  .loading.first-loading {
    //  首次预加载白屏，让加载动画处于中间
    top: 50%;
    margin-top: -15px;
  }
  .double-bounce1,
  .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #67CF22;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;

    animation: bounce 2.0s infinite ease-in-out;
  }

  .double-bounce2 {
    animation-delay: -1.0s;
  }



  @keyframes bounce {
    0%,
    100% {
      transform: scale(0.0);
    }
    50% {
      transform: scale(1.0);
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.vue-waterfall-easy(
  :style="isMobile? '':{width:colWidth*columnCount+'px',left:'50%',marginLeft: -1*colWidth*columnCount/2 +'px'}"
)
  a.img-box(
    v-for="(v,i) in imgsArrC",
    :href="v.link",
    :style="{padding:gap/2+'px',width: isMobile ? '' : colWidth+'px'}"
  )
    .img-inner-box
      div.img-wraper(:style="{width:imgWidthC+'px',height:v.height?v.height+'px':''}")
        img(:src="v.src")
      .img-info
        slot(:index="i",:value="v")

  .loading(v-if="isPreloadingC",:class="{'first-loading':isFirstTIme}")
    div.double-bounce1
    div.double-bounce2


</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'

export default {
  name: 'vue-waterfall-easy',
  props: {
    gap: {
      type: Number,
      default: 20
    },
    maxCols: {
      type: Number,
      default: 5
    },
    imgsArr: {
      type: Array,
      required: true
    },
    imgWidth: {
      type: Number,
      default: 240
    },
    timeOut: { // 预加载事件小于500毫秒就不显示加载动画，增加用户体验
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      msg: 'this is from vue-waterfall-easy.vue',
      columnCount: NaN, // 列数，根据窗口大小初始化
      isMobile: navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i), // 初始化移动端
      beginIndex: NaN, // 第二列首张图片的index，从这一张开始重新计算图片位置

      colsHeightArr: [], // 每一列的图片总和高度为元素组成的数组
      imgBoxEls: null, // 所有的.img-box元素
      isPreloading: true, // 预加载状态中（1.以等待图片替换 2.图片全部预加载完显示）
      isPreloadingC: true,
      imgsArrC: [], // 预加载完之后再才开始
      loadedCount: 0, // 已经加载图片数量
      isFirstTIme: true, // 首次加载
    }
  },
  computed: {
    colWidth() { // 每一列的宽度
      return this.imgWidth + this.gap
    },
    imgWidthC() { // 对于移动端重新计算图片宽度
      return this.isMobile ? window.innerWidth / 2 - this.gap : this.imgWidth
    }
  },
  methods: {
    waterfall() { // 执行瀑布布局
      for (var i = this.beginIndex; i < this.imgsArr.length; i++) {
        var minHeight = Math.min.apply(null, this.colsHeightArr) // 最低高低
        var minIndex = this.colsHeightArr.indexOf(minHeight) // 最低高度的索引
        var width = this.imgBoxEls[0].offsetWidth // 图片的宽度获取
        // 设置元素定位的位置
        this.imgBoxEls[i].style.position = 'absolute'
        this.imgBoxEls[i].style.left = minIndex * width + 'px'
        this.imgBoxEls[i].style.top = minHeight + 'px'

        // 更新colsHeightArr
        this.$set(this.colsHeightArr, minIndex, minHeight + this.imgBoxEls[i].offsetHeight)
      }
      this.beginIndex = this.imgsArr.length
    },

    loadFn(e, oImg, i) { // 每张图片预加载完成执行函数
      this.loadedCount++
      if (e.type === 'load') { // 使用图片原始宽度计算图片的高度
        this.$set(this.imgsArr[i], 'height', Math.round(this.imgWidthC / (oImg.width / oImg.height)))
      }
      if (this.loadedCount === this.imgsArr.length) {
        this.imgsArrC = this.imgsArr.concat([])


        this.isPreloading = false
        this.isFirstTIme = false

        // 预加载完毕
        this.$nextTick(() => {
          this.initImgBoxEls()
          this.$emit('preloaded')

        })
      }
    },
    preload() {
      this.imgsArr.forEach((v, i) => {
        if (i < this.loadedCount) return

        var oImg = new Image()
        oImg.addEventListener('load', (e) => {
          this.loadFn(e, oImg, i)
        })
        oImg.src = v.src
      })
    },


    // -----------------初始化化------------------------

    initColsHeightArr() { // 第一行元素的高度组成的数组-初始化
      this.colsHeightArr = [] // 列数发生变化重新初始化
      for (var i = 0; i < this.columnCount; i++) {
        this.imgBoxEls[i].style.position = 'static' // 重置下position
        var height = this.imgBoxEls[i].offsetHeight
        this.colsHeightArr.push(height)
      }
    },
    initImgBoxEls() { // 初始化所有装图片的元素集合,注意高度获取需要在图片加载完成之后，所以在window.onload 事件中初始化
      this.imgBoxEls = document.getElementsByClassName('img-box')
    },

    initColumnCount() { // 列数初始化

      var winWidth = window.innerWidth
      var columnCount = parseInt(winWidth / this.colWidth)
      columnCount = columnCount === 0 ? 1 : columnCount
      this.columnCount = this.isMobile
        ? 2
        : (columnCount > this.maxCols ? this.maxCols : columnCount)

    },
  },
  mounted() {
    // ==1== 根据窗口大小初始化列数
    this.initColumnCount()
    this.beginIndex = this.columnCount // 开始排列的元素索引

    // ==2== 根据预加载完成的图片的长宽比，计算图片的高度
    this.preload()

    this.$on('preloaded', () => {
      if (this.colsHeightArr.length === 0) this.initColsHeightArr() // 第一次初始化
      this.waterfall()
    })

    window.addEventListener('resize', () => {
      var old = this.columnCount
      this.initColumnCount()
      if (old === this.columnCount) return // 列数不变直接退出
      this.beginIndex = this.columnCount // 开始排列的元素索引

      this.initColsHeightArr()
      this.waterfall()


    })

    window.addEventListener('scroll', () => {
      if (this.isPreloading) return
      if (document.body.scrollTop + window.innerHeight > document.body.scrollHeight - 30) {
        this.$emit('scrollLoadImg')

      }
    })

  },
  watch: {
    imgsArr(newV, oldV) {
      if (newV.length === oldV.length) return
      this.isPreloading = true // 预加载新的图片资源
      this.preload()

      // setTimeout(()=>{ // 模拟图片预加载时间为1s

      // this.preload()
      // },1000)

    },
    isPreloading(v) {
      if (v) {
        setTimeout(() => {
          if (!this.isPreloading) return // 500毫秒内预加载完图片则不显示加载动画
          this.isPreloadingC = true
        }, this.timeOut)
      } else {
        this.isPreloadingC = false
      }

    }
  }
}
</script>
