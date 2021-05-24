import { $http } from '../../utils/util'
let app = getApp()
// pages/jobdetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    id_int: 0,

    name_str: '',
    tag_arr: [],
    zanNum_int: 0,
    address_str: '',
    phone_str: '',
    wechat_str: '',
    qq_str: '',
    desc_str: '',
    headPic_str: '',

    itemList_arr: []
    // itemList_arr: [{
    //   id: 1,
    //   headPic: '',
    //   title: '工作设计室',
    //   type: '学生店',
    //   zanUp: 34,
    //   zanDown: 18,
    //   tag: ['3年经验']
    // }]
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

  // 点赞
  zan_fun() {
    let id_int = this.data.id_int
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
            isZan_bool: true
          })
        } else {
          dianzan_arr.splice(index_int, 1)
          this.setData({
            isZan_bool: false
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
              zanNum_int: dianzan_arr.length
            })
          }
        })
      }
    })
  },

  tabClick_fun(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index
    })
  },

  tapItem_fun(e) {
    let id_int = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/logodesign/index?id=' + id_int,
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },

  // 获取店铺信息
  getShop_fun() {
    $http({
      isJson: true, url: '/businessStreet/getShops', method: 'post', data: {
        pageNum: 1, pageSize: 20, streetShop: { id: this.data.id_int, examined: 1, business: 1 }
      }
    })
      .then(res => {
        console.log(res);
        if (res.data.code === 200) {
          let obj = res.data.data.streetShops[0]
          if (!obj) {
            return
          }
          if (obj.lable) {
            obj.label_arr = obj.lable.split(/[;；]+/)
          }
          this.setData({
            name_str: obj.name,
            tag_arr: obj.label_arr,
            category_str: obj.category,
            zanNum_int: JSON.parse(obj.dianzan).length,
            address_str: obj.address,
            phone_str: obj.phone,
            wechat_str: obj.wechat,
            qq_str: obj.qq,
            desc_str: obj.introduction
          })
          if (obj.headSculpture && obj.headSculptureName) {
            this.setData({
              headPic_str: app.globalData.baseUrl + obj.headSculpture.slice(25) + '/' + obj.headSculptureName
            })
          }
          if (JSON.parse(obj.dianzan).indexOf(app.globalData.uid_int) === -1) {
            this.setData({
              isZan_bool: false
            })
          } else {
            this.setData({
              isZan_bool: true
            })
          }
        }
      })
  },

  // 获取商品信息
  getGoods_fun() {
    $http({
      isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
        pageNum: 1, pageSize: 20, streetGoods: { business: '1', examined: '1', shopId: this.data.id_int }
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        res.data.data.streetGoods.forEach(item => {
          if (item.headSculpture && item.headSculptureName) {
            item.headPic_str = app.globalData.baseUrl + item.headSculpture.slice(25) + '/' + item.headSculptureName
          }
        })
        this.setData({
          itemList_arr: res.data.data.streetGoods
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
    this.getShop_fun()
    this.getGoods_fun()
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
    if (app.globalData.call_bool) {
      app.globalData.call_bool = false
      this.setData({
        currentIndex: 1
      })
    }
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