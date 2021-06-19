const { $http } = require('./utils/util')

App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // 读取用户信息
    if (wx.getStorageSync('school')) {
      this.globalData.school_str = wx.getStorageSync('school')
    } else {
      wx.setStorageSync('historySchool', [this.globalData.school_str]);
    }
    // this.globalData.avatarUrl_str = wx.getStorageSync('avatarUrl')
    this.globalData.avatarUrl_str = wx.getStorageSync('avatarUrl')
    this.globalData.nickName_str = wx.getStorageSync('nickName')
    this.globalData.country_str = wx.getStorageSync('country')
    this.globalData.province_str = wx.getStorageSync('province')
    this.globalData.city_str = wx.getStorageSync('city')
    this.globalData.uid_int = wx.getStorageSync('uid') - 0
    this.globalData.bgColor_str = wx.getStorageSync('bgColor') || '#fff'  // 主题颜色
    console.log('uid:' + this.globalData.uid_int);
    // isAnonymous 是否匿名
    // 管理员注册的账号:
    // name: 'coldice',
    // password: 'abcdefg123',
    // school: '山西大学',
    // phoneNumber: '18000000000'
    // JSESSIONID=FB550FDA9A5B9763F2ED87D4E9DC691E; Path=/; HttpOnly

    // $http({
    //   isJson: true, method: 'post', url: '/businessStreet/addOrUpdateGoods', data: {
    //     shopId: 14,
    //     business: 1,  // 1：上架中，0：待上架
    //     costPrice: 88,
    //     creater: 3,
    //     examined: 0,  // 0：未审核，1：已审核
    //     introductionText: '这是商品方便面简介',
    //     name: '方便面',
    //     price: 66,
    //     id: 7
    //   }
    // }).then(res => {
    //   console.log(res);
    //   if (res.data.code === 200) {
    //     wx.showToast({ title: '提交审核成功' })
    //   } else {
    //     wx.showToast({ title: '提交失败', icon: 'error' })
    //   }
    // })
    // wx.request({
    //   url: 'http://119.3.155.165:3000',
    //   success: (result) => {
    //     console.log(result);
    //   },
    //   fail: (res) => { },
    //   complete: (res) => { },
    // // })

    // wx.reLaunch({
    //   url: '/pages/index/i',
    //   success: (result) => {

    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });

  },

  globalData: {
    baseUrl: 'https://www.guoer.ltd',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],//获取状态栏高度
    isToLogin_bool: false,
    // 回到首页时的状态
    backState_int: 0,
    zanId_int: -1,
    zanNum_int: -1,
    isZan_bool: false,
    pageviewId_int: -1,
    commentId_int: -1,
    commentNum_int: -1,

    avatarUrl_str: '/img/wechat.png',  // 用户头像
    uid_int: 0,
    school_str: '山西传媒学院',
    location: '太原',
    avatarUrl_str: '',  // 头像
    nickName_str: '',   // 昵称
    country_str: '',    // 国家
    province_str: '',   // 省份
    city_str: '',       // 城市
    anonymousAvatarUrl_str: '/img/niming.jpg', // 匿名头像

    bgColor_str: '',  // 主题颜色
    bgA_str: 'aa',
    conColor_str: '#ffffff',
    conA_str: '33'
  },

  // 读取主题颜色
  getColor_fun(self) {
    var bgColor_str = wx.getStorageSync('bgColor') || ''
    self.setData({
      bgColor_str: bgColor_str,
      bgA_str: this.globalData.bgA_str,
      conColor_str: this.globalData.conColor_str,
      conA_str: this.globalData.conA_str
    })

    wx.setNavigationBarColor({ "frontColor": '#ffffff', 'backgroundColor': bgColor_str })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
})