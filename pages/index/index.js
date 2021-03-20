//Page Object
var app = getApp()
Page({
  data: {
    school_str: app.globalData.school_str,
    // 标题栏
    statusBarHeight: app.globalData.statusBarHeight,

    currentTitle_int: 0,
    commentList_arr: [],
    list_arr: [],
    // commentList_arr: [{
    //   id: 1,
    //   name: '壹只小坤',
    //   date: '01-11',
    //   time: '17:34',
    //   content: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3',
    //   desc: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   img: [
    //     'https://i02piccdn.sogoucdn.com/fdd1e2dadbd01c8a',
    //     'https://i04piccdn.sogoucdn.com/af32dcada2c5a4a9',
    //     'https://i03piccdn.sogoucdn.com/089782feb3e09175'
    //   ],
    //   chat: 3,
    //   hot: 33,
    //   zan: 3433,
    //   type: '游戏'
    // }, {
    //   id: 2,
    //   name: '壹只小坤',
    //   date: '01-11',
    //   time: '17:34',
    //   content: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3',
    //   desc: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   img: [
    //     'https://i02piccdn.sogoucdn.com/fdd1e2dadbd01c8a',
    //     'https://i04piccdn.sogoucdn.com/af32dcada2c5a4a9',
    //     'https://i03piccdn.sogoucdn.com/089782feb3e09175'
    //   ],
    //   chat: 32,
    //   hot: 33,
    //   zan: 34,
    //   type: '捞人'
    // }, {
    //   id: 3,
    //   name: '壹只小坤',
    //   date: '01-11',
    //   time: '17:34',
    //   content: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3',
    //   desc: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   img: [
    //     'https://i02piccdn.sogoucdn.com/fdd1e2dadbd01c8a',
    //     'https://i04piccdn.sogoucdn.com/af32dcada2c5a4a9',
    //     'https://i03piccdn.sogoucdn.com/089782feb3e09175'
    //   ],
    //   chat: 32,
    //   hot: 33,
    //   zan: 34,
    //   type: '找同伴'
    // }],
    showDialog_bool: false,
    topList_arr: ['全部', '表白', '找对象', '找同伴', '感情', '二手交易', '爱豆', '有偿求助', '失物招领', '吐槽', '游戏', '曝光', '问答', '靓仔日常', '捞人', '其他'],
    typeList_arr: ['表白', '找对象', '找同伴', '感情', '二手交易', '爱豆', '有偿求助', '失物招领', '吐槽', '游戏', '曝光', '问答', '靓仔日常', '捞人', '其他']
  },
  titleTap_fun(e) {
    this.setData({
      currentTitle_int: e.currentTarget.dataset.index
    })
    var arr_arr = this.data.commentList_arr.filter(item => {
      if (this.data.currentTitle_int === 0) {
        return item
      } else {
        return item.category === this.data.topList_arr[this.data.currentTitle_int]
      }
    })
    this.setData({
      list_arr: arr_arr
    })
  },
  showDialog_fun() {
    wx.hideTabBar()
    this.setData({
      showDialog_bool: true
    })
  },
  // 点击了标签
  publish_fun(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      showDialog_bool: false
    })
    wx.navigateTo({
      url: '/pages/publish/index'
    });
  },
  // 隐藏弹框
  hideDialog_fun() {
    this.setData({
      showDialog_bool: false
    })
    wx.showTabBar()
    wx.showToast({ title: '已取消', icon: 'error' })
  },
  // 触发点赞
  dotZan_fun(e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    var arr = [...this.data.commentList_arr]
    if (item.isZan === true) {
      item.isZan = false
      item.zan--
      wx.showToast({ title: '已取消点赞', icon: 'error' })
    } else {
      item.isZan = true
      item.zan++
      wx.showToast({ title: '点赞成功' })
    }
    arr[index] = item
    this.setData({
      commentList_arr: arr
    })
  },

  //options(Object)
  onLoad: function (options) {
    // wx.login({
    //   timeout: 10000,
    //   success: (result) => {
    //     wx.request({
    //       url: 'http://159.75.6.154:8080/User/register',
    //       data: {
    //         name: '..',
    //         password: '123456',
    //         school: 'XX学校',
    //         phoneNumber: 18303445659,
    //         wxCode: result.code
    //       },
    //       header: { 'content-type': 'application/json' },
    //       method: 'post',
    //       dataType: 'json',
    //       responseType: 'text',
    //       success: (res) => {
    //         console.log(res);
    //       },
    //       fail: () => { },
    //       complete: () => { }
    //     });

    //   },
    //   fail: () => { },
    //   complete: () => { }
    // });
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });

    wx.request({
      url: 'http://159.75.6.154:8080/Article/getArticleByKeywords',
      data: {
        keywords: ''
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        const { data } = result
        let articleList = data.data.articleList
        console.log(articleList[0]);
        articleList.forEach(item => {
          var temp_arr = item.createTime.split('T')[0].split('-')
          item.date_str = temp_arr[1] + '-' + temp_arr[2]

          temp_arr = item.createTime.split('T')[1].split(':')
          item.time_str = temp_arr[0] + ':' + temp_arr[1]

          item.commentListNum_int = item.commentList.length

          item.dianzanNum_int = item.dianzanUids.split(',').length
        })
        var arr_arr = articleList.filter(item => {
          if (this.data.currentTitle_int === 0) {
            return item
          } else {
            return item.category === this.data.topList_arr[this.currentTitle_int]
          }
        })
        this.setData({
          commentList_arr: articleList,
          list_arr: arr_arr
        })
      },
      fail: () => {
        wx.showToast({
          title: '获取失败',
          icon: 'error',
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  onReady: function () {
  },
  onShow: function () {
    this.setData({
      school_str: app.globalData.school_str
    })
    wx.showTabBar()
  },

  onHide: function () {
    this.setData({ showDialog_bool: false })
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
