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
    wx.request({
      url: 'http://159.75.6.154:8080/User/selectedSchool',
      data: {
        school: ''
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result);
      },
      fail: () => { },
      complete: () => { }
    });

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

