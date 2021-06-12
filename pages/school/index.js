import { $getAllSchool } from '../../utils/util'
let app = getApp();
//Page Object
Page({
  data: {
    all_arr: $getAllSchool(),
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

