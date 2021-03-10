// components/Item/Item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      default: {}
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
  }
})