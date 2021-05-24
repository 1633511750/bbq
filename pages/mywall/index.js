// pages/mywall/index.js
const { $http, myTime } = require('../../utils/util')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasArtical_bool: true,
    commentList_arr: [],

    typeList_arr: ['表白', '找对象', '找同伴', '感情', '二手交易', '爱豆', '有偿求助', '失物招领', '吐槽', '游戏', '曝光', '问答', '靓仔日常', '捞人', '其他'],
    tagBg_arr: ['#C962E3', '#C962E3', '#C962E3', '#C962E3', '#FFCD1D', '#00B4FF', '#FFCD1D', '#FFCD1D', '#FF3434', '#00B4FF', '#FF3434', '#3DC795', '#00B4FF', '#C962E3', '#3DC795']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllMyArtical_fun()
  },

  pageview_fun(e) {
    var id = e.detail.pageviewId_int
    let pageviewNum_int = e.detail.pageviewNum_int
    console.log(id, pageviewNum_int);
    let index_int = this.data.commentList_arr.findIndex(item => item.id === id)
    if (index_int !== -1) {
      this.setData({
        ['commentList_arr[' + index_int + '].pageviews']: pageviewNum_int
      })
      console.log();
    } else {
      console.log('浏览量设置失败');
    }
  },

  dotZan_fun(e) {
    var id = e.currentTarget.dataset.id
    let dz_arr = e.detail.dz_arr
    console.log(dz_arr);

    let index_int = this.data.commentList_arr.findIndex(item => item.id === id)
    if (index_int !== -1) {
      let index = dz_arr.indexOf(app.globalData.uid_int + '')
      if (index !== -1) {
        this.setData({
          ['commentList_arr[' + index_int + '].dianzanNum_int']: dz_arr.length,
          ['commentList_arr[' + index_int + '].isZan']: true,
          ['commentList_arr[' + index_int + '].dianzan_str']: dz_arr.join(',')
        })
      } else {
        this.setData({
          ['commentList_arr[' + index_int + '].dianzanNum_int']: dz_arr.length,
          ['commentList_arr[' + index_int + '].isZan']: false,
          ['commentList_arr[' + index_int + '].dianzan_str']: dz_arr.join(',')
        })
      }
    } else {
      console.log('no');
    }
  },

  getAllMyArtical_fun() {
    $http({ url: '/Article/getArticlesByFromUid' })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          var list_arr = res.data.data.articleList.reverse()
          list_arr.forEach((item) => {
            var t_o = myTime(item.createTime)
            // item.date_str = t_o.month + '-' + t_o.day
            // item.time_str = t_o.hour + ':' + t_o.minute
            item.date_str = t_o.time

            item.commentListNum_int = item.commentList[0].commentCount

            let index_int = this.data.typeList_arr.indexOf(item.category)
            item.tagBg_str = this.data.tagBg_arr[index_int]

            if (item.dianzanUids) {
              let dz_arr = item.dianzanUids.split(',')
              dz_arr = dz_arr.filter(item => item !== '')
              item.dianzan_str = dz_arr.join(',')
              item.dianzanNum_int = dz_arr.length
              if (dz_arr.includes('' + app.globalData.uid_int)) {
                item.isZan = true
              } else {
                item.isZan = false
              }
            } else {
              item.dianzanNum_int = 0
              item.dianzan_str = ''
            }

            if (item.isAnonymous) {
              item.name_str = '匿名'
              item.avatarUrl_str = app.globalData.anonymousAvatarUrl_str
            } else {
              item.name_str = item.userList[0] && item.userList[0].name || 'unknown'
              item.avatarUrl_str = item.userList[0] && item.userList[0].userHeadpoait && (app.globalData.baseUrl + item.userList[0].userHeadpoait.slice(25) + '/' + item.userList[0].pictureName)
            }

            item.imgOrg = []
            item.img = []
            item.picturePath = item.picturePath || ''
            var urlId = item.picturePath.substring(25)
            item.pictureNames.forEach((item1, index) => {
              item.imgOrg.push(app.globalData.baseUrl + urlId + '/' + item1)
              if (index < 6) {
                item.img.push(app.globalData.baseUrl + urlId + '/' + item1)
              }
            })
          })
          this.setData({
            commentList_arr: list_arr,
            hasArtical_bool: true
          })
        } else if (res.data.code === 229) {
          this.setData({
            hasArtical_bool: false
          })
        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'error',
          });
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.backState_int === 1) {
      app.globalData.backState_int = 0
      this.setData({
        topListIndex_int: 0
      })

      this.getAllMyArtical_fun()
    }

    if (app.globalData.zanId_int !== -1) {
      console.log(app.globalData.zanId_int);
      let index_int = this.data.commentList_arr.findIndex(item => item.id === app.globalData.zanId_int)
      if (index_int !== -1) {
        this.setData({
          ['commentList_arr[' + index_int + '].dianzanNum_int']: this.data.commentList_arr[index_int].dianzanNum_int + 1,
          ['commentList_arr[' + index_int + '].isZan']: true
        })
      }
      app.globalData.zanId_int = -1
    }

    if (app.globalData.pageviewId_int !== -1) {
      let index_int = this.data.commentList_arr.findIndex(item => item.id === app.globalData.pageviewId_int)
      if (index_int !== -1) {
        this.setData({
          ['commentList_arr[' + index_int + '].pageviews']: this.data.commentList_arr[index_int].pageviews + 1,
        })
      }
      app.globalData.pageviewId_int = -1
    }

    if (app.globalData.commentId_int !== -1) {
      let index_int = this.data.commentList_arr.findIndex(item => item.id === app.globalData.commentId_int)
      if (index_int !== -1) {
        this.setData({
          ['commentList_arr[' + index_int + '].commentListNum_int']: app.globalData.commentNum_int
        })
      }
      app.globalData.commentId_int = -1
      app.globalData.commentNum_int = -1
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})