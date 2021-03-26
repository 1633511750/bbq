//Page Object
const { $http, aaa } = require('../../utils/util')
var app = getApp()
Page({
  data: {

    aaa,
    nickName_str: '',
    avatarUrl_str: '',
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
    scrollHeight_flo: '',
    isPullDown_bool: false,  // 是否已下拉
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

  // 点击了加号
  showDialog_fun() {
    wx.hideTabBar()

    var isAnonymous = wx.getStorageSync('isAnonymous') || false
    this.setData({
      showDialog_bool: true,
      nickName_str: isAnonymous ? '匿名' : app.globalData.nickName_str,
      avatarUrl_str: isAnonymous ? app.globalData.anonymousAvatarUrl_str : app.globalData.avatarUrl_str
    })
  },
  // 点击了标签
  publish_fun(e) {
    const { item } = e.currentTarget.dataset
    this.setData({
      showDialog_bool: false
    })
    wx.navigateTo({
      url: '/pages/publish/index?category=' + item
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
    var id = e.currentTarget.dataset.id
    // $http({
    //   url: '/Article/updateDianzanToArtic', method: 'post', data: {
    //     articId: id
    //   }
    // }).then(res => {
    //   console.log(res);
    // })
    // $http({
    //   hasLimit: true, url: '/Article/getDianzanCountByArticId', method: 'get', data: {
    //     articleId: id
    //   }
    // })
    //   .then(res => {
    //     console.log(res);
    //   })

    $http({
      url: '/Answer/getAnswersByCommentId', data: {
        commentId: id
      }
    }).then(res => {
      console.log(res);
    })


    // var item = e.currentTarget.dataset.item
    // var index = e.currentTarget.dataset.index
    // var arr = [...this.data.commentList_arr]
    // if (item.isZan === true) {
    //   item.isZan = false
    //   item.zan--
    //   wx.showToast({ title: '已取消点赞', icon: 'error' })
    // } else {
    //   item.isZan = true
    //   item.zan++
    //   wx.showToast({ title: '点赞成功' })
    // }
    // arr[index] = item
    // this.setData({
    //   commentList_arr: arr
    // })
  },

  //options(Object)
  onLoad: function (options) {
  },

  getAllArticle_fun({ callback, isShowSuccess } = {}) {
    // this.setData({
    //   list_arr: this.data.commentList_arr
    // })
    // callback && callback()
    // return
    $http({ url: '/Article/getArticleByKeywords', data: { keywords: '' }, complete: () => { callback && callback() } }, true)
      .then((res) => {
        const { data } = res
        console.log(res);
        let articleList = data.data.articleList.reverse()
        console.log(articleList);
        articleList.forEach(item => {
          var temp_arr = item.createTime.split('T')[0].split('-')
          item.date_str = temp_arr[1] + '-' + temp_arr[2]

          temp_arr = item.createTime.split('T')[1].split(':')
          item.time_str = temp_arr[0] + ':' + temp_arr[1]

          item.commentListNum_int = item.commentList.length

          if (item.dianzanUids) {
            item.dianzanNum_int = item.dianzanUids.split(',').length
          } else {
            item.dianzanNum_int = 0
          }
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
        if (isShowSuccess) {
          wx.showToast({
            title: '刷新成功',
            icon: 'success',
          });
        }
      }).catch((err) => {
        console.log(err);
        wx.showToast({
          title: '刷新失败',
          icon: 'error',
        });
      })
  },

  // 匿名切换
  anonymou_fun() {
    var isAnonymous = wx.getStorageSync('isAnonymous') || false
    isAnonymous = !isAnonymous
    wx.setStorageSync('isAnonymous', isAnonymous)

    this.setData({
      nickName_str: isAnonymous ? '匿名' : app.globalData.nickName_str,
      avatarUrl_str: isAnonymous ? app.globalData.anonymousAvatarUrl_str : app.globalData.avatarUrl_str
    })
  },

  // 计算scroll-view的高度
  scrollHeight_fun() {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      scrollHeight_flo: (windowHeight - this.data.statusBarHeight) * 750 / windowWidth - 194
      // scrollHeight_flo: 1000
    })
    console.log(this.data.scrollHeight_flo);
  },

  // 下拉刷新
  pullDownRefresh_fun() {
    this.getAllArticle_fun({
      callback: () => {
        this.setData({
          isPullDown_bool: false
        })
        wx.showToast({ title: '刷新成功' })
      }
    })
  },

  onReady: function () {
    this.scrollHeight_fun()
  },
  onShow: function () {
    this.getAllArticle_fun()
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
    // this.getAllArticle_fun({
    //   callback: () => {
    //     wx.stopPullDownRefresh()
    //   }, isShowSuccess: true
    // })
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
