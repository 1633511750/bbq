const { $http } = require('./utils/util')

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
      },
      fail(err) {
        console.log(err);
      }
    })

    // 读取用户信息
    this.globalData.avatarUrl_str = wx.getStorageSync('avatarUrl')
    this.globalData.nickName_str = wx.getStorageSync('nickName')
    this.globalData.country_str = wx.getStorageSync('country')
    this.globalData.province_str = wx.getStorageSync('province')
    this.globalData.city_str = wx.getStorageSync('city')

    this.globalData.bgColor_str = wx.getStorageSync('bgColor') || '#fff'  // 主题颜色

    // isAnonymous 是否匿名

    // 管理员注册的账号:
    // name: 'coldice',
    // password: 'abcdefg123',
    // school: '山西大学',
    // phoneNumber: '18000000000'
    // JSESSIONID=FB550FDA9A5B9763F2ED87D4E9DC691E; Path=/; HttpOnly

    $http({
      hasLimit: true, url: '/User/selectedSchool', method: 'get', data: {
        school: '山西传媒学院'
      }
    })
      .then(res => {
        console.log(res.data.data);
      })

    


    // $http({ url: '/User/complain', method: 'post', data: { articleId: 4, category: '内容不实', content: '测试' } })
    //   .then(res => {
    //     console.log(res);
    //   })
  },

  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],//获取状态栏高度

    school_str: '山西传媒学院',
    location: '太原',
    avatarUrl_str: '',  // 头像
    nickName_str: '',   // 昵称
    country_str: '',    // 国家
    province_str: '',   // 省份
    city_str: '',       // 城市
    anonymousAvatarUrl_str: '/img/mine.png', // 匿名头像

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
