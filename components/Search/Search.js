// components/Search.js
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    focus_fun() {
      this.triggerEvent('changeTextEvent')
    },
    tap_fun() {
      this.triggerEvent('tapEvent')
    }
  },
})