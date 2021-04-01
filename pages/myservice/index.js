// pages/myservice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img1_arr: [],
    img2_arr: []
  },

  // 调用相机、图库弹框
  tapPic1_fun: function () {
    this.pic_fun.call(this, 1)
  },

  tapPic2_fun: function () {
    this.pic_fun.call(this, 2)
  },

  // pic
  pic_fun(type) {
    wx.showActionSheet({
      itemList: ['拍摄', '从相册选择'],
      // itemColor: '#aaa',
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.useCamera_fun('camera', type)
            break
          case 1:
            this.useCamera_fun('album', type)
            break
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },

  // 调用相机、图库
  useCamera_fun(type, index) {
    var self = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        switch (index) {
          case 1:
            self.setData({
              img1_arr: res.tempFilePaths,
              // tempFilePath可以作为img标签的src属性显示图片
            })
            break
          case 2:
            self.setData({
              img2_arr: res.tempFilePaths,
              // tempFilePath可以作为img标签的src属性显示图片
            })
            break
        }
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