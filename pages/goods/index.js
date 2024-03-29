let app = getApp()
import { $http } from '../../utils/util'
import $street from '../../utils/businessStreet'
// pages/goods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id_int: 0,  // 店铺id
    goods_arr: [],
    goodsStateIndex_int: 0,
    goodsStateIndex1_int: 0,
    number_arr: [0, 0, 0]
  },

  goodsStateIndex_fun(e) {
    let index_int = e.currentTarget.dataset.index - 0
    if (index_int === this.data.goodsStateIndex1_int) {
      return
    }
    this.setData({ goods_arr: [] })
    this.setData({
      goodsStateIndex_int: index_int,
      goodsStateIndex1_int: index_int
    })
    this.getGoods_fun(this.data.id_int)
  },

  // 获取商品
  getGoods_fun(shopId, callback = () => { }, isRender = true) {
    if (this.data.goodsStateIndex_int === 0) {
      $http({
        isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
          pageNum: 1, pageSize: 10, streetGoods: { shopId, creater: app.globalData.uid_int, examined: '1', business: '1' }
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          res.data.data.streetGoods.forEach(item => {
            if (item.headSculpture && item.headSculptureName) {
              item.headPic_str = app.globalData.baseUrl + item.headSculpture.slice(25) + '/' + item.headSculptureName
            }
            if (item.introductionPicture) {
              item.showPic_arr = []
              item.introductionPictureNames.forEach(item1 => {
                item.showPic_arr.push(app.globalData.baseUrl + item.introductionPicture.slice(25) + '/' + item1)
              })
              item.showPic_str = JSON.stringify(item.showPic_arr)
            }
          })
          let number_arr = this.data.number_arr
          let len = res.data.data.streetGoods.length
          number_arr.splice(this.data.goodsStateIndex_int, 1, len)
          this.setData({
            number_arr
          })
          if (isRender) {
            this.setData({
              goods_arr: res.data.data.streetGoods,
            })
          }
          callback()
        } else {
          wx.showToast({ title: '获取商品失败', icon: 'error' })
        }
      }).catch(err => {
        console.log(err);
      })
    } else if (this.data.goodsStateIndex_int === 1) {
      $http({
        isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
          pageNum: 1, pageSize: 10, streetGoods: { shopId, creater: app.globalData.uid_int, business: '0', examined: '1' }
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          res.data.data.streetGoods.forEach(item => {
            if (item.headSculpture && item.headSculptureName) {
              item.headPic_str = app.globalData.baseUrl + item.headSculpture.slice(25) + '/' + item.headSculptureName
            }
            if (item.introductionPicture) {
              item.showPic_arr = []
              item.introductionPictureNames.forEach(item1 => {
                item.showPic_arr.push(app.globalData.baseUrl + item.introductionPicture.slice(25) + '/' + item1)
              })
              item.showPic_str = JSON.stringify(item.showPic_arr)
            }
          })
          let number_arr = this.data.number_arr
          let len = res.data.data.streetGoods.length
          number_arr.splice(this.data.goodsStateIndex_int, 1, len)
          this.setData({
            number_arr
          })
          if (isRender) {
            this.setData({
              goods_arr: res.data.data.streetGoods,
            })
          }
          callback()
        } else {
          wx.showToast({ title: '获取商品失败', icon: 'error' })
        }
      }).catch(err => {
        console.log(err);
      })
    } else if (this.data.goodsStateIndex_int === 2) {
      console.log(shopId, app.globalData.uid_int);
      $http({
        isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
          pageNum: 1, pageSize: 10, streetGoods: { shopId, creater: app.globalData.uid_int, examined: '0' }
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          res.data.data.streetGoods.forEach(item => {
            if (item.headSculpture && item.headSculptureName) {
              item.headPic_str = app.globalData.baseUrl + item.headSculpture.slice(25) + '/' + item.headSculptureName
            }
            if (item.introductionPicture) {
              item.showPic_arr = []
              item.introductionPictureNames.forEach(item1 => {
                item.showPic_arr.push(app.globalData.baseUrl + item.introductionPicture.slice(25) + '/' + item1)
              })
              item.showPic_str = JSON.stringify(item.showPic_arr)
            }
          })
          let number_arr = this.data.number_arr
          let len = res.data.data.streetGoods.length
          number_arr.splice(this.data.goodsStateIndex_int, 1, len)
          this.setData({
            number_arr
          })
          if (isRender) {
            this.setData({
              goods_arr: res.data.data.streetGoods,
            })
          }
          callback()
        } else {
          wx.showToast({ title: '获取商品失败', icon: 'error' })
        }
      }).catch(err => {
        console.log(err);
      })
    }
  },

  // 下架商品
  ofShelf_fun(e) {
    let id_int = e.currentTarget.dataset.id
    $http({
      isJson: true, method: 'post', url: '/businessStreet/addOrUpdateGoods', data: {
        id: id_int, business: 0
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        $http({
          isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
            pageNum: 1, pageSize: 10, streetGoods: { shopId: this.data.id_int, business: '1', examined: '1' }
          }
        }).then(res => {
          console.log(res);
          if (res.data.code === 200) {
            if (res.data.data.streetGoods.length === 0) {
              $http({
                isJson: true, method: 'post', url: '/businessStreet/addOrUpdateShop', data: {
                  // address: '山西', business: 1, category: 'IT', examined: 0
                  business: 0, id: this.data.id_int
                }
              }).then(res => {
                console.log(res);
                if (res.data.code === 200) {
                  console.log('店铺为空');
                  wx.showToast({ title: '下架成功' })
                  this.getGoods_fun(this.data.id_int)
                }
              })
            } else {
              wx.showToast({ title: '下架成功' })
              this.getGoods_fun(this.data.id_int)
            }
          }
        })
        let number_arr = this.data.number_arr
        number_arr.splice(1, 1, number_arr[1] + 1)
        this.setData({
          number_arr
        })
      } else {
        wx.showToast({ title: '下架失败', icon: error })
      }
    })
  },

  // 上架商品
  onShelf_fun(e) {
    let id_int = e.currentTarget.dataset.id
    $http({
      isJson: true, method: 'post', url: '/businessStreet/addOrUpdateGoods', data: {
        id: id_int, business: 1
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        $http({
          isJson: true, method: 'post', url: '/businessStreet/addOrUpdateShop', data: {
            // address: '山西', business: 1, category: 'IT', examined: 0
            business: 1, id: this.data.id_int
          }
        }).then(res => {
          console.log(res);
          if (res.data.code === 200) {
            wx.showToast({ title: '上架成功' })
            this.getGoods_fun(this.data.id_int)
            let number_arr = this.data.number_arr
            number_arr.splice(0, 1, number_arr[0] + 1)
            this.setData({
              number_arr
            })
          }
        })
        this.getGoods_fun(this.data.id_int)
      } else {
        wx.showToast({ title: '上架失败', icon: error })
      }
    })
  },

  // 删除商品
  deleteGood_fun(e) {
    wx.showModal({
      title: '是否永久删除该商品？',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          let id_int = e.currentTarget.dataset.id
          $street.deleteGood1_fun(id_int, () => {
            wx.showToast({ title: '删除成功' })
            this.getGoods_fun(this.data.id_int)
          })
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

    this.setData({
      goodsStateIndex_int: 0
    })
    this.getGoods_fun(this.data.id_int, () => {
      this.setData({
        goodsStateIndex_int: 1
      })
      this.getGoods_fun(this.data.id_int, () => {
        this.setData({
          goodsStateIndex_int: 2
        })
        this.getGoods_fun(this.data.id_int, () => {
          this.setData({
            goodsStateIndex_int: 0
          })
        }, false)
      }, false)
    }, false)
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
    if (app.globalData.good_examined_bool) {
      app.globalData.good_examined_bool = false
      this.setData({
        goodsStateIndex_int: 2,
        goodsStateIndex1_int: 2,
      })
    }
    this.getGoods_fun(this.data.id_int)
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