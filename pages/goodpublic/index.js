let app = getApp()
import { $http } from '../../utils/util'
// pages/goodpublic/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id_int: 0,
    orgPrice_flo: '',
    nowPrice_flo: '',
    name_str: '',
    desc_str: '',
    goodId_int: 0,
    isUpdate_bool: false,
    headPic_str: '',
    showPic_arr: [],
    disabledBtn_bool: false
  },

  // 调用相机、图库弹框
  tapPic_fun: function (e) {
    let isHeadPic_bool = e.currentTarget.dataset.head
    console.log(isHeadPic_bool);
    wx.showActionSheet({
      itemList: ['拍摄', '从相册选择'],
      // itemColor: '#aaa',
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.useCamera_fun('camera', isHeadPic_bool)
            break
          case 1:
            this.useCamera_fun('album', isHeadPic_bool)
            break
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },

  // 修改店铺头像
  useCamera_fun(type, isHeadPic_bool) {
    var self = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        let imgPath = res.tempFilePaths[0]
        if (isHeadPic_bool) {
          self.setData({
            headPic_str: imgPath
          })
        } else {
          self.setData({
            showPic_arr: self.data.showPic_arr.concat(imgPath)
          })
          console.log(self.data.showPic_arr);
        }
        // this.uploadImgHandle_fun(imgPath, isHeadPic_bool)
      }
    })
  },

  uploadImgHandle_fun(imgPath, isHeadPic_bool, callback = () => { }) {
    var Cookie = wx.getStorageSync('Cookie');
    let self = this
    console.log(imgPath);
    if (isHeadPic_bool) {
      // 上传展示主图
      wx.uploadFile({
        url: 'https://www.guoer.ltd/businessStreet/uploadImage',
        filePath: imgPath,
        name: 'goodSculpture',
        // name: 'file',
        header: {
          "cookie": Cookie
        },
        formData: {
          id: self.data.goodId_int
          // id: this.data.id_int,
          // name: 'shoopSculpture'
        },
        success(res) {
          console.log(res.data);

          // $http({
          //   isJson: true, url: '/businessStreet/getGoods', method: 'post', data: {
          //     pageNum: 1, pageSize: 20, streetGoods: { id: self.data.goodId_int }
          //   }
          // })
          //   .then(res => {
          //     console.log(res);
          //     if (res.data.code === 200) {
          //       let obj = res.data.data.streetGoods[0]
          //       if (obj.headSculpture && obj.headSculptureName) {
          //         self.setData({
          //           headPic_str: app.globalData.baseUrl + obj.headSculpture.slice(25) + '/' + obj.headSculptureName
          //         })
          //       }
          //       console.log(obj);
          //     }
          //   })
          callback()
        },
        fail(err) {
          console.log(err);
        }
      })
    } else {
      // 上传商品图片
      wx.uploadFile({
        url: 'https://www.guoer.ltd/businessStreet/uploadImage',
        filePath: imgPath,
        name: 'goodIntroductionPicture',
        // name: 'file',
        header: {
          "cookie": Cookie
        },
        formData: {
          id: self.data.goodId_int
          // id: this.data.id_int,
          // name: 'shoopSculpture'
        },
        success(res) {
          console.log(res.data);
          // $http({
          //   isJson: true, url: '/businessStreet/getGoods', method: 'post', data: {
          //     pageNum: 1, pageSize: 20, streetGoods: { id: self.data.goodId_int }
          //   }
          // })
          //   .then(res => {
          //     console.log(res);
          //     if (res.data.code === 200) {
          //       let obj = res.data.data.streetGoods[0]
          //       if (obj.headSculpture && obj.headSculptureName) {
          //         self.setData({
          //           headPic_str: app.globalData.baseUrl + obj.headSculpture.slice(25) + '/' + obj.headSculptureName
          //         })
          //       }
          //       console.log(obj);
          //     }
          //   })
          callback()
        }
      })
    }
  },

  // 删除商品图片
  deleteImg_fun(e) {
    let index_int = e.currentTarget.dataset.index
    console.log(index_int);
    wx.showModal({
      title: '删除提示',
      content: '是否删除该图片？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          let arr = this.data.showPic_arr
          arr.splice(index_int, 1)
          this.setData({
            showPic_arr: arr
          })
        }
      }
    });
  },

  inputValue_fun(e) {
    let type_str = e.currentTarget.dataset.name
    if (type_str === 'orgPrice') {
      this.setData({
        orgPrice_flo: e.detail.value.slice(1)
      })
    } else if (type_str === 'nowPrice') {
      this.setData({
        nowPrice_flo: e.detail.value.slice(1)
      })
    } else if (type_str === 'name') {
      this.setData({
        name_str: e.detail.value
      })
    } else if (type_str === 'desc') {
      this.setData({
        desc_str: e.detail.value
      })
    }
  },

  getGoodInfo_fun() {
    $http({
      isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
        pageNum: 1, pageSize: 10, streetGoods: { id: this.data.goodId_int }
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        let obj = res.data.data.streetGoods[0]
        this.setData({
          orgPrice_flo: obj.costPrice + '',
          nowPrice_flo: obj.price + '',
          name_str: obj.name,
          desc_str: obj.introductionText
        })
      }
    })
  },

  // 提交商品审核
  submitGoods_fun() {
    if (this.data.disabledBtn_bool) return
    // console.log(this.data.headPic_str, this.data.showPic_arr);
    let self = this
    if (this.data.orgPrice_flo.trim() === '' || this.data.nowPrice_flo.trim() === '' || this.data.name_str.trim() === '') {
      return wx.showToast({ title: '请填写商品价格、名称', icon: 'none' })
    }
    let orgPrice_flo = this.data.orgPrice_flo - 0
    let nowPrice_flo = this.data.nowPrice_flo - 0
    if (Number.isNaN(orgPrice_flo) || Number.isNaN(nowPrice_flo)) {
      return wx.showToast({ title: '请输入合法的价格', icon: 'none' })
    }
    if (this.data.desc_str.trim() === '') {
      return wx.showToast({ title: '请输入商品描述', icon: 'none' })
    }
    if (this.data.headPic_str === '') {
      return wx.showToast({ title: '请上传展示主图', icon: 'none' })
    }
    if (this.data.showPic_arr.length === 0) {
      return wx.showToast({ title: '请上传商品封面图', icon: 'none' })
    }
    console.log(orgPrice_flo, this.data.desc_str.trim(), this.data.id_int);
    wx.showModal({
      title: '提示',
      content: '是否确认提交？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          if (this.data.isUpdate_bool) {
            $http({
              isJson: true, method: 'post', url: '/businessStreet/addOrUpdateGoods', data: {
                id: self.data.goodId_int,
                business: '1',  // 1：上架中，0：待上架
                costPrice: orgPrice_flo,
                creater: app.globalData.uid_int,
                examined: '0',  // 0：未审核，1：已审核
                introductionText: self.data.desc_str.trim(),
                name: self.data.name_str.trim(),
                price: nowPrice_flo
              }
            }).then(res => {
              console.log(res);
              if (res.data.code === 200) {
                $http({
                  isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
                    pageNum: 1, pageSize: 10, streetGoods: { shopId: self.data.id_int, business: '1', examined: '1' }
                  }
                }).then(res => {
                  console.log(res);
                  if (res.data.code === 200) {
                    if (res.data.data.streetGoods.length === 0) {
                      $http({
                        isJson: true, method: 'post', url: '/businessStreet/addOrUpdateShop', data: {
                          // address: '山西', business: 1, category: 'IT', examined: 0
                          business: 0, id: self.data.id_int
                        }
                      }).then(res => {
                        console.log(res);
                        if (res.data.code === 200) {
                          console.log('店铺为空');
                          if (self.data.headPic_str.trim() !== '') {
                            self.uploadImgHandle_fun(self.headPic_str, true, () => {
                              let arr_arr = []
                              self.data.showPic_arr.forEach(item => {
                                arr_arr.push(new Promise((resolve, reject) => {
                                  self.uploadImgHandle_fun(item, false, () => { resolve() })
                                }))
                              })
                              Promise.all(arr_arr).then(res => {
                                wx.showToast({ title: '提交审核成功' })
                                setTimeout(() => {
                                  var pages = getCurrentPages()
                                  var curPage = pages[pages.length - 1]
                                  var url = curPage.route
                                  if (url === 'pages/goodpublic/index') {
                                    wx.navigateBack({
                                      delta: 1
                                    });
                                  }
                                }, 1500);
                              })
                            })
                          }
                        }
                      })
                    } else {
                      if (self.data.headPic_str.trim() !== '') {
                        self.uploadImgHandle_fun(self.data.headPic_str, true, () => {
                          let arr_arr = []
                          self.data.showPic_arr.forEach(item => {
                            arr_arr.push(new Promise((resolve, reject) => {
                              self.uploadImgHandle_fun(item, false)
                            }))
                          })
                          Promise.all(arr_arr).then(res => {
                            wx.showToast({ title: '提交审核成功' })
                            setTimeout(() => {
                              var pages = getCurrentPages()
                              var curPage = pages[pages.length - 1]
                              var url = curPage.route
                              if (url === 'pages/goodpublic/index') {
                                wx.navigateBack({
                                  delta: 1
                                });
                              }
                            }, 1500);
                          })
                        })
                      }
                    }
                  }
                })
              } else {
                wx.showToast({ title: '提交失败', icon: 'error' })
              }
            })
          } else {
            wx.showLoading({
              title: '提交中...',
              mask: true,
            });

            $http({
              isJson: true, method: 'post', url: '/businessStreet/addOrUpdateGoods', data: {
                shopId: self.data.id_int,
                business: '0',  // 1：上架中，0：待上架
                costPrice: orgPrice_flo,
                creater: app.globalData.uid_int,
                examined: '0',  // 0：未审核，1：已审核
                introductionText: self.data.desc_str.trim(),
                name: self.data.name_str.trim(),
                price: nowPrice_flo
              }
            }).then(res => {
              console.log(res);
              if (res.data.code === 200) {
                self.setData({
                  goodId_int: res.data.data.streetGoodsId
                })

                console.log('good insert success');
                if (self.data.headPic_str.trim() !== '') {
                  self.uploadImgHandle_fun(self.data.headPic_str, true, () => {
                    console.log('headPic success');
                    let arr_arr = []
                    self.data.showPic_arr.forEach(item => {
                      arr_arr.push(new Promise((resolve, reject) => {
                        self.uploadImgHandle_fun(item, false, () => { resolve() })
                      }))
                    })
                    Promise.all(arr_arr).then(res => {
                      wx.hideLoading()
                      self.setData({ disabledBtn_bool: true })
                      wx.showToast({ title: '提交审核成功' })
                      app.globalData.good_examined_bool = true
                      setTimeout(() => {
                        var pages = getCurrentPages()
                        var curPage = pages[pages.length - 1]
                        var url = curPage.route
                        if (url === 'pages/goodpublic/index') {
                          wx.navigateBack({
                            delta: 1
                          });
                        }
                      }, 1500);
                    }).catch(err => {
                      wx.hideLoading()
                      console.log(err);
                    })
                  })
                }
              } else {
                wx.showToast({ title: '提交失败', icon: 'error' })
                // this.setData({disabledBtn_bool: true})
                wx.hideLoading();
              }
            })
          }
        }
      },
      fail: () => { },
      complete: () => { }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id_int: options.id - 0
    })
    if (options.update === '1') {
      this.setData({
        id_int: options.shopId - 0,
        goodId_int: options.goodId - 0,
        isUpdate_bool: true,
        headPic_str: options.headPic,
        showPic_arr: JSON.parse(options.showPic)
      })
      console.log(this.data.goodId_int);
      this.getGoodInfo_fun()
    }
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