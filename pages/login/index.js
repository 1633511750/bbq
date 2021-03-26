// pages/login/index.js
const { $http } = require('../../utils/util')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl_str: '',
    nickName_str: '',
    country_str: '',
    province_str: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindGetUserInfo_fun(e) {
    var userInfo = e.detail.userInfo
    console.log(userInfo);
    if (userInfo === undefined) {
      wx.showToast({ title: '已取消登录' })
      return
    }
    app.globalData.avatarUrl_str = userInfo.avatarUrl
    app.globalData.nickName_str = userInfo.nickName
    app.globalData.country_str = userInfo.country
    app.globalData.province_str = userInfo.province
    app.globalData.city_str = userInfo.city
    this.setData({
      avatarUrl_str: app.globalData.avatarUrl_str,
      nickName_str: app.globalData.nickName_str,
      country_str: app.globalData.country_str,
      province_str: app.globalData.province_str,
      city_str: app.globalData.city_str
    })
    var userInfo_o = {
      avatarUrl_str: userInfo.avatarUrl,
      nickName_str: userInfo.avatarUrl,
      country_str: userInfo.country,
      province_str: userInfo.province,
      city_str: userInfo.city
    }
    wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
    wx.setStorageSync('nickName', userInfo.nickName);
    wx.setStorageSync('country', userInfo.country);
    wx.setStorageSync('province', userInfo.province);
    wx.setStorageSync('city', userInfo.city);
    console.log(userInfo_o);

    this.register_fun(() => {
      setTimeout(() => {
        var pages = getCurrentPages()
        var curPage = pages[pages.length - 1]
        var url = curPage.route
        if (url === 'pages/login/index') {
          wx.navigateBack({
            delta: 1
          });
        }
      }, 1500);
    })
  },

  // 注册
  register_fun(callback = () => { }) {
    wx.login({
      timeout: 10000,
      success: (result) => {
        console.log('wxCode : ' + result.code);
        $http({
          url: '/User/register',
          method: 'post',
          data: { wxCode: result.code, verificationCode: 'XVJAIV' },
          hasLimit: false
        })
          .then((res) => {
            console.log(res);
            if (res.data.success) {
              // wx.showToast({
              //   title: '注册成功',
              //   icon: 'success',
              // });
              this.login_fun(callback)
            } else if (res.data.code === 202) {
              // wx.showToast({
              //   title: '用户已注册',
              //   icon: 'error',
              // });
              this.login_fun(callback)
            } else {
              wx.showToast({
                title: '注册失败',
                icon: 'error',
              });
            }
          }).catch((res) => {
            wx.showToast({
              title: '系统错误',
              icon: 'error',
            });
          })
      },
      fail: () => {
        wx.showToast({
          title: 'wxCode获取失败',
          icon: 'error',
        });
      },
      complete: () => { }
    });
  },

  // 登录
  login_fun(callback) {
    wx.login({
      timeout: 10000,
      success: (result) => {
        console.log('wxCode : ' + result.code);
        $http({ url: '/User/login', method: 'post', data: { wxCode: result.code }, hasLimit: false })
          .then((res) => {
            console.log(res);
            if (res.data.success) {
              wx.showToast({
                title: '登录成功',
                icon: 'success',
              });
              callback && callback()
              wx.setStorageSync('Cookie', res.data.data.sessionId);
              // console.log('login : ' + res.data.data.sessionId);
            } else if (res.data.code === 203) {
              wx.showToast({
                title: '用户未注册',
                icon: 'error',
              });
            } else {
              wx.showToast({
                title: '登录失败',
                icon: 'error',
              });
            }
          }).catch((res) => {
            wx.showToast({
              title: '系统错误',
              icon: 'error',
            });
          })
      },
      fail: () => {
        wx.showToast({
          title: 'wxCode获取失败',
          icon: 'error',
        });
      },
      complete: () => { }
    });
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