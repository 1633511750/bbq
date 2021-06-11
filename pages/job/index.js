import { $http } from '../../utils/util'
import $street_mod from '../../utils/businessStreet'
// pages/job/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school_str: '',
    currentTitle_int: 0,
    statusBarHeight: app.globalData.statusBarHeight,
    topList_arr: ['全部', 'IT', '设计', '美妆', '休闲', '学习'],
    topListIndex_int: 0,
    itemList_arr: []
  },

  // 大图预览
  previewImages_fun(e) {
    var urls = e.currentTarget.dataset.urls
    var cururl = e.currentTarget.dataset.cururl
    wx.previewImage({
      current: cururl, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },

  titleTap_fun(e) {
    var index = e.currentTarget.dataset.index
    if (index === this.data.topListIndex_int) {
      return
    }
    this.setData({
      topListIndex_int: index
    })
    this.getShops_fun()
  },

  gotoDetail_fun(e) {
    let id_int = e.currentTarget.dataset.id - 0
    wx.navigateTo({
      url: '/pages/jobdetail/index?id=' + id_int,
    });
  },

  // 获取创业街店铺
  getShops_fun() {
    let category_str = this.data.topList_arr[this.data.topListIndex_int]
    let streetShop_o = {}
    if (category_str === '全部') {
      streetShop_o = { examined: 1, business: 1, school: app.globalData.school_str }
    } else {
      streetShop_o = { examined: 1, business: 1, school: app.globalData.school_str, category: category_str }
    }


    // $http({
    //   isJson: true, url: '/businessStreet/getShops', method: 'post', data: {
    //     pageNum: 1, pageSize: 50, streetShop: streetShop_o
    //   }
    // })
    $street_mod.getShops_fun({
      shop_obj: streetShop_o, success_fun: (res) => {
        console.log(res);
        let list_arr = res
        list_arr.forEach(item => {
          if (item.dianzan) {
            item.dianzan_int = JSON.parse(item.dianzan).length
            if (JSON.parse(item.dianzan).indexOf(app.globalData.uid_int) === -1) {
              item.isZan_bool = false
            } else {
              item.isZan_bool = true
            }
          }

          if (item.lable) {
            item.label_arr = item.lable.split(/[;；]+/)
          }
          console.log(item.lable);
          if (item.headSculpture && item.headSculptureName) {
            item.headPic_str = app.globalData.baseUrl + item.headSculpture.slice(25) + '/' + item.headSculptureName
          }
        })
        this.setData({
          itemList_arr: list_arr
        })
      }
    })
    // .then(res => {

    // })
  },

  // 新增/更新店铺信息
  addOrUpdateShop() {
    $http({
      isJson: true, method: 'post', url: '/businessStreet/addOrUpdateShop', data: {
        // address: '山西', business: 1, category: 'IT', examined: 0
        examined: 0
      }
    }).then(res => {
      console.log(res);
    })
  },

  // 获取创业街店铺商品
  getGoods_fun() {
    $street_mod.getGoods_fun({
      good_obj: { business: '1', examined: '1' }, success_fun: (res) => {
        console.log(res);
      }
    })
    // $http({
    //   isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
    //     pageNum: 1, pageSize: 10, streetGoods: { business: '1', examined: '1' }
    //   }
    // }).then(res => {
    //   console.log(res);
    // })
  },

  // 点赞
  zan_fun(e) {
    let id_int = e.currentTarget.dataset.id - 0
    let index = e.currentTarget.dataset.index - 0
    $http({
      isJson: true, method: 'post', url: '/businessStreet/getShops', data: {
        pageNum: 1, pageSize: 10, streetShop: { id: id_int }
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        let dianzan_str = res.data.data.streetShops[0].dianzan
        let dianzan_arr = JSON.parse(dianzan_str)

        console.log(dianzan_arr);
        let index_int = dianzan_arr.indexOf(app.globalData.uid_int)
        if (index_int === -1) {
          dianzan_arr.push(app.globalData.uid_int)
          this.setData({
            ['itemList_arr[' + index + '].isZan_bool']: true
          })
        } else {
          dianzan_arr.splice(index_int, 1)
          this.setData({
            ['itemList_arr[' + index + '].isZan_bool']: false
          })
        }

        $http({
          isJson: true, method: 'post', url: '/businessStreet/addOrUpdateShop', data: {
            id: id_int, dianzan: JSON.stringify(dianzan_arr)
          }
        }).then(res => {
          console.log(res);
          if (res.data.code === 200) {
            this.setData({
              ['itemList_arr[' + index + '].dianzan_int']: dianzan_arr.length
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getGoods_fun()
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
    //this.addOrUpdateShop()
    this.getShops_fun()
    // this.getGoods_fun()
    this.setData({
      school_str: app.globalData.school_str
    })
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