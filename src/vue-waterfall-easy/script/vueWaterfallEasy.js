(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vueWaterfallEasy"] = factory();
	else
		root["vueWaterfallEasy"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

//import XXX from './components/XXX'

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'vue-waterfall-easy',
  props: {
    width: { // 容器宽度
      type: Number
    },
    height: { // 容器高度
      type: Number
    },
    reachBottomDistance: { // 滚动触底距离，触发加载新图片
      type: Number, // selector
      default: 0 // 默认在最低那一列到底时触发
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
      required: true,
      default: []
    },
    imgWidth: {
      type: Number,
      default: 240
    },
    linkRange: { // card | img | custom 自定义通过slot自定义链接范围
      type: String,
      default: 'card'
    },
    loadingTimeOut: { // 预加载事件小于500毫秒就不显示加载动画，增加用户体验
      type: Number,
      default: 500
    }
  },
  data: function data() {
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
      isFirstLoad: true // 首次加载
    };
  },

  computed: {
    colWidth: function colWidth() {
      // 每一列的宽度
      return this.imgWidth + this.gap;
    },
    imgWidth_c: function imgWidth_c() {
      // 对于移动端重新计算图片宽度
      return this.isMobile ? window.innerWidth / 2 - this.gap : this.imgWidth;
    },
    hasLoadingSlot: function hasLoadingSlot() {
      return !!this.$scopedSlots.loading;
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.loadingMiddle();

    this.preload();
    this.cols = this.calcuCols();
    this.$on('preloaded', function () {
      _this.isFirstLoad = false;

      _this.imgsArr_c = _this.imgsArr.concat([]); // 预加载完成，这时才开始渲染
      _this.$nextTick(function () {
        _this.isPreloading = false;
        _this.imgBoxEls = _this.$el.getElementsByClassName('img-box');
        // console.log('图片总数', this.imgBoxEls.length)
        _this.waterfall();
      });
    });
    if (!this.isMobile && !this.width) this.response();
    this.scroll();
  },

  watch: {
    isPreloading: function isPreloading(newV, oldV) {
      var _this2 = this;

      if (newV) {
        setTimeout(function () {
          if (!_this2.isPreloading) return; // 500毫秒内预加载完图片则不显示加载动画
          _this2.isPreloading_c = true;
        }, this.loadingTimeOut);
      } else {
        this.isPreloading_c = false;
      }
    },
    imgsArr: function imgsArr(newV, oldV) {
      if (newV.length === oldV.length) return;
      this.preload();
    }
  },
  methods: {
    // ==1== 预加载
    preload: function preload(src, imgIndex) {
      var _this3 = this;

      this.imgsArr.forEach(function (imgItem, imgIndex) {
        if (imgIndex < _this3.loadedCount) return; // 只对新加载图片进行预加载
        var oImg = new Image();
        oImg.src = imgItem.src;
        oImg.onload = oImg.onerror = function (e) {
          _this3.loadedCount++;
          // 预加载图片，计算图片容器的高
          if (e.type == 'load') _this3.$set(_this3.imgsArr[imgIndex], 'height', Math.round(_this3.imgWidth_c / (oImg.width / oImg.height)));
          if (_this3.loadedCount == _this3.imgsArr.length) {
            _this3.$emit('preloaded');
          }
        };
      });
    },

    // ==2== 计算cols
    calcuCols: function calcuCols() {
      // 列数初始化
      var waterfallWidth = this.width ? this.width : window.innerWidth;
      var cols = parseInt(waterfallWidth / this.colWidth);
      cols = cols === 0 ? 1 : cols;
      return this.isMobile ? 2 : cols > this.maxCols ? this.maxCols : cols;
    },

    // ==3== waterfall布局
    waterfall: function waterfall() {
      var scrollEl = this.$el.querySelector('.vue-waterfall-easy-scroll');

      console.log('waterfall');
      var top,
          left,
          colWidth = this.isMobile ? this.imgBoxEls[0].offsetWidth : this.colWidth;
      if (this.beginIndex == 0) this.colsHeightArr = [];
      for (var i = this.beginIndex; i < this.imgsArr.length; i++) {
        if (i < this.cols) {
          var height = this.imgBoxEls[i].offsetHeight;
          this.colsHeightArr.push(height);
          top = 0;
          left = i * colWidth;
        } else {
          var minHeight = Math.min.apply(null, this.colsHeightArr); // 最低高低
          var minIndex = this.colsHeightArr.indexOf(minHeight); // 最低高度的索引
          top = minHeight;
          left = minIndex * colWidth;
          // 设置元素定位的位置
          // 更新colsHeightArr
          this.colsHeightArr[minIndex] = minHeight + this.imgBoxEls[i].offsetHeight;
        }
        this.imgBoxEls[i].style.left = left + 'px';
        this.imgBoxEls[i].style.top = top + 'px';
      }

      this.beginIndex = this.imgsArr.length; // 排列完之后，新增图片从这个索引开始预加载图片和排列
    },


    // ==4== resize 响应式
    response: function response() {
      var _this4 = this;

      window.addEventListener('resize', function () {
        var old = _this4.cols;
        _this4.cols = _this4.calcuCols();
        if (old === _this4.cols) return; // 列数不变直接退出
        _this4.beginIndex = 0; // 开始排列的元素索引
        _this4.waterfall();
      });
    },


    // ==5== 滚动触底事件
    scroll: function scroll() {
      var _this5 = this;

      var scrollEl = this.$el.querySelector('.vue-waterfall-easy-scroll');

      scrollEl.addEventListener('scroll', function () {

        if (_this5.isPreloading) return;
        var minHeight = Math.min.apply(null, _this5.colsHeightArr);
        if (scrollEl.scrollTop + scrollEl.offsetHeight > minHeight - _this5.reachBottomDistance) {
          _this5.isPreloading = true;
          // console.log('scrollReachBottom')
          _this5.$emit('scrollReachBottom'); // 滚动触底
        }
      });
    },


    // other
    loadingMiddle: function loadingMiddle() {
      // 对滚动条宽度造成的不居中进行校正
      var scrollEl = this.$el.querySelector('.vue-waterfall-easy-scroll');
      var scrollbarWidth = scrollEl.offsetWidth - scrollEl.clientWidth;
      this.$el.querySelector('.loading').style.marginLeft = -scrollbarWidth / 2 + 'px';
    }
  }
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_waterfall_easy_vue__ = __webpack_require__(0);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ded6b974_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_vue_waterfall_easy_vue__ = __webpack_require__(8);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(2)
}
var normalizeComponent = __webpack_require__(7)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_waterfall_easy_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ded6b974_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_vue_waterfall_easy_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\vue-waterfall-easy\\vue-waterfall-easy.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ded6b974", Component.options)
  } else {
    hotAPI.reload("data-v-ded6b974", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("53b945b7", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ded6b974\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-waterfall-easy.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ded6b974\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-waterfall-easy.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "\n.vue-waterfall-easy-container {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n.vue-waterfall-easy-container .vue-waterfall-easy-scroll {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    overflow-x: hidden;\n    overflow-y: scroll;\n}\n.vue-waterfall-easy-container .vue-waterfall-easy {\n    position: absolute;\n    width: 100%;\n}\n.vue-waterfall-easy-container .vue-waterfall-easy > .img-box {\n      position: absolute;\n      -webkit-box-sizing: border-box;\n              box-sizing: border-box;\n      -webkit-transition: left .6s, top .6s;\n      transition: left .6s, top .6s;\n      -webkit-transition-delay: .1s;\n              transition-delay: .1s;\n      width: 50%;\n}\n.vue-waterfall-easy-container .vue-waterfall-easy .img-inner-box {\n      -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n}\n.vue-waterfall-easy-container .vue-waterfall-easy .img-wraper > img {\n      width: 100%;\n      display: block;\n      border: none;\n}\n.vue-waterfall-easy-container > .loading.first {\n    bottom: 50%;\n    -webkit-transform: translate(-50%, 50%);\n            transform: translate(-50%, 50%);\n}\n.vue-waterfall-easy-container > .loading {\n    position: absolute;\n    left: 50%;\n    -webkit-transform: translateX(-50%);\n            transform: translateX(-50%);\n    bottom: 6px;\n    z-index: 999;\n}\n@-webkit-keyframes ball-beat {\n50% {\n    opacity: 0.2;\n    -webkit-transform: scale(0.75);\n            transform: scale(0.75);\n}\n100% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n            transform: scale(1);\n}\n}\n@keyframes ball-beat {\n50% {\n    opacity: 0.2;\n    -webkit-transform: scale(0.75);\n            transform: scale(0.75);\n}\n100% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n            transform: scale(1);\n}\n}\n.vue-waterfall-easy-container > .loading.ball-beat > .dot {\n      vertical-align: bottom;\n      background-color: #4b15ab;\n      width: 12px;\n      height: 12px;\n      border-radius: 50%;\n      margin: 3px;\n      -webkit-animation-fill-mode: both;\n              animation-fill-mode: both;\n      display: inline-block;\n      -webkit-animation: ball-beat 0.7s 0s infinite linear;\n              animation: ball-beat 0.7s 0s infinite linear;\n}\n.vue-waterfall-easy-container > .loading.ball-beat > .dot:nth-child(2n-1) {\n      -webkit-animation-delay: 0.35s;\n              animation-delay: 0.35s;\n}\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(6)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "vue-waterfall-easy-container",
      style: {
        width: _vm.width && !_vm.isMobile ? _vm.width + "px" : "",
        height: _vm.height ? _vm.height + "px" : ""
      }
    },
    [
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.isPreloading_c,
              expression: "isPreloading_c"
            }
          ],
          staticClass: "loading ball-beat",
          class: { first: _vm.isFirstLoad }
        },
        [
          _vm._t("loading", null, { isFirstLoad: _vm.isFirstLoad }),
          _vm._l(_vm.loadingDotCount, function(n) {
            return !_vm.hasLoadingSlot
              ? _c("div", { staticClass: "dot", style: _vm.loadingDotStyle })
              : _vm._e()
          })
        ],
        2
      ),
      _c("div", { staticClass: "vue-waterfall-easy-scroll" }, [
        _c(
          "div",
          {
            staticClass: "vue-waterfall-easy",
            style: _vm.isMobile
              ? ""
              : {
                  width: _vm.colWidth * _vm.cols + "px",
                  left: "50%",
                  marginLeft: -1 * _vm.colWidth * _vm.cols / 2 + "px"
                }
          },
          [
            _vm._t("waterfall-head"),
            _vm._l(_vm.imgsArr_c, function(v, i) {
              return _c(
                "a",
                {
                  staticClass: "img-box",
                  style: {
                    padding: _vm.gap / 2 + "px",
                    width: _vm.isMobile ? "" : _vm.colWidth + "px"
                  },
                  attrs: {
                    href:
                      _vm.linkRange == "card" ? v.href : "javascript:void(0)",
                    target: "_blank"
                  }
                },
                [
                  _c(
                    "div",
                    { staticClass: "img-inner-box" },
                    [
                      _c(
                        "a",
                        {
                          staticClass: "img-wraper",
                          style: {
                            width: _vm.imgWidth_c + "px",
                            height: v.height ? v.height + "px" : ""
                          },
                          attrs: {
                            href:
                              _vm.linkRange == "img" || _vm.linkRange == "card"
                                ? v.href
                                : "javascript:void(0)",
                            target: "_blank"
                          }
                        },
                        [_c("img", { attrs: { src: v.src } })]
                      ),
                      _vm._t("default", null, { index: i, value: v })
                    ],
                    2
                  )
                ]
              )
            })
          ],
          2
        )
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-ded6b974", esExports)
  }
}

/***/ })
/******/ ])["default"];
});