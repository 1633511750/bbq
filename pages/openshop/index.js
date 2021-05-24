import { $http } from '../../utils/util'
let app = getApp()
// pages/shopsetting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

    shopCategory_arr: ['IT', '设计', '美妆', '休闲', '学习'],
    shopCategoryIndex_int: 0,

    schoolIndex_int: 0,
    school_arr: [
      '山西大学',
      '太原科技大学',
      '中北大学',
      '太原理工大学',
      '山西农业大学',
      '山西医科大学',
      '长治医学院',
      '山西师范大学',
      '太原师范学院',
      '山西大同大学',
      '晋中学院',
      '长治学院',
      '运城学院',
      '忻州师范学院',
      '山西财经大学',
      '山西中医药大学',
      '吕梁学院',
      '太原学院',
      '山西警察学院',
      '山西应用科技学院',
      '山西大学商务学院',
      '太原理工大学现代科技学院',
      '山西师范大学现代文理学院',
      '山西农业大学信息学院',
      '中北大学信息商务学院',
      '太原科技大学华科学院',
      '山西医科大学晋祠学院',
      '山西财经大学华商学院',
      '山西工商学院',
      '太原工业大学',
      '运城职业技术大学',
      '山西传媒学院',
      '山西工程技术学院',
      '山西能源学院'],
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
        setTimeout(() => {
          var pages = getCurrentPages()
          var curPage = pages[pages.length - 1]
          var url = curPage.route
          if (url === 'pages/openshop/index') {
            wx.navigateTo({
              url: '/pages/shop/index',
            });
          }
        }, 1500);
      },
      fail(res) {
        console.log(res);
        wx.showToast({ title: '图片上传失败', icon: 'error' })
      }
    })
  },

  // 开店请求
  setting_fun() {
    if (this.data.headPic_str.trim() === '') {
      return wx.showToast({ title: '请上传店铺头像', icon: 'none' })
    }
    if (this.data.shopName_str.trim() === '' || this.data.tag_str.trim() === '' || this.data.address_str.trim() === '' || this.data.phone_str.trim() === '' || this.data.wechat_str.trim() === '' || this.data.qq_str.trim() === '' || this.data.desc_str.trim() === '') {
      return wx.showToast({ title: '请填写完整信息后再提交', icon: 'none' })
    }

    let tag_arr = this.data.tag_str.split(/[;；]+/)
    tag_arr = tag_arr.filter(item => item.length > 6 ? item.slice(0, 6) : item)
    let tag_str = tag_arr.join(';')

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
      }
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