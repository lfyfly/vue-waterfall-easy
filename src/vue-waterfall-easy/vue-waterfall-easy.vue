<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
.vue-waterfall-easy {
  position: absolute;
  width: 100%; // 移动端生效
  & > .img-box {
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    transition: left 1s, top 1s;
    width: 50%; // 移动端生效
  }
  .img-inner-box {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  .img-wraper {
    & > img {
      width: 100%;
      display: block;
    }
  }
  & > .loading.first {
    bottom: 50%;
    transform: translate(-50%, 50%);
  }
  & > .loading {
    position: fixed;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
    bottom: 5px;
    z-index: 999;
    & > .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin: 5px;
      vertical-align: middle;
      transition: width 0.3s, height 0.3s, opacity 0.3s;
    }
    .dot.s {
      width: 7px;
      height: 7px;
      opacity: 0.3;
    }
    .dot.m {
      width: 10px;
      height: 10px;
      opacity: 0.6;
    }
    .dot.l {
      width: 13px;
      height: 13px;
      opacity: 0.9;
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.vue-waterfall-easy(:style="isMobile? '' :{width: colWidth*cols+'px',left:'50%', marginLeft: -1*colWidth*cols/2 +'px'}")
  .loading(v-if="isPreloading_c",:class="{first:isFirstLoad}")
    span.dot(v-for="v in loadingStates[loadingState]",:class="v",:style="{background:loadingColor}")
  a.img-box(
    v-for="(v,i) in imgsArr_c",
    :style="{padding:gap/2+'px', width: isMobile ? '' : colWidth+'px'}"
  )
    .img-inner-box
      .img-wraper(:style="{width:imgWidth_c+'px',height:v.height?v.height+'px':''}")
        img(:src="v.src")
      slot(:index="i",:value="v")

</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'

export default {
  name: 'vue-waterfall-easy',
  props: {
    scrollEl: {
      type: String, // selector
      default: ''
    },
    reachBottomDistance: { // 滚动触底距离，触发加载新图片
      default: 0  // 默认在最低那一列到底时触发
    },
    loadingColor: {
      type: String,
      default: '#133adb'
    },
    gap: { // .img-box 间距
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
    loadingTimeOut: { // 预加载事件小于500毫秒就不显示加载动画，增加用户体验
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      msg: 'this is from vue-waterfall-easy.vue',
      isMobile: !!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i), // 初始化移动端
      isPreloading: true, // 正在预加载中，显示加载动画
      isPreloading_c: true,
      imgsArr_c: [], // 待图片预加载imgsArr完成，插入新的字段height之后,才会生成imgsArr_c，这时才开始渲染
      loadedCount: 0,
      cols: NaN, // 需要根据窗口宽度初始化
      imgBoxEls: null, // 所有的.img-box元素
      beginIndex: NaN, // 开始要排列的图片索引,首次为第二列的第一张图片，后续加载则为已经排列图片的下一个索引
      colsHeightArr: [],
      // 自定义loading
      LoadingTimer: null,
      loadingStates: [['s', 'm', 'l'], ['m', 'l', 's'], ['l', 'm', 's']],
      loadingState: 0,
      isFirstLoad: true, // 首次加载
    }
  },
  computed: {
    colWidth() { // 每一列的宽度
      return this.imgWidth + this.gap
    },
    imgWidth_c() { // 对于移动端重新计算图片宽度
      return this.isMobile ? window.innerWidth / 2 - this.gap : this.imgWidth
    }
  },
  mounted() {
    this.loadingAnimate()

    this.preload()
    this.cols = this.calcuCols()
    this.beginIndex = this.cols // 开始排列的元素索引
    this.$on('preloaded', () => {
      this.isFirstLoad = false

      this.imgsArr_c = this.imgsArr.concat([]) // 预加载完成，这时才开始渲染
      this.$nextTick(() => {
        this.isPreloading = false
        this.imgBoxEls = this.$el.getElementsByClassName('img-box')
        console.log('图片总数', this.imgBoxEls.length)
        this.waterfall()
      })

    })
    if (!this.isMobile) this.response()
    this.scroll()
  },
  watch: {
    isPreloading(newV, oldV) {
      if (newV) {
        setTimeout(() => {
          if (!this.isPreloading) return // 500毫秒内预加载完图片则不显示加载动画
          this.isPreloading_c = true
        }, this.loadingTimeOut)
        this.loadingAnimate()
      } else {
        this.isPreloading_c = false
        this.stopLoadingAnimate()
      }
    },
    imgsArr(newV, oldV) {
      if (newV.length === oldV.length) return
      this.preload()
    },

  },
  methods: {
    // ==0== loading
    loadingAnimate() {
      this.LoadingTimer = setInterval(() => {
        console.log('loading')
        var nextState = this.loadingState + 1
        this.loadingState = nextState == 3 ? nextState % 3 : nextState
      }, 300)
    },
    stopLoadingAnimate() {
      clearInterval(this.LoadingTimer)
    },
    // ==1== 预加载
    preload(src, imgIndex) {
      this.imgsArr.forEach((imgItem, imgIndex) => {
        if (imgIndex < this.loadedCount) return // 只对新加载图片进行预加载
        var oImg = new Image()
        oImg.src = imgItem.src
        oImg.onload = oImg.onerror = (e) => {
          this.loadedCount++
          // 预加载图片，计算图片容器的高
          if (e.type == 'load') this.$set(this.imgsArr[imgIndex], 'height', Math.round(this.imgWidth_c / (oImg.width / oImg.height)))
          if (this.loadedCount == this.imgsArr.length) {
            this.$emit('preloaded')
          }
        }
      })

    },
    // ==2== 计算cols
    calcuCols() { // 列数初始化
      var winWidth = window.innerWidth
      var cols = parseInt(winWidth / this.colWidth)
      cols = cols === 0 ? 1 : cols
      return this.isMobile
        ? 2
        : (cols > this.maxCols ? this.maxCols : cols)
    },
    // ==3== waterfall布局
    waterfall() {
      if (this.colsHeightArr.length === 0) this.initColsHeightArr() // 第一次初始化

      console.log(this.beginIndex, 'this.beginIndex', this.imgsArr.length)
      for (var i = this.beginIndex; i < this.imgsArr.length; i++) {
        var minHeight = Math.min.apply(null, this.colsHeightArr) // 最低高低
        var minIndex = this.colsHeightArr.indexOf(minHeight) // 最低高度的索引
        var width = this.imgBoxEls[0].offsetWidth // 图片的宽度获取
        // 设置元素定位的位置
        this.imgBoxEls[i].style.position = 'absolute'
        this.imgBoxEls[i].style.left = minIndex * width + 'px'
        this.imgBoxEls[i].style.top = minHeight + 'px'

        // 更新colsHeightArr
        this.colsHeightArr[minIndex] = minHeight + this.imgBoxEls[i].offsetHeight
      }
      this.beginIndex = this.imgsArr.length // 排列完之后，新增图片从这个索引开始预加载图片和排列

    },
    initColsHeightArr() { // 第一行元素的高度组成的数组-初始化
      this.colsHeightArr = [] // 列数发生变化重新初始化
      for (var i = 0; i < this.cols; i++) {
        this.imgBoxEls[i].style.position = 'static' // 重置下position
        var height = this.imgBoxEls[i].offsetHeight
        this.colsHeightArr.push(height)
      }
    },

    // ==4== resize 响应式
    response() {
      window.addEventListener('resize', () => {
        var old = this.cols
        this.cols = this.calcuCols()
        if (old === this.cols) return // 列数不变直接退出
        this.beginIndex = this.cols // 开始排列的元素索引
        this.initColsHeightArr()
        this.waterfall()
      })
    },

    // ==5== 滚动触底事件
    scroll() {
      var scrollEl = this.scrollEl ? document.querySelector(this.scrollEl) : this.$el.parentNode

      scrollEl.addEventListener('scroll', () => {

        if (this.isPreloading) return
        var minHeight = Math.min.apply(null, this.colsHeightArr)
        if (scrollEl.scrollTop + scrollEl.offsetHeight > minHeight - this.reachBottomDistance) {
          this.isPreloading = true
          console.log('scrollReachBottom')
          this.$emit('scrollReachBottom') // 滚动触底
        }
      })
    }
  }
}
</script>
