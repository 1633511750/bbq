var app = getApp()
// components/Top/Top.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    school: {
      type: String,
      default: ''
    },
    nums: {
      type: Number,
      default: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})