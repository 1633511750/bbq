import { $http } from '../../utils/util'
// pages/shopsetting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModify_bool: true,
    setting_str: '设置',
    shopName_str: '',
    tag_arr: ['3年经验'],
    category_str: '',
    address_str: '',
    phone_str: '',
    wechat_str: '',
    qq_str: '',
    desc_str: '',
    id_int: 0
  },

  input_fun(e) {
    let value = e.currentTarget.dataset.value
    this.setData({
      [value]: e.detail.value
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

  // 修改店铺头像
  useCamera_fun(type) {
    var self = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        let imgPath = res.tempFilePaths[0]
        this.uploadImgHandle_fun(imgPath)
      }
    })
  },

  uploadImgHandle_fun(imgPath) {
    var Cookie = wx.getStorageSync('Cookie');
    wx.uploadFile({
      url: 'https://www.guoer.ltd/businessStreet/uploadImage',
      filePath: imgPath,
      name: 'shoopSculpture',
      header: {
        "Content-Type": "multipart/form-data", "cookie": Cookie
      },
      formData: {
        id: 18
        // id: this.data.id_int,
        // name: 'shoopSculpture'
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

  setting_fun() {
    if (this.data.setting_str === '设置') {
      this.setData({
        setting_str: '完成',
        isModify_bool: false
      })
    } else {
      $http({
        isJson: true, method: 'post', url: '/businessStreet/addOrUpdateShop', data: {
          id: this.data.id_int,
          name: this.data.shopName_str,
          category: this.data.category_str,
          address: this.data.address_str,
          phone: this.data.phone_str,
          wechat: this.data.wechat_str,
          qq: this.data.qq_str,
          introduction: this.data.desc_str
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          wx.showToast({ title: '店铺更新成功' })
          this.setData({
            setting_str: '设置',
            isModify_bool: true
          })
        } else {
          wx.showToast({ title: '店铺更新失败', icon: 'error' })
        }
      })
    }
  },

  // 获取店铺的数据
  getShopData_fun() {
    $http({
      isJson: true, method: 'post', url: '/businessStreet/getShops', data: {
        pageNum: 1, pageSize: 1, streetShop: { id: this.data.id_int }
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        if (res.data.data.streetShops.length === 0) {
          return
        }
        let temp_obj = res.data.data.streetShops[0]
        this.setData({
          shopName_str: temp_obj.name,
          category_str: temp_obj.category,
          address_str: temp_obj.address,
          phone_str: temp_obj.phone,
          wechat_str: temp_obj.wechat,
          qq_str: temp_obj.qq,
          desc_str: temp_obj.introduction
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id_int: options.id - 0
    })
    console.log(this.data.id_int);
    this.getShopData_fun()
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