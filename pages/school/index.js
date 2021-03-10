let app = getApp();
//Page Object
Page({
  data: {
    list_arr: ['山西大学商务学院', '山西交通职业技术学院', '山西药科职业技术学院', '陕西职业技术学院', '太原大学', '山西华澳职业商贸学院']
  },

  selectSchool_fun(e) {
    var school_str = e.currentTarget.dataset.item
    app.globalData.school_str = school_str
    wx.navigateBack({
      delta: 1
    });
  },

  //options(Object)
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});

