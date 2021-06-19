import { $http, $getAllSchool, $getAllJobLabel } from '../../utils/util'
let app = getApp()
// pages/shopsetting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabledBtn_bool: false,
    isModify_bool: false,
    shopName_str: '',
    tag_str: '',
    tag_arr: ['123', '456', '789'],
    address_str: '',
    phone_str: '',
    wechat_str: '',
    qq_str: '',
    desc_str: '',
    headPic_str: '',

    shopCategory_arr: $getAllJobLabel(false),
    shopCategoryIndex_int: 0,

    schoolIndex_int: 0,
    school_arr: $getAllSchool(true),
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
        this.setData({
          headPic_str: res.tempFilePaths[0]
        })
      }
    })
  },

  input_fun(e) {
    let value = e.currentTarget.dataset.value
    this.setData({
      [value]: e.detail.value
    })
  },

  categoryChange_fun(e) {
    this.setData({
      shopCategoryIndex_int: e.detail.value
    })
  },

  schoolChange_fun(e) {
    this.setData({
      schoolIndex_int: e.detail.value
    })
  },

  uploadImgHandle_fun(imgPath, id) {
    var Cookie = wx.getStorageSync('Cookie');
    let self = this
    wx.uploadFile({
      url: 'https://www.guoer.ltd/businessStreet/uploadImage',
      filePath: imgPath,
      name: 'shoopSculpture',
      // name: 'file',
      header: {
        "cookie": Cookie
      },
      formData: {
        id
        // id: this.data.id_int,
        // name: 'shoopSculpture'
      },
      success(res) {
        console.log(res.data);
        wx.showToast({ title: '开店提交成功，审核中', icon: 'none' })
        wx.hideLoading();
        self.setData({ disabledBtn_bool: true })
        setTimeout(() => {
          var pages = getCurrentPages()
          var curPage = pages[pages.length - 1]
          var url = curPage.route
          if (url === 'pages/openshop/index') {
            wx.redirectTo({
              url: '/pages/goods/index?id=' + id,
            });
          }
        }, 1500);
      },
      fail(res) {
        console.log(res);
        wx.showToast({ title: '图片上传失败', icon: 'error' })
        wx.hideLoading();
        self.setData({ disabledBtn_bool: true })
      }
    })
  },

  // 开店请求
  setting_fun() {
    if (this.data.disabledBtn_bool) return
    if (this.data.headPic_str.trim() === '') {
      return wx.showToast({ title: '请上传店铺头像', icon: 'none' })
    }
    if (this.data.shopName_str.trim() === '' || this.data.tag_str.trim() === '' || this.data.address_str.trim() === '' || this.data.phone_str.trim() === '' || this.data.wechat_str.trim() === '' || this.data.qq_str.trim() === '' || this.data.desc_str.trim() === '') {
      return wx.showToast({ title: '请填写完整信息后再提交', icon: 'none' })
    }

    let tag_arr = this.data.tag_str.split(/[;；,，、。.!！:：]+/)
    tag_arr = tag_arr.slice(0, 6)
    tag_arr = tag_arr.filter(item => item)
    tag_arr = tag_arr.map(item => item.length > 6 ? item.slice(0, 6) : item)
    let tag_str = tag_arr.join(';')

    wx.showLoading({
      title: '提交中...',
      mask: true
    });

    $http({
      isJson: true, url: '/businessStreet/addOrUpdateShop', method: 'post', data: {
        address: this.data.address_str,
        business: 0,
        category: this.data.shopCategory_arr[this.data.shopCategoryIndex_int],
        creater: app.globalData.uid_int,
        examined: 0,
        introduction: this.data.desc_str,
        lable: tag_str,
        name: this.data.shopName_str,
        phone: this.data.phone_str,
        qq: this.data.qq_str,
        wechat: this.data.wechat_str,
        school: this.data.school_arr[this.data.schoolIndex_int]
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        this.uploadImgHandle_fun(this.data.headPic_str, res.data.data.streetShopId)
      } else {
        wx.showToast({ title: '开店提交失败', icon: 'error' })
        wx.hideLoading();
        this.setData({ disabledBtn_bool: true })
      }
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
      this.setData({ disabledBtn_bool: true })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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