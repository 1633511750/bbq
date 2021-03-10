// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList_arr: [{
      id: 1,
      name: '壹只小坤',
      date: '01-11',
      time: '17:34',
      content: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
      headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3',
      desc: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
      img: [
        'https://i02piccdn.sogoucdn.com/fdd1e2dadbd01c8a',
        'https://i04piccdn.sogoucdn.com/af32dcada2c5a4a9',
        'https://i03piccdn.sogoucdn.com/089782feb3e09175',
        'https://i02piccdn.sogoucdn.com/fdd1e2dadbd01c8a',
        'https://i04piccdn.sogoucdn.com/af32dcada2c5a4a9',
        'https://i03piccdn.sogoucdn.com/089782feb3e09175',
        'https://i02piccdn.sogoucdn.com/fdd1e2dadbd01c8a',
        'https://i04piccdn.sogoucdn.com/af32dcada2c5a4a9',
        'https://i03piccdn.sogoucdn.com/089782feb3e09175'
      ],
      isZan: false,
      chat: 3,
      hot: 33,
      zan: 34,
      type: '游戏'
    }],
    showDialog_bool: false,
    showPingLun_bool: false,
    keyHeight_int: 0,
    replyHeight_flo: 160
  },

  showActionDialog_fun() {
    wx.showActionSheet({
      itemList: ['举报', '转发', '删除'],
      itemColor: '#aaa',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

  },

  // 隐藏分享弹窗
  hideDialog_fun() {
    wx.setNavigationBarColor({
      frontColor: '#000000', // 必写项
      backgroundColor: '#fff', // 传递的颜色值
    })
    this.setData({
      showDialog_bool: false
    })
  },

  showDialog_fun() {
    wx.setNavigationBarColor({
      frontColor: '#000000', // 必写项
      backgroundColor: '#ddd', // 传递的颜色值
    })
    this.setData({
      showDialog_bool: true
    })
  },

  // 显示评论弹窗
  showPingLun_fun() {
    wx.setNavigationBarColor({
      frontColor: '#000000', // 必写项
      backgroundColor: '#ddd', // 传递的颜色值
    })
    this.setData({
      showPingLun_bool: true
    })
  },

  closePingLun_fun() {
    wx.setNavigationBarColor({
      frontColor: '#000000', // 必写项
      backgroundColor: '#fff', // 传递的颜色值
    })
    this.setData({
      showPingLun_bool: false
    })
  },

  // 调整大小
  keyboardheight_fun: function (e) {
    this.setData({
      keyHeight_int: e.detail.height
    })
  },

  // 放大textarea
  extend_fun() {
    this.setData({
      replyHeight_flo: this.data.replyHeight_flo === 160 ? 800 : 160
    })
  },

  useCamera_fun() {
    var self = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        self.setData({
          // tempFilePath可以作为img标签的src属性显示图片
          tempImgSrc_arr: res.tempFilePaths,
        })
      }
    })
  },

  empty_fun() { },

  // 大图预览功能
  previewImage_fun(e) {
    var urls = e.currentTarget.dataset.urls
    var cururl = e.currentTarget.dataset.cururl
    wx.previewImage({
      current: cururl, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  // 点赞
  dotZan_fun() {
    if (this.data.commentList_arr[0].isZan) {
      this.data.commentList_arr[0].zan--
      this.data.commentList_arr[0].isZan = false
      wx.showToast({ title: '已取消点赞', icon: 'error' })
    } else {
      this.data.commentList_arr[0].zan++
      this.data.commentList_arr[0].isZan = true
      wx.showToast({ title: '点赞成功' })
    }
    this.setData({
      commentList_arr: this.data.commentList_arr
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