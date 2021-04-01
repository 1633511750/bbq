// pages/publish/index.js
var app = getApp()
const { $http } = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyHeight_int: 0,
    tempImgSrc_arr: [],
    friendsName_arr: [],// @好友的名字
    text_str: '',//textarea的内容
    category_str: '',// 帖子分类
    school_str: ''
  },

  keyboardheight_fun: function (e) {
    this.setData({
      keyHeight_int: e.detail.height
    })
  },

  // 调用相机、图库弹框
  tapPic_fun: function () {
    wx.showActionSheet({
      itemList: ['拍摄', '从相册选择'],
      // itemColor: '#aaa',
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.useCamera_fun('camera')
            break
          case 1:
            this.useCamera_fun('album')
            break
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },

  // 调用相机、图库
  useCamera_fun(type) {
    var self = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        self.setData({
          // tempFilePath可以作为img标签的src属性显示图片
          tempImgSrc_arr: res.tempFilePaths,
        })
      }
    })
  },

  // 跳转到@好友页面
  tapAite_fun: function () {
    wx.navigateTo({
      url: '/pages/aite/index',
    });
  },

  //textchange
  textchange_fun(e) {
    this.setData({
      text_str: e.detail.value
    })
  },

  // 发帖
  publicArtical_fun() {
    console.log(this.data.text_str);
    if (this.data.text_str.trim() === '') {
      wx.showToast({ title: '请输入内容', icon: 'error' })
      return
    }
    wx.showModal({
      title: '发帖',
      content: '是否发表该帖子？',
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          $http({
            url: '/User/publisArticle', method: 'post', data: {
              category: this.data.category_str,
              content: this.data.text_str.trim(),
              school: app.globalData.school_str,
              location: app.globalData.country_str + app.globalData.province_str + app.globalData.city_str,
              isAnonymous: wx.getStorageSync('isAnonymous') ? 1 : 0
            }
          }).then(res => {
            console.log(res, app.globalData.country_str + app.globalData.province_str + app.globalData.city_str);
            if (res.data.success) {
              wx.showToast({ title: '发帖成功' })
              setTimeout(() => {
                var pages = getCurrentPages()
                var curPage = pages[pages.length - 1]
                var url = curPage.route
                if (url === 'pages/publish/index') {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }, 1500);
            } else {
              wx.showToast({ title: '发帖失败', icon: 'error' })
            }
          }).catch(res => {
            wx.showToast({ title: res, icon: 'error' })
          })
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      category_str: options.category,
      school_str: app.globalData.school_str
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
    if (this.data.friendsName_str !== '') {
      var friendName_str = ''
      this.data.friendsName_arr.forEach(item => {
        friendName_str += '@' + item + ' '
      })
      this.setData({
        text_str: this.data.text_str + friendName_str
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      friendsName_arr: []
    })
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