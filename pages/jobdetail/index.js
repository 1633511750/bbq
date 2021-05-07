import { $http } from '../../utils/util'
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
          this.setData({
            name_str: obj.name,
            tag_arr: [],
            zanNum_int: JSON.parse(obj.dianzan).length,
            address_str: obj.address,
            phone_str: obj.phone,
            wechat_str: obj.wechat,
            qq_str: obj.qq,
            desc_str: obj.introduction
          })
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