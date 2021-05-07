// components/Item/Item.js
import { $http } from '../../utils/util'
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
    }
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
      // $http({ url: '/getCommentsByArticleId', data: { articleId: this.properties.item.id } })
      //   .then(res => {
      //     console.log(res);
      //   })
      // if (this.properties.item.isZan) {
      //   return
      // }
      $http({
        url: '/Article/updateDianzanToArtic', method: 'post', data: {
          articId: this.properties.item.id
        }
      }).then(res => {
        console.log(res);
        if (res.data.dianzanStatus === '1') {
          let item_obj = this.properties.item
          item_obj.isZan = true
          item_obj.dianzanNum_int++
          this.setData({
            item: item_obj
          })
          this.triggerEvent('zanevent', { zanId_int: this.properties.item.id - 0 })
        }else if (res.data.dianzanStatus === '-1') {
          let item_obj = this.properties.item
          item_obj.isZan = false
          item_obj.dianzanNum_int--
          this.setData({
            item: item_obj
          })
          this.triggerEvent('zanevent', { zanId_int: this.properties.item.id - 0 })
        } else {
          wx.showToast({ title: '点赞失败', icon: 'error' })
        }
      }).catch(res => {
        console.log(res);
        wx.showToast({ title: '点赞失败', icon: 'error' })
      })
      // $http({
      //   url: '/Article/getDianzanCountByArticId', method: 'get', data: {
      //     articId: this.properties.item.id
      //   }
      // })
      //   .then(res => {
      //     console.log(res);
      //   })
      // $http({
      //   hasLimit: true, url: '/Answer/getAnswersCountByCommentId', method: 'get', data: {
      //     commentId: this.properties.item.id
      //   }
      // })
      //   .then(res => {
      //     console.log(res);
      //   })

    },

    gotoDetail_fun() {
      let item_str = JSON.stringify(this.properties.item)
      wx.navigateTo({
        url: '/pages/detail/index?item=' + item_str + '&isMy=' + this.properties.isMy,
      });
    },
  },
  created: function () {
  },
  attached: function () {
    // this.setData({
    //   item_str: JSON.stringify(this.properties.item)
    // })
    // console.log(this.properties.item);
  },
  ready: function () {

  },
  moved: function () {

  },
  detached: function () {

  },
})