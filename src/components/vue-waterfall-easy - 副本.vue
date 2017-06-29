<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
.vue-waterfall-easy {
  position: absolute;
  .img-box {
    width: 50%;

    box-sizing: border-box;
    float: left;
    transition: left 1s, top 1s;
    .img-inner-box {
      box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
      img {
        width: 100%;
        vertical-align: bottom;
      }
      .img-info {
        text-align: center;
        background: #fff;
        line-height: 2;
      }
    }
  }
  .loading {
    text-align: center;
    background: #000;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.vue-waterfall-easy(
  :style="isMobile? '':{width:boxWidth*columnCount+'px',left:'50%',marginLeft: -1*boxWidth*columnCount/2 +'px'}"
)
  .img-box(
    v-for="(v,i) in imgsArrMy",
    :style="{padding:gap/2+'px',width: isMobile ? '' : boxWidth+'px'}"
  )
    .img-inner-box
      img(:src="v.src")
      .img-info 第{{i+1}}张图片
        slot
  //- .loading(v-if="loading") 加载中...

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
    imgsArr: {
      type: Array,
      required: true
    },
    imgWidth: {
      type: Number,
      default: 230
    },
  },
  data() {
    return {
      msg: 'this is from vue-waterfall-easy.vue',
      colsHeightArr: [],
      imgBoxEls: null, // 所有的.img-box元素
      columnCount: NaN, // 列数，根据窗口大小初始化
      isMobile: false, // 移动端判断
      beginIndex: NaN,
      loading: true, // 预加载状态中（1.以等待图片替换 2.图片全部预加载完显示）
      imgsArrMy: [],
      loadedCount: 0 // 已经加载图片数量
    }
  },
  computed: {
    boxWidth() {
     return this.imgWidth + this.gap
    }
  },
  methods: {
    loadFn(e, oImg, i) {
      this.loadedCount++
      if (e.type === 'load') {
        console.log(this.imgsArr[i],i)
        this.$set(this.imgsArr[i],'height',this.imgWidth / (oImg.width / oImg.height))
        // this.imgsArr[i].height = this.imgWidth / (oImg.width / oImg.height) // 根据原始尺寸计算出图片的高度
      }
      if (this.loadedCount === this.imgsArr.length) {
        this.initImgsArrMy() // 预加载完成之后初始化渲染 图片数组
        this.$nextTick(() => {
          this.initImgBoxEls()
          // alert('加载完毕')
          if(this.imgsArr.length>12){
          }
          this.$emit('preloaded')

        })
      }
    },
    preloadImg() { // 图片预加载
      this.imgsArr.forEach((v, i) => {
        var oImg = new Image()
        oImg.addEventListener('load', (e) => { this.loadFn(e, oImg, i) })
        oImg.addEventListener('error', (e) => { this.loadFn(e, oImg, i) })
        oImg.src = v.src
      })
    },
    initImgsArrMy() { // 图片全部预加载完成之后修改
      this.imgsArrMy = this.imgsArr.concat([])
    },
    initIsMobile() { // 移动端初始化化
      if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) this.isMobile = true
    },
    initColumnCount() { // 列数初始化
      var winWidth = window.innerWidth
      if (winWidth > this.boxWidth * 5) {
        this.columnCount = 5
      } else if (winWidth > this.boxWidth * 4) {
        this.columnCount = 4
      } else if (winWidth > this.boxWidth * 3) {
        this.columnCount = 3
      } else if (winWidth > this.boxWidth * 2) {
        this.columnCount = 2
      } else {
        this.columnCount = this.isMobile ? 2 : 1
      }
      this.beginIndex = this.columnCount // 开始排列的元素索引

      // alert(this.beginIndex+'--'+winWidth)

    },


    initColsHeightArr() { // 第一行元素的高度组成的数组-初始化
      this.colsHeightArr = [] // 列数发生变化
      for (var i = 0; i < this.columnCount; i++) {
        this.imgBoxEls[i].style.position = 'static' // 重置下position
        var height =  Math.round(this.imgBoxEls[i].getElementsByClassName('img-info')[0].offsetHeight+ this.imgsArr[i].height + this.gap)
        this.colsHeightArr.push(height)
      }
    },
    initImgBoxEls() { // 初始化所有装图片的元素集合,注意高度获取需要在图片加载完成之后，所以在window.onload 事件中初始化
      this.imgBoxEls = document.getElementsByClassName('img-box')
    },
    waterfall() { // 执行瀑布布局
      for (var i = this.beginIndex; i < this.imgsArr.length; i++) {
        var minHeight = Math.min.apply(null, this.colsHeightArr) // 最低高低
        // alert(this.colsHeightArr)
        var minIndex = this.colsHeightArr.indexOf(minHeight) // 最低高度的索引
        console.log(this.colsHeightArr,minHeight,minIndex)
        var width = this.imgBoxEls[0].offsetWidth // 图片的宽度获取
        // 设置元素定位的位置
        // console.log(this.imgBoxEls[i],i)
        this.imgBoxEls[i].style.position = 'absolute'
        this.imgBoxEls[i].style.left = minIndex * width + 'px'
        this.imgBoxEls[i].style.top = minHeight + 'px'

        // 更新colsHeightArr
        // console.log(this.imgsArr,this.imgsArr[i].height,i)
        var height =  Math.round(this.imgBoxEls[i].getElementsByClassName('img-info')[0].offsetHeight+ this.imgsArr[i].height + this.gap)
        this.$set(this.colsHeightArr, minIndex, minHeight + height)
      }
      this.beginIndex = this.imgsArr.length
      // console.log(this.colsHeightArr)
    }
  },
  created() {
    this.preloadImg()
  },
  mounted() {
    this.initIsMobile()
    this.initColumnCount()

    this.$on('preloaded', () => {


      // window.addEventListener('load', () => {
      if (this.colsHeightArr.length === 0) this.initColsHeightArr() // 第一次初始化

      this.waterfall()
      // })

    })
    window.addEventListener('resize', () => {

      this.initColumnCount()
      this.initColsHeightArr()
      this.waterfall()

    })

    window.addEventListener('scroll', () => {
      console.log(document.body.scrollTop + window.innerHeight, document.body.scrollHeight)
      if (document.body.scrollTop + window.innerHeight === document.body.scrollHeight) {
        this.$emit('loadImg')

      }
    })
  },
  watch: {
    imgsArr(newV,oldV) {
      if(newV.length === oldV.length) return
      this.preloadImg()


    },
    columnCount() {

    }
  }
}
</script>
