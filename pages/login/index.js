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
    sex_str: '',
    country_str: '',
    province_str: '',
    uid_int: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getUserProfile_fun(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo);
        this.bindGetUserInfo_fun.call(this, res.userInfo)
      }
    })
  },

  bindGetUserInfo_fun(userInfo) {
    // app.globalData.avatarUrl_str = userInfo.avatarUrl
    // app.globalData.nickName_str = userInfo.nickName
    // app.globalData.country_str = userInfo.country
    // app.globalData.province_str = userInfo.province
    // app.globalData.city_str = userInfo.city
    this.setData({
      // avatarUrl_str: userInfo.avatarUrl,
      nickName_str: userInfo.nickName,
      sex_str: userInfo.gender + ''
      // country_str: app.globalData.country_str,
      // province_str: app.globalData.province_str,
      // city_str: app.globalData.city_str
    })

    // var userInfo_o = {
    //   avatarUrl_str: userInfo.avatarUrl,
    //   nickName_str: userInfo.avatarUrl,
    //   country_str: userInfo.country,
    //   province_str: userInfo.province,
    //   city_str: userInfo.city
    // }
    // wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
    // wx.setStorageSync('nickName', userInfo.nickName);
    // wx.setStorageSync('country', userInfo.country);
    // wx.setStorageSync('province', userInfo.province);
    // wx.setStorageSync('city', userInfo.city);
    // console.log(userInfo_o);
    // 开始登录---------------------------------
    wx.showLoading({
      title: '登录中...',
      mask: true
    });
    this.login_fun(() => {
      wx.hideLoading();
      this.backLastPage_fun()
    })
  },

  uploadImgHandle_fun(imgPath, uid, callback = () => { }) {
    let self = this
    var Cookie = wx.getStorageSync('Cookie');
    wx.uploadFile({
      url: 'https://www.guoer.ltd/User/uploadImage',
      filePath: imgPath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data", "cookie": Cookie
      },
      formData: {
        uid
      },
      success(res) {
        console.log('图片上传成功');
        const data = JSON.parse(res.data).data
        app.globalData.avatarUrl_str = app.globalData.baseUrl + data.filePath.slice(25)
        wx.setStorageSync('avatarUrl', app.globalData.baseUrl + data.filePath.slice(25));

        callback()
      },
      fail(res) {
        console.log('no');
        console.log(res);
        wx.showToast({ title: '头像上传失败', icon: 'error' })
      }
    })
  },

  // 返回到首页
  backLastPage_fun() {
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
          hasLoading: false,
          data: { wxCode: result.code, verificationCode: 'XVJAIV', name: this.data.nickName_str, sex: this.data.sex_str },
          hasLimit: false
        }, false)
          .then((res) => {
            console.log(res);
            if (res.data.success) {
              // wx.showToast({
              //   title: '注册成功',
              //   icon: 'success',
              // });
              console.log('注册成功');
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
              wx.hideLoading();
            }
          }).catch((res) => {
            wx.showToast({
              title: '系统错误',
              icon: 'error',
            });
            wx.hideLoading();
            console.log(res);
          })
      },
      fail: () => {
        wx.showToast({
          title: 'wxCode获取失败',
          icon: 'error',
        });
        wx.hideLoading();
      },
      complete: () => { }
    });
  },

  // 登录
  login_fun(callback = () => { }) {
    let self = this
    wx.login({
      timeout: 10000,
      success: (result) => {
        console.log('wxCode : ' + result.code);
        $http({ url: '/User/login', method: 'post', data: { wxCode: result.code } }, false)
          .then((res) => {
            console.log(res);
            if (res.data.success) {
              setTimeout(() => {
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                });
              }, 0);

              wx.setStorageSync('Cookie', res.data.data.sessionId);
              app.globalData.uid_int = res.data.data.user.id
              wx.setStorageSync('uid', res.data.data.user.id)
              app.globalData.nickName_str = res.data.data.user.name
              wx.setStorageSync('nickName', res.data.data.user.name)
              app.globalData.backState_int = 1

              if (!res.data.data.user.userHeadpoait || !res.data.data.user.pictureName) {

                let tempPath_str
                // 上传用户微信的头像
                // wx.getSetting({
                //   success(res1) {
                //     wx.downloadFile({
                //       url: self.data.avatarUrl_str,
                //       success: function (res2) {
                //         tempPath_str = res2.tempFilePath
                //         self.uploadImgHandle_fun(tempPath_str, res.data.data.user.id, () => {
                //           callback()
                //           app.globalData.avatarUrl_str = tempPath_str
                //           wx.setStorageSync('avatarUrl', tempPath_str)
                //         })
                //       },
                //       fail: function (err) {
                //         wx.showToast({ title: '上传头像失败', icon: 'none' })
                //         console.log(err);
                //       },
                //       complete(res) {
                //         wx.hideLoading()
                //         console.log(res);
                //       }
                //     });
                //   }
                // })

                // 需要上传一个空白的头像， 待修改

              } else {
                // 保存头像数据
                app.globalData.avatarUrl_str = app.globalData.baseUrl + res.data.data.user.userHeadpoait.slice(25) + '/' + res.data.data.user.pictureName
                wx.setStorageSync('avatarUrl', app.globalData.avatarUrl_str)
                console.log('头像地址' + app.globalData.avatarUrl_str);
              }
              callback()

              // console.log('login : ' + res.data.data.sessionId);
            } else if (res.data.code === 203) {
              // wx.showToast({
              //   title: '用户未注册',
              //   icon: 'error',
              // });
              this.register_fun(callback)
              console.log('203');
            } else {
              wx.showToast({
                title: '登录失败',
                icon: 'error',
              });
              wx.hideLoading();
            }
          }).catch((res) => {
            wx.showToast({
              title: '系统错误',
              icon: 'error',
            });
            wx.hideLoading();
            console.log(res);
          })
      },
      fail: () => {
        wx.showToast({
          title: 'wxCode获取失败',
          icon: 'error',
        });
        wx.hideLoading();
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
    var pages = getCurrentPages()
    var curPage = pages[pages.length - 2]
    var url = curPage && curPage.route
    if (url === 'pages/login/index') {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  userXY_fun() {
    wx.navigateTo({
      url: '/pages/userXY/index',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

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