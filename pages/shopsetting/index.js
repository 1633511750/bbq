import { $http } from '../../utils/util'
let app = getApp()
// pages/shopsetting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModify_bool: true,
    setting_str: '修改',
    shopName_str: '',
    tag_str: '美食;家具',
    tag_arr: ['美食饮品文具', '家具生活办公', '美食饮品文具', '家具生活办公', '美食饮品文具', '家具生活办公'],
    category_str: '',
    address_str: '',
    phone_str: '',
    wechat_str: '',
    qq_str: '',
    desc_str: '',
    id_int: 0,
    headPic_str: '',
    isModifyHeadPic_bool: false,
    school_str: '',

    shopCategory_arr: ['IT', '设计', '美妆', '休闲', '学习'],
    shopCategoryIndex_int: 0,

    schoolIndex_int: 0,
    school_arr: [
      '全部',
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
      '山西能源学院']
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

  taginput_fun(e) {
    if (!this.data.isModify_bool) {
      let value = e.detail.value
      let index = e.currentTarget.dataset.index
      // value = value.slice(0, 6)
      console.log(index);
      console.log(value);
      let arr = [...this.data.tag_arr]
      arr[index] = value
      this.setData({
        ['tag_arr[' + index + ']']: arr
      })
    }
  },

  input_fun(e) {
    let value = e.currentTarget.dataset.value
    this.setData({
      [value]: e.detail.value
    })
  },

  // 调用相机、图库弹框
  tapPic_fun: function () {
    if (this.data.isModify_bool) {
      return
    }
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
        this.setData({
          headPic_str: imgPath,
          isModifyHeadPic_bool: true
        })
      }
    })
  },

  uploadImgHandle_fun(imgPath) {
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
        id: this.data.id_int
        // id: this.data.id_int,
        // name: 'shoopSculpture'
      },
      success(res) {
        console.log(res.data);
        $http({
          isJson: true, url: '/businessStreet/getShops', method: 'post', data: {
            pageNum: 1, pageSize: 10, streetShop: { id: self.data.id_int }
          }
        })
          .then(res => {
            console.log(res);
            if (res.data.code === 200) {
              let obj = res.data.data.streetShops[0]
              if (obj.headSculpture && obj.headSculptureName) {
                self.setData({
                  headPic_str: app.globalData.baseUrl + obj.headSculpture.slice(25) + '/' + obj.headSculptureName
                })
              }
              console.log(obj);
              wx.showToast({ title: '店铺更新成功' })
              self.setData({
                setting_str: '修改',
                isModify_bool: true
              })
            }
          })
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  setting_fun() {
    if (this.data.setting_str === '修改') {
      this.setData({
        setting_str: '完成',
        isModify_bool: false
      })
    } else {
      let tag_arr
      if (this.data.tag_str) {
        tag_arr = this.data.tag_str.split(/[;；,，、。.!！：:]+/)
      } else {
        tag_arr = []
      }
      tag_arr = tag_arr.slice(0, 6)
      tag_arr = tag_arr.filter(item => item)
      tag_arr = tag_arr.map(item => item.length > 6 ? item.slice(0, 6) : item)

      let tag_str = tag_arr.join(';')
      this.setData({
        tag_str
      })
      $http({
        isJson: true, method: 'post', url: '/businessStreet/addOrUpdateShop', data: {
          id: this.data.id_int,
          name: this.data.shopName_str,
          lable: tag_str,
          category: this.data.shopCategory_arr[this.data.shopCategoryIndex_int],
          school: this.data.school_arr[this.data.schoolIndex_int],
          address: this.data.address_str,
          phone: this.data.phone_str,
          wechat: this.data.wechat_str,
          qq: this.data.qq_str,
          introduction: this.data.desc_str
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          if (this.data.isModifyHeadPic_bool) {
            this.uploadImgHandle_fun(this.data.headPic_str)
          } else {
            wx.showToast({ title: '店铺更新成功' })
            this.setData({
              setting_str: '修改',
              isModify_bool: true
            })
          }
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
        let categroyIndex_int = this.data.shopCategory_arr.indexOf(temp_obj.category)
        let schoolIndex_int = this.data.school_arr.indexOf(temp_obj.school)
        console.log(categroyIndex_int, schoolIndex_int);

        this.setData({
          shopName_str: temp_obj.name,
          shopCategoryIndex_int: categroyIndex_int,
          schoolIndex_int,
          tag_str: temp_obj.lable,
          address_str: temp_obj.address,
          phone_str: temp_obj.phone,
          wechat_str: temp_obj.wechat,
          qq_str: temp_obj.qq,
          desc_str: temp_obj.introduction
        })
        if (temp_obj.headSculpture && temp_obj.headSculptureName) {
          this.setData({
            headPic_str: app.globalData.baseUrl + temp_obj.headSculpture.slice(25) + '/' + temp_obj.headSculptureName
          })
        }
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