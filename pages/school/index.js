import { $getAllSchool, $http } from '../../utils/util'
let app = getApp();
//Page Object
Page({
  data: {
    all_arr: $getAllSchool(),
    allObj_arr: [],
    school_arr: [],
    history_arr: [],
    info_str: '最近浏览',
    btnValue_str: '全部',
    newArticleNum_arr: []
  },

  selectSchool_fun(e) {
    var school_o = e.currentTarget.dataset.item
    app.globalData.school_str = school_o.school
    wx.setStorageSync('school', school_o.school);

    let history_arr = this.data.history_arr
    let index_int = history_arr.findIndex(item => item.school === school_o.school)
    if (index_int === -1) {
      if (this.data.history_arr.length >= 10) {
        history_arr.pop()
      }
      history_arr.unshift(school_o)
    } else {
      history_arr.splice(index_int, 1)
      history_arr.unshift(school_o)
    }


    wx.setStorageSync('historySchool', history_arr.map(item => item.school));

    app.globalData.backState_int = 1
    wx.navigateBack({
      delta: 1
    });
  },

  inputSchool_fun(e) {
    let school_str = e.detail
    let school_arr = this.data.allObj_arr.filter(item => {
      let reg = new RegExp(school_str)
      return reg.test(item.school)
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
        school_arr: this.data.allObj_arr
      })
    } else {
      this.setData({
        btnValue_str: '全部',
        info_str: '最近浏览',
        school_arr: this.data.history_arr
      })
    }
  },

  newArticle(callback = () => { }) {
    $http({ url: '/Article/countArticleBySchool', method: 'post' }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        let arr = res.data.data.countMap
        let temp_arr = []
        this.data.all_arr.forEach(item => {
          let o = arr.find(item1 => item1.school === item)
          if (o) {
            temp_arr.push({ school: item, nums: o.nums })
          } else {
            temp_arr.push({ school: item, nums: 0 })
          }
        })
        this.setData({ allObj_arr: temp_arr })
        console.log(this.data.allObj_arr);
        callback()
      }
    })
  },

  //options(Object)
  onLoad: function (options) {
    this.newArticle(() => {
      this.setData({
        history_arr: wx.getStorageSync('historySchool') || [],
      })
      let temp_arr = []
      this.data.history_arr.forEach(item => {
        let o = this.data.allObj_arr.find(item1 => item1.school === item)
        if (o) {
          temp_arr.push({ school: item, nums: o.nums })
        } else {
          temp_arr.push({ school: item, nums: 0 })
        }
      })
      this.setData({ history_arr: temp_arr })
      this.setData({
        school_arr: this.data.history_arr
      })
      console.log(this.data.history_arr);
    })
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

