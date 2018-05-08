<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
.vue-waterfall-easy-container {
  width: 100%;
  height: 100%;
  position: relative;
  .vue-waterfall-easy-scroll {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .vue-waterfall-easy {
    position: absolute;
    width: 100%; // 移动端生效
    & > .img-box {
      position: absolute;
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
  }

  & > .loading.first {
    bottom: 50%;
    transform: translate(-50%, 50%);
  }
  & > .loading {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 6px;
    z-index: 999;
    @keyframes ball-beat {
      50% {
        opacity: 0.2;
        transform: scale(0.75);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    &.ball-beat > .dot {
      vertical-align: bottom;
      background-color: #4b15ab;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin: 3px;
      animation-fill-mode: both;
      display: inline-block;
      animation: ball-beat 0.7s 0s infinite linear;
    }
    &.ball-beat > .dot:nth-child(2n-1) {
      animation-delay: 0.35s;
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.vue-waterfall-easy-container(:style="{width: width&&!isMobile ? width+'px' : '', height: height?height+'px':''}")
  .loading.ball-beat(v-show="isPreloading_c", :class="{first:isFirstLoad}")
    slot(name="loading", :isFirstLoad="isFirstLoad")
    .dot(v-if="!hasLoadingSlot", v-for="n in loadingDotCount",:style="loadingDotStyle")
  //- 为了防止loading 跟随滚动
  .vue-waterfall-easy-scroll
    .vue-waterfall-easy(:style="isMobile? '' :{width: colWidth*cols+'px',left:'50%', marginLeft: -1*colWidth*cols/2 +'px'}")
      slot(name="waterfall-head")
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
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    reachBottomDistance: { // 滚动触底距离，触发加载新图片
      type: Number, // selector
      default: 0  // 默认在最低那一列到底时触发
    },
    loadingDotCount: { // loading 点数
      type: Number,
      default: 3
    },
    loadingDotStyle: {
      type: Object,
      default: null
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
      beginIndex: 0, // 开始要排列的图片索引,首次为第二列的第一张图片，后续加载则为已经排列图片的下一个索引
      colsHeightArr: [],
      // 自定义loading
      LoadingTimer: null,
      isFirstLoad: true, // 首次加载
    }
  },
  computed: {
    colWidth() { // 每一列的宽度
      return this.imgWidth + this.gap
    },
    imgWidth_c() { // 对于移动端重新计算图片宽度
      return this.isMobile ? window.innerWidth / 2 - this.gap : this.imgWidth
    },
    hasLoadingSlot() {
      console.log(this.$scopedSlots)
      return !!this.$scopedSlots.loading
    }
  },
  mounted() {

    this.loadingMiddle()

    this.preload()
    this.cols = this.calcuCols()
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
    if (!this.isMobile && !this.width) this.response()
    this.scroll()
  },
  watch: {
    isPreloading(newV, oldV) {
      if (newV) {
        setTimeout(() => {
          if (!this.isPreloading) return // 500毫秒内预加载完图片则不显示加载动画
          this.isPreloading_c = true
        }, this.loadingTimeOut)
      } else {
        this.isPreloading_c = false
      }
    },
    imgsArr(newV, oldV) {
      if (newV.length === oldV.length) return
      this.preload()
    },

  },
  methods: {
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
      var waterfallWidth = this.width ? this.width : window.innerWidth
      var cols = parseInt(waterfallWidth / this.colWidth)
      cols = cols === 0 ? 1 : cols
      return this.isMobile
        ? 2
        : (cols > this.maxCols ? this.maxCols : cols)
    },
    // ==3== waterfall布局
    waterfall() {
      console.log('waterfall')
      var top, left, colWidth = this.isMobile ? this.imgBoxEls[0].offsetWidth : this.colWidth
      if (this.beginIndex == 0) this.colsHeightArr = []
      for (var i = this.beginIndex; i < this.imgsArr.length; i++) {
        if (i < this.cols) {
          var height = this.imgBoxEls[i].offsetHeight
          this.colsHeightArr.push(height)
          top = 0
          left = i * colWidth
        } else {
          var minHeight = Math.min.apply(null, this.colsHeightArr) // 最低高低
          var minIndex = this.colsHeightArr.indexOf(minHeight) // 最低高度的索引
          top = minHeight
          left = minIndex * colWidth
          // 设置元素定位的位置
          // 更新colsHeightArr
          this.colsHeightArr[minIndex] = minHeight + this.imgBoxEls[i].offsetHeight
        }
        this.imgBoxEls[i].style.left = left + 'px'
        this.imgBoxEls[i].style.top = top + 'px'
      }

      this.beginIndex = this.imgsArr.length // 排列完之后，新增图片从这个索引开始预加载图片和排列

    },

    // ==4== resize 响应式
    response() {
      window.addEventListener('resize', () => {
        var old = this.cols
        this.cols = this.calcuCols()
        if (old === this.cols) return // 列数不变直接退出
        this.beginIndex = 0 // 开始排列的元素索引
        this.waterfall()

      })
    },

    // ==5== 滚动触底事件
    scroll() {
      var scrollEl = this.$el.querySelector('.vue-waterfall-easy-scroll')

      scrollEl.addEventListener('scroll', () => {

        if (this.isPreloading) return
        var minHeight = Math.min.apply(null, this.colsHeightArr)
        if (scrollEl.scrollTop + scrollEl.offsetHeight > minHeight - this.reachBottomDistance) {
          this.isPreloading = true
          console.log('scrollReachBottom')
          this.$emit('scrollReachBottom') // 滚动触底
        }
      })
    },

    // other
    loadingMiddle() {
      // 对滚动条宽度造成的不居中进行校正
      var scrollEl = this.$el.querySelector('.vue-waterfall-easy-scroll')
      var scrollbarWidth = scrollEl.offsetWidth - scrollEl.clientWidth
      this.$el.querySelector('.loading').style.marginLeft = -scrollbarWidth / 2 + 'px'
    }
  }
}
</script>
