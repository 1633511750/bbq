// components/Search.js
const { $http } = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    prop: {
      type: String,
      default: '搜索'
    },
    text: {
      type: String,
      default: '搜索'
    },
    searchValue: {
      type: String,
      default: ''
    },
    nums: {
      type: Number,
      default: 2
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keywords: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    focus_fun() {
      this.triggerEvent('changeTextEvent')
    },
    input_fun(e) {
      if (this.properties.prop === '搜索') {
        // 搜索帖子
        this.triggerEvent('searchevent', e.detail.value)
      } else {
        // 输入学校选择
        this.triggerEvent('schoolevent', e.detail.value)
      }
    },
    // 点击了搜索按钮
    tap_fun() {
      if (this.properties.prop === '搜索') {
        this.triggerEvent('searchBtnevent')
      } else {
        this.triggerEvent('allSchoolEvent')
      }
    }
  },
})