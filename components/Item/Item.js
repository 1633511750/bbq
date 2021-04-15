// components/Item/Item.js
var app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      default: {}
    },
    isMy: {
      type: Boolean
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    item_str: '',
    avatarUrl_str: app.globalData.avatarUrl_str
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 大图预览
    previewImages_fun(e) {
      var urls = e.currentTarget.dataset.urls
      var cururl = e.currentTarget.dataset.cururl
      wx.previewImage({
        current: cururl, // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表
      })
    },

    // 点赞
    dotZan_fun(e) {
      this.triggerEvent('zanevent')
    }
  },
  created: function () {

  },
  attached: function () {
    this.setData({
      item_str: JSON.stringify(this.properties.item)
    })
    console.log(this.properties.item);
  },
  ready: function () {

  },
  moved: function () {

  },
  detached: function () {

  },
})