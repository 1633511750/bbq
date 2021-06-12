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
    },
    tagBg: {
      type: String,
      default: ''
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
      var add = e.currentTarget.dataset.add
      if (this.properties.item.isAnonymous === 1 && add === 'true') {
        return
      }

      var urls = e.currentTarget.dataset.urls
      var cururl = e.currentTarget.dataset.cururl
      wx.previewImage({
        current: cururl, // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表
      })
      if (add !== 'true') {
        this.addPageview_fun()
      }
    },

    // 浏览量+1
    addPageview_fun() {
      let articleId = this.properties.item.id
      $http({ url: '/Article/countPageViews', method: 'post', data: { articleId } })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.setData({
              ['item.pageviews']: this.properties.item.pageviews + 1
            })
            this.triggerEvent('pageviewevent', { pageviewId_int: this.properties.item.id, pageviewNum_int: this.properties.item.pageviews })
          } else {
          }
        }).catch(err => {
          console.log(err);
        })
    },

    // 点赞
    dotZan_fun(e) {
      // if (this.properties.item.isZan) {
      //   return
      // }

      let dz_arr = this.properties.item.dianzan_str.split(',')
      dz_arr = dz_arr.filter(item => item !== '')

      let dzIndex_int = dz_arr.indexOf(app.globalData.uid_int + '')
      if (dzIndex_int !== -1) {
        dz_arr.splice(dzIndex_int, 1)
        // this.setData({
        //   ['item.isZan']: false
        // })
      } else {
        dz_arr.push(app.globalData.uid_int + '')
        // this.setData({
        //   ['item.isZan']: true
        // })
      }

      let dz_str = dz_arr.join(',')
      // this.setData({
      //   ['item.dianzan_str']: dz_str,
      //   ['item.dianzanNum_str']: dz_arr.length
      // })

      $http({
        url: '/Article/updateDianzanToArtic', method: 'post', data: {
          articId: this.properties.item.id - 0,
          dianzanUids: dz_str
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          // let item_obj = this.properties.item
          // item_obj.isZan = true
          // item_obj.dianzanNum_int++
          // this.setData({
          //   item: item_obj
          // })
          this.triggerEvent('zanevent', { dz_arr })
        } else {
          // wx.showToast({ title: '点赞失败', icon: 'error' })
        }
      }).catch(res => {
        console.log(res);
        // wx.showToast({ title: '点赞失败', icon: 'error' })
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
        url: '/pages/detail/index?item=' + item_str + '&isMy=' + this.properties.isMy + '&tagBg=' + this.properties.tagBg,
      });
    },
  },
  created: function () {
  },
  attached: function () {
    // this.setData({
    //   item_str: JSON.stringify(this.properties.item)
    // })
  },
  ready: function () {

  },
  moved: function () {

  },
  detached: function () {

  },
})