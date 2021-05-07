let app = getApp()
import { $http } from '../../utils/util'
// pages/updateMyInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPicUrl_str: '',
    nickName_str: '',
    school_str: ''
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

  // 修改个人信息
  updateMyInfo_fun() {
    this.updateNickName_fun()
  },

  // 修改用户头像
  useCamera_fun(type) {
    var self = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        let imgPath = res.tempFilePaths[0]
        console.log(imgPath);
        this.uploadImgHandle_fun(imgPath)
      }
    })
  },

  uploadImgHandle_fun(imgPath) {
    var Cookie = wx.getStorageSync('Cookie');
    wx.uploadFile({
      url: 'https://www.guoer.ltd/User/uploadImage',
      filePath: imgPath,
      name: 'file',
      header: {
        "Content-Type": "application/json", "cookie": Cookie
      },
      formData: {
        uid: 3
      },
      success(res) {
        const data = res.data
        console.log(data);
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  inputValue_fun(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      [type + '_str']: e.detail.value
    })
  },

  // 修改昵称
  updateNickName_fun() {
    console.log('ok');
    if (this.data.nickName_str.trim() === '') {
      return
    }
    console.log('no');
    $http({
      url: '/User/updataName', method: 'post', data: {
        name: this.data.nickName_str.trim()
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        wx.showToast({ title: '修改昵称成功' })
        app.globalData.nickName_str = this.data.nickName_str
        wx.setStorageSync('nickName', this.data.nickName_str);
      } else {
        wx.showToast({ title: '修改昵称失败', icon: 'error' })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      headPicUrl_str: app.globalData.avatarUrl_str
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