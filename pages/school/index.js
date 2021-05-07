let app = getApp();
//Page Object
Page({
  data: {
    all_arr: [
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
      '山西能源学院'],
    school_arr: [],
    history_arr: [],
    info_str: '最近浏览',
    btnValue_str: '全部'
  },

  selectSchool_fun(e) {
    var school_str = e.currentTarget.dataset.item
    app.globalData.school_str = school_str
    wx.setStorageSync('school', school_str);

    let history_arr = this.data.history_arr
    let index_int = history_arr.indexOf(school_str)
    if (index_int === -1) {
      if (this.data.history_arr.length >= 10) {
        history_arr.pop()
      }
      history_arr.unshift(school_str)
    } else {
      history_arr.splice(index_int, 1)
      history_arr.unshift(school_str)
    }


    wx.setStorageSync('historySchool', history_arr);

    app.globalData.backState_int = 1
    wx.navigateBack({
      delta: 1
    });
  },

  inputSchool_fun(e) {
    let school_str = e.detail
    let school_arr = this.data.all_arr.filter(item => {
      let reg = new RegExp(school_str)
      return reg.test(item)
    })
    this.setData({
      school_arr,
      info_str: '搜索结果'
    })
  },

  // 全部学校
  allSchoolEvent_fun() {
    if (this.data.btnValue_str === '全部') {
      this.setData({
        btnValue_str: '最近',
        info_str: '全部学校',
        school_arr: this.data.all_arr
      })
    } else {
      this.setData({
        btnValue_str: '全部',
        info_str: '最近浏览',
        school_arr: this.data.history_arr
      })
    }
  },

  //options(Object)
  onLoad: function (options) {
    this.setData({
      history_arr: wx.getStorageSync('historySchool') || [],
    })
    this.setData({
      school_arr: this.data.history_arr
    })
    console.log(this.data.history_arr);
  },
  onReady: function () {

  },
  onShow: function () {
    this.setData({
      school_arr: this.data.list_arr
    })
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

