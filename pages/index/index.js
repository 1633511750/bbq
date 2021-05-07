//Page Object
const { $http, myTime } = require('../../utils/util')
var app = getApp()
var pageNum_int = 1
var pageTotal_int = 0
Page({
  data: {
    uid_int: app.globalData.uid_int,
    nickName_str: '',
    avatarUrl_str: '',
    school_str: app.globalData.school_str,
    // 标题栏
    statusBarHeight: app.globalData.statusBarHeight,
    windowWidth: 0,
    // 顶部消息
    topMsg_str: '正在努力刷新',
    topMsgHeight_int: 0,
    topMsgTimer_int: null,

    bottomMsg_str: '',
    bottomMsgHeight_int: 0,
    bottomMsgTimer_int: null,
    // currentTitle_int: 0,
    commentList_arr: [],
    list_arr: [],

    isAnonymous_bool: false,
    // commentList_arr1: [{
    //   id: 1,
    //   name_str: '月亮',
    //   date_str: '01-11',
    //   time_str: '17:34',
    //   content: '太理小姐姐找对象，身高175',
    //   headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3',
    //   desc: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   img: [
    //     'http://8.140.165.170/img/1.jpg',
    //     'http://8.140.165.170/img/2.jpg',
    //     'http://8.140.165.170/img/3.jpg'
    //   ],
    //   pageviews: 3,
    //   commentListNum_int: 33,
    //   dianzanNum_int: 3433,
    //   category: '对象',
    //   isLast: false
    // }, {
    //   id: 2,
    //   name_str: '夏天',
    //   date_str: '01-11',
    //   time_str: '17:34',
    //   content: '夏天来了，来了，来了',
    //   headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3',
    //   desc: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   img: [
    //     'http://8.140.165.170/img/4.jpg',
    //     'http://8.140.165.170/img/5.jpg'
    //   ],
    //   pageviews: 32,
    //   commentListNum_int: 33,
    //   dianzanNum_int: 34,
    //   category: '对象',
    //   isLast: false
    // }, {
    //   id: 3,
    //   name_str: '我认真的',
    //   date_str: '01-11',
    //   time_str: '17:34',
    //   content: '你给我买口红 我每天还你一点。',
    //   headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3',
    //   desc: '安抚哈尔涂鸦而分公司德国汉莎到付哈人员阿桑的歌',
    //   img: [
    //     'http://8.140.165.170/img/6.jpg'
    //   ],
    //   pageviews: 32,
    //   commentListNum_int: 33,
    //   dianzanNum_int: 34,
    //   category: '对象',
    //   isLast: true
    // }],
    reNewRotate_int: 0,
    scrollHeight_flo: '',
    isPullDown_bool: false,  // 是否已下拉
    showDialog_bool: false,
    topListIndex_int: 0,
    topList_arr: ['全部', '表白', '找对象', '找同伴', '感情', '二手交易', '爱豆', '有偿求助', '失物招领', '吐槽', '游戏', '曝光', '问答', '靓仔日常', '捞人', '其他'],
    typeList_arr: ['表白', '找对象', '找同伴', '感情', '二手交易', '爱豆', '有偿求助', '失物招领', '吐槽', '游戏', '曝光', '问答', '靓仔日常', '捞人', '其他']
  },

  // 点击顶部分类标签
  titleTap_fun(e) {
    if (e.currentTarget.dataset.index === this.data.topListIndex_int) {
      return
    }
    this.setData({
      // currentTitle_int: e.currentTarget.dataset.index,
      topListIndex_int: e.currentTarget.dataset.index
    })
    this.initTemp_fun(true)
  },

  // 得到评论内容
  getComments_fun() {
    $http({ url: '/getCommentsByArticleId', data: { articleId: 11 } })
      .then(res => {
        console.log(res);
      })
  },

  // 点击了加号
  showDialog_fun() {
    // wx.hideTabBar()

    var isAnonymous = true
    this.setData({
      isAnonymous_bool: isAnonymous,
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
      url: '/pages/publish/index?category=' + item + '&isNM=' + this.data.isAnonymous_bool
    });
  },

  // 隐藏弹框
  hideDialog_fun() {
    this.setData({
      showDialog_bool: false
    })
    // wx.showTabBar()
    // wx.showToast({ title: '已取消', icon: 'error' })
  },
  // 触发点赞
  dotZan_fun(e) {
    var id = e.currentTarget.dataset.id
    let index_int = this.data.list_arr.findIndex(item => item.id === id)
    if (index_int !== -1) {
      this.setData({
        ['list_arr[' + index_int + '].dianzanNum_int']: this.data.list_arr[index_int].dianzanNum_int + 1,
        ['list_arr[' + index_int + '].isZan']: true
      })
    }


    // $http({
    //   url: '/Answer/getAnswersByCommentId', data: {
    //     commentId: id
    //   }
    // }).then(res => {
    //   console.log(res);
    // })


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
    // if (app.globalData.avatarUrl_str === '') {
    //   wx.navigateTo({
    //     url: '/pages/login/index',
    //   });
    // }
    // this.categorySelect_fun()
    app.globalData.backState_int = 0
    this.setData({
      topListIndex_int: 0
    })

    this.initTemp_fun()
  },

  // 初始化数据
  initArticle_fun(callback, isAuto) {
    this.setData({
      bottomMsgHeight_int: 0,
      bottomMsg_str: ''
    })
    if (isAuto) {
      this.setData({
        topMsg_str: '',
        topMsgHeight_int: 0
      })
    } else {
      this.setData({
        topMsg_str: '正在努力刷新',
        topMsgHeight_int: 50,
      })
    }
    let category_str = this.data.topList_arr[this.data.topListIndex_int]
    if (this.data.topListIndex_int === 0) {
      category_str = 'all'
    }
    this.getArticle_fun({ category: category_str, hasLoading: false })
      .then(res => {
        console.log(res);
        pageTotal_int = res.total_int
        pageNum_int = Math.ceil(res.total_int / 5)
        this.setData({
          list_arr: []
        })
        if (pageNum_int > 0) {
          return this.getArticle_fun({ category: category_str, pageNumber: pageNum_int, hasLoading: false })
        } else {
          return -1
        }
      }).then(res => {
        if (res === -1) {
          return -1
        }

        this.setData({
          list_arr: res.articleList
        })
        if (pageNum_int > 1) {
          pageNum_int--
          return this.getArticle_fun({ category: category_str, pageNumber: pageNum_int, hasLoading: false })
        } else {
          return -2
        }
      }).then(res => {
        console.log(res);
        if (res !== -1 && res !== -2) {
          var arr_arr = this.data.list_arr
          arr_arr.push(...res.articleList)
          this.setData({ list_arr: arr_arr })
        }
        // wx.hideLoading();
        if (isAuto || res === -1) {
          this.topMsgFinish_fun()
        } else {
          this.topMsgFinish_fun('刷新成功')
          // this.topMsgFinish_fun()
        }
        callback && callback()
      }).catch(res => {
        // wx.hideLoading();
        this.topMsgFinish_fun('刷新失败')
        console.log(res);
      })
  },
  initList_fun(callback, isAuto) {
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true,
    // });
    console.log(isAuto);
    this.setData({
      bottomMsgHeight_int: 0,
      bottomMsg_str: ''
    })
    if (isAuto) {
      this.setData({
        topMsg_str: '',
        topMsgHeight_int: 0
      })
    } else {
      this.setData({
        topMsg_str: '正在努力刷新',
        topMsgHeight_int: 50,
      })
    }
    this.getAllArticle_fun({ hasLoading: false })
      .then(res => {
        pageTotal_int = res.total_int
        pageNum_int = Math.ceil(res.total_int / 5)
        if (pageNum_int > 0) {
          return this.getAllArticle_fun({ pageNumber: pageNum_int, hasLoading: false })
        } else {
          return -1
        }
      }).then(res => {
        console.log(res);
        if (res === -1) {
          return -1
        }

        this.setData({
          list_arr: res.articleList
        })
        if (pageNum_int > 1) {
          pageNum_int--
          return this.getAllArticle_fun({ pageNumber: pageNum_int, hasLoading: false })
        } else {
          return -1
        }
      }).then(res => {
        console.log(res);
        if (res !== -1) {
          var arr_arr = this.data.list_arr
          arr_arr.push(...res.articleList)
          this.setData({ list_arr: arr_arr })
        }
        // wx.hideLoading();
        if (isAuto) {
          this.topMsgFinish_fun()
        } else {
          this.topMsgFinish_fun('刷新成功')
        }
        callback && callback()
      }).catch(res => {
        // wx.hideLoading();
        this.topMsgFinish_fun('刷新失败')
        console.log(res);
      })
  },
  initCategoryList_fun(callback, isAuto) {
    this.setData({
      bottomMsgHeight_int: 0,
      bottomMsg_str: ''
    })
    if (isAuto) {
      this.setData({
        topMsg_str: '',
        topMsgHeight_int: 0
      })
    } else {
      this.setData({
        topMsg_str: '正在努力刷新',
        topMsgHeight_int: 50,
      })
    }
    this.getCategoryArticle_fun({ category: this.data.topList_arr[this.data.topListIndex_int], hasLoading: false })
      .then(res => {
        pageTotal_int = res.total_int
        pageNum_int = Math.ceil(res.total_int / 5)
        this.setData({
          list_arr: []
        })
        if (pageNum_int > 0) {
          return this.getCategoryArticle_fun({ category: this.data.topList_arr[this.data.topListIndex_int], pageNumber: pageNum_int, hasLoading: false })
        } else {
          return -1
        }
      }).then(res => {
        if (res === -1) {
          return -1
        }

        this.setData({
          list_arr: res.articleList
        })
        if (pageNum_int > 1) {
          pageNum_int--
          return this.getCategoryArticle_fun({ category: this.data.topList_arr[this.data.topListIndex_int], pageNumber: pageNum_int, hasLoading: false })
        } else {
          return -1
        }
      }).then(res => {
        console.log(res);
        if (res !== -1) {
          var arr_arr = this.data.list_arr
          arr_arr.push(...res.articleList)
          this.setData({ list_arr: arr_arr })
        }
        // wx.hideLoading();
        if (isAuto) {
          this.topMsgFinish_fun()
        } else {
          this.topMsgFinish_fun('刷新成功')
        }
        callback && callback()
      }).catch(res => {
        // wx.hideLoading();
        this.topMsgFinish_fun('刷新失败')
        console.log(res);
      })
  },
  initTemp_fun(isAuto) {
    this.initArticle_fun(
      () => {
        this.setData({
          isPullDown_bool: false
        })
        if (pageTotal_int > 0) {
          // if (successMsg) {
          //   wx.showToast({ title: successMsg })
          // }
        } else {
          // wx.showToast({ icon: 'error', title: '帖子为空' })
          this.setData({
            bottomMsg_str: '无内容'
          })
        }
      }, isAuto
    )
    // this.setData({
    //   tempTopHeight_int: this.data.tempTopHeight_int === 185 ? 186 : 185
    // })
  },
  topMsgFinish_fun(msg_str) {
    this.setData({
      bottomMsg_str: ''
    })
    console.log(msg_str);
    if (msg_str) {
      this.setData({
        topMsg_str: msg_str,
        topMsgHeight_int: 50
      })
    } else {
      this.setData({
        topMsgHeight_int: 0,
        topMsg_str: ''
      })
    }
    clearTimeout(this.data.topMsgTimer_int)
    var t_int = setTimeout(() => {
      this.setData({
        topMsg_str: '',
        topMsgHeight_int: 0
      })
    }, 1500);
    this.setData({
      topMsgTimer_int: t_int
    })
  },

  // 获取帖子列表
  getArticle_fun({ category, school = app.globalData.school_str, callback, isShowSuccess, pageNumber = 1, hasLoading = false } = {}) {
    return new Promise((resolve, reject) => {
      $http({ url: '/Article/getArticlesByCategoryAndSchool', method: 'get', data: { category, school, pageNum: pageNumber, pageSize: 5 }, complete: () => { callback && callback() } }, hasLoading)
        .then((res) => {
          console.log(pageNum_int);
          var data = res.data.data
          if (data.hasOwnProperty('total')) {
            var articleList = this.handleArticleData_fun(data)
            var total = data.total
          } else {
            var articleList = []
            var total = 0
          }
          resolve({ total_int: total, articleList })
        }).catch((err) => {
          wx.showToast({
            title: '刷新失败',
            icon: 'error',
          });
          this.setData({
            isPullDown_bool: false
          })
          console.log(err);
          reject(err)
        })
    })
  },

  // 获取全部帖子列表
  getAllArticle_fun({ callback, isShowSuccess, pageNumber = 1, hasLoading = false } = {}) {
    return new Promise((resolve, reject) => {
      $http({ url: '/Article/getArticleByKeywords', data: { keywords: '', pageNum: pageNumber, pageSize: 5 }, complete: () => { callback && callback() } }, hasLoading)
        .then((res) => {
          var data = res.data.data
          var articleList = this.handleArticleData_fun(data)
          resolve({ total_int: data.total, articleList })
        }).catch((err) => {
          wx.showToast({
            title: '刷新失败',
            icon: 'error',
          });
          this.setData({
            isPullDown_bool: false
          })
          console.log(err);
          reject(err)
        })
    })
  },

  // 初步处理获取到帖子的数据
  handleArticleData_fun(data) {
    console.log(data);
    let articleList = data.articleList && data.articleList.list.reverse() || []
    articleList.forEach(item => {
      if (item.commentList.length > 0) {
        item.commentListNum_int = item.commentList[0].commentCount
      } else {
        item.commentListNum_int = 'x'
      }

      var t_o = myTime(item.createTime)
      // item.date_str = t_o.time_str
      item.date_str = t_o.month + '-' + t_o.day
      item.time_str = t_o.hour + ':' + t_o.minute

      if (item.dianzanUids) {
        let dz_arr = item.dianzanUids.split(',')
        item.dianzanNum_int = dz_arr.length
        if (dz_arr.includes('' + app.globalData.uid_int)) {
          item.isZan = true
        } else {
          item.isZan = false
        }
      } else {
        item.dianzanNum_int = 0
      }

      if (item.isAnonymous) {
        item.name_str = '匿名'
        item.avatarUrl_str = app.globalData.anonymousAvatarUrl_str
      } else {
        item.name_str = item.userList[0] && item.userList[0].name || 'unknown'
        item.avatarUrl_str = app.globalData.avatarUrl_str
      }

      item.imgOrg = []
      item.img = []
      item.picturePath = item.picturePath || ''
      var urlId = item.picturePath.substring(25)
      item.pictureNames.forEach((item1, index) => {
        item.imgOrg.push(app.globalData.baseUrl + urlId + '/' + item1)
        if (index < 6) {
          item.img.push(app.globalData.baseUrl + urlId + '/' + item1)
        }
      })
      // if (item.img.length === 2) {
      //   item.img.push('')
      // }
    })
    if (pageNum_int === 1 && articleList.length > 0) {
      articleList[articleList.length - 1].isLast = true
    }
    return articleList
  },

  // 获取分类帖子列表
  getCategoryArticle_fun({ category, callback, isShowSuccess, pageNumber = 1, hasLoading = false } = {}) {
    return new Promise((resolve, reject) => {
      $http({ url: '/Article/getArticlesByCategory', data: { category, pageNum: pageNumber, pageSize: 5 }, complete: () => { callback && callback() } }, hasLoading)
        .then((res) => {
          var data = res.data.data
          if (data.hasOwnProperty('total')) {
            var articleList = this.handleArticleData_fun(data)
            var total = data.total
          } else {
            var articleList = []
            var total = 0
          }
          resolve({ total_int: total, articleList })
        }).catch((err) => {
          wx.showToast({
            title: '刷新失败',
            icon: 'error',
          });
          this.setData({
            isPullDown_bool: false
          })
          console.log(err);
          reject(err)
        })
    })
  },

  // 匿名切换
  anonymou_fun() {
    var isAnonymous = this.data.isAnonymous_bool
    isAnonymous = !isAnonymous
    // wx.setStorageSync('isAnonymous', isAnonymous)

    this.setData({
      isAnonymous_bool: isAnonymous,
      reNewRotate_int: this.data.reNewRotate_int + 360,
      nickName_str: isAnonymous ? '匿名' : app.globalData.nickName_str,
      avatarUrl_str: isAnonymous ? app.globalData.anonymousAvatarUrl_str : app.globalData.avatarUrl_str
    })
  },

  // 关闭底部发帖弹框
  cancelDialog_fun() {
    this.setData({
      showDialog_bool: false
    })
  },

  // 计算scroll-view的高度
  scrollHeight_fun() {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      windowWidth,
      scrollHeight_flo: (windowHeight - this.data.statusBarHeight) / windowWidth * 750 - 180
      // scrollHeight_flo: (windowHeight - this.data.statusBarHeight) / windowWidth * 750 - 140
      // scrollHeight_flo: 1016
    })
    console.log(this.data.scrollHeight_flo);
  },

  // 下拉刷新
  pullDownRefresh_fun() {
    this.initTemp_fun()
    // this.initTemp_fun('刷新成功')
  },

  // 上拉加载
  upPullLoadList_fun() {
    if (pageNum_int <= 1) {
      // wx.showToast({
      //   title: '全部加载完成',
      // })
      this.setData({
        bottomMsg_str: '全部加载完成',
        bottomMsgHeight_int: 50
      })
      return
    }
    this.setData({
      bottomMsg_str: '正在努力加载',
      bottomMsgHeight_int: 50
    })
    pageNum_int--
    let category_str = this.data.topListIndex_int === 0 ? 'all' : this.data.topList_arr[this.data.topListIndex_int]

    this.getArticle_fun({
      callback: () => {
        this.setData({
          isPullDown_bool: false
        })
      }, pageNumber: pageNum_int, category: category_str
    }).then(res => {
      var arr_arr = this.data.list_arr

      arr_arr.push(...res.articleList)
      this.setData({
        list_arr: arr_arr
      })

      this.bottomMsgFinish_fun()
    }).catch(err => {
      console.log(err);
      this.bottomMsgFinish_fun()
      // this.bottomMsgFinish_fun('加载失败，请重试')
    })
  },

  bottomMsgFinish_fun(msg_str) {
    this.setData({
      bottomMsg_str: msg_str,
      bottomMsgHeight_int: 50
    })
    // clearTimeout(this.data.bottomMsgTimer_int)
    // var t_int = setTimeout(() => {
    //   this.setData({
    //     bottomMsg_str: '',
    //   })
    //   if (msg_str === '') {
    //     this.setData({
    //       bottomMsgHeight_int: 0
    //     })
    //   }
    //   if (pageNum_int <= 1) {
    //     // wx.showToast({
    //     //   title: '全部加载完成',
    //     // })
    //     this.setData({
    //       bottomMsg_str: '全部加载完成',
    //       bottomMsgHeight_int: 50
    //     })
    //   }
    // }, 1500);
    // this.setData({
    //   bottomMsgTimer_int: t_int
    // })
  },

  onReady: function () {
    this.scrollHeight_fun()
  },
  onShow: function () {
    // console.log(app.globalData.backState_int);
    if (app.globalData.backState_int === 1) {
      app.globalData.backState_int = 0
      this.setData({
        topListIndex_int: 0
      })

      this.initTemp_fun()
    }

    if (app.globalData.zanId_int !== -1) {
      console.log(app.globalData.zanId_int);
      let index_int = this.data.list_arr.findIndex(item => item.id === app.globalData.zanId_int)
      if (index_int !== -1) {
        this.setData({
          ['list_arr[' + index_int + '].dianzanNum_int']: this.data.list_arr[index_int].dianzanNum_int + 1,
          ['list_arr[' + index_int + '].isZan']: true
        })
      }
      app.globalData.zanId_int = -1
    }

    if (app.globalData.pageviewId_int !== -1) {
      let index_int = this.data.list_arr.findIndex(item => item.id === app.globalData.pageviewId_int)
      if (index_int !== -1) {
        this.setData({
          ['list_arr[' + index_int + '].pageviews']: this.data.list_arr[index_int].pageviews + 1,
        })
      }
      app.globalData.pageviewId_int = -1
    }

    if (app.globalData.commentId_int !== -1) {
      let index_int = this.data.list_arr.findIndex(item => item.id === app.globalData.commentId_int)
      if (index_int !== -1) {
        this.setData({
          ['list_arr[' + index_int + '].commentListNum_int']: app.globalData.commentNum_int
        })
      }
      console.log(app.globalData.commentId_int, app.globalData.commentNum_int);
      app.globalData.commentId_int = -1
      app.globalData.commentNum_int = -1
    }

    this.setData({
      school_str: app.globalData.school_str
    })

    // if (this.data.list_arr.length === 0) {
    //   this.setData({
    //     topListIndex_int: 0
    //   })
    //   this.initTemp_fun()
    // }
    // wx.showTabBar()
    // pageNum_int = 1
    // this.getCategoryArticle_fun({ category: '表白', pageNumber: 2 })
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
