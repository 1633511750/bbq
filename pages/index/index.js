//Page Object
const { $http, isLogin = true, myTime } = require('../../utils/util')
var app = getApp()
var pageNum_int = 1
var pageTotal_int = 0
Page({
  data: {
    nums: 0,  // 所有学校新增帖数
    uid_int: app.globalData.uid_int,
    nickName_str: '',
    avatarUrl_str: '',
    school_str: app.globalData.school_str,
    // 标题栏
    statusBarHeight: 20,
    // statusBarHeight: app.globalData.statusBarHeight,
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

    wxExtension: '',

    reNewRotate_int: 0,
    scrollHeight_flo: '',
    isPullDown_bool: false,  // 是否已下拉
    showDialog_bool: false,
    topListIndex_int: 0,
    topList_arr: ['全部', '表白', '找对象', '感情', '找同伴', '捞人', '游戏', '日常', '爱豆', '有偿求助', '失物招领', '二手交易', '吐槽', '曝光', '问答', '其他'],
    typeList_arr: ['表白', '找对象', '感情', '找同伴', '捞人', '游戏', '日常', '爱豆', '有偿求助', '失物招领', '二手交易', '吐槽', '曝光', '问答', '其他'],
    tagBg_arr: ['#C962E3', '#C962E3', '#C962E3', '#C962E3', '#C962E3', '#00B4FF', '#00B4FF', '#00B4FF', '#FFCD1D', '#FFCD1D', '#FFCD1D', '#FF3434', '#FF3434', '#3DC795', '#3DC795'],
    addSignBg_arr: ['#']
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
    wx.navigateTo({
      url: '/pages/selectpublic/index'
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
    let dz_arr = e.detail.dz_arr
    console.log(dz_arr);

    let index_int = this.data.list_arr.findIndex(item => item.id === id)
    if (index_int !== -1) {
      let index = dz_arr.indexOf(app.globalData.uid_int + '')
      console.log(this);
      if (index !== -1) {
        this.setData({
          ['list_arr[' + index_int + '].dianzanNum_int']: dz_arr.length,
          ['list_arr[' + index_int + '].isZan']: true,
          ['list_arr[' + index_int + '].dianzan_str']: dz_arr.join(','),
          ['list_arr[' + index_int + '].dianzanUids']: dz_arr.join(',')
        })
      } else {
        this.setData({
          ['list_arr[' + index_int + '].dianzanNum_int']: dz_arr.length,
          ['list_arr[' + index_int + '].isZan']: false,
          ['list_arr[' + index_int + '].dianzan_str']: dz_arr.join(','),
          ['list_arr[' + index_int + '].dianzanUids']: dz_arr.join(',')
        })
      }
      console.log(this.data.list_arr[index_int]);
    }
  },

  //options(Object)
  onLoad: function (options) {
    // if (app.globalData.avatarUrl_str === '') {
    //   wx.navigateTo({
    //     url: '/pages/login/index',
    //   });
    // }
    // this.categorySelect_fun()
    this.scrollHeight_fun()
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
      bottomMsg_str: '',
      list_arr: []
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
    temp_fun(this)
    function temp_fun(self) {
      let category_str = self.data.topList_arr[self.data.topListIndex_int]
      if (self.data.topListIndex_int === 0) {
        category_str = 'all'
      }
      self.getArticle_fun({ category: category_str, hasLoading: false }, true)
        .then(res => {
          console.log(res);
          pageTotal_int = res.total_int
          pageNum_int = Math.ceil(res.total_int / 5)

          if (self.data.topListIndex_int !== 0) {
            res.articleList = res.articleList.filter(item => item.category === self.data.topList_arr[self.data.topListIndex_int])
          }
          self.setData({
            list_arr: res.articleList
          })

          if (pageNum_int > 0) {
            return self.getArticle_fun({ category: category_str, pageNumber: pageNum_int, hasLoading: false })
          } else {
            return -1
          }
        }).then(res => {
          console.log(res);
          if (res === -1) {
            return -1
          }
          console.log(res);
          res.articleList = res.articleList.filter(item => item.isTop !== 2)
          self.setData({
            list_arr: self.data.list_arr.concat(res.articleList)
          })
          if (pageNum_int > 1) {
            pageNum_int--
            return self.getArticle_fun({ category: category_str, pageNumber: pageNum_int, hasLoading: false })
          } else {
            return -2
          }
        }).then(res => {
          console.log(res);
          if (res !== -1 && res !== -2) {
            res.articleList = res.articleList && res.articleList.filter(item => item.isTop !== 2)
            if (res !== -1 && res !== -2) {
              var arr_arr = self.data.list_arr
              arr_arr.push(...res.articleList)
              self.setData({ list_arr: arr_arr })
            }
          }
          // wx.hideLoading();
          if (isAuto || res === -1) {
            self.topMsgFinish_fun()
          } else {
            self.topMsgFinish_fun('刷新成功')
            // self.topMsgFinish_fun()
          }
          callback && callback()
        }).catch(res => {
          // wx.hideLoading();
          self.topMsgFinish_fun('刷新失败')
          console.log(res);
        })
    }
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
          if (this.data.topListIndex_int === 0) {
            this.setData({
              bottomMsg_str: ''
            })
          } else {
            this.setData({
              bottomMsg_str: '无内容'
            })
          }
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
  getArticle_fun({ category, school = app.globalData.school_str, callback, isShowSuccess, pageNumber = 1, hasLoading = false } = {}, isGetTopArticles = false) {
    return new Promise((resolve, reject) => {
      $http({ url: '/Article/getArticlesByCategoryAndSchool', method: 'get', data: { category, school, pageNum: pageNumber, pageSize: 5 }, complete: () => { callback && callback() } }, hasLoading)
        .then((res) => {
          console.log(res);
          var data = res.data.data
          console.log(data.wxExtension);
          this.setData({
            wxExtension: data.wxExtension
          })
          if (isGetTopArticles) {
            var articleList = this.handleArticleData_fun(data, true)
          } else {
            var articleList = this.handleArticleData_fun(data, false)
          }
          if (data.hasOwnProperty('total')) {
            var total = data.total
          } else {
            if (!isGetTopArticles) {
              var articleList = []
            }
            var total = 0
          }
          resolve({ total_int: total, articleList })
        }).catch((err) => {
          // wx.showToast({
          //   title: '刷新失败',
          //   icon: 'error',
          // });
          this.setData({
            isPullDown_bool: false
          })
          console.log(err);
          reject(err)
        })
    })
  },

  // 初步处理获取到帖子的数据
  handleArticleData_fun(data, isGetTopArticles = false, wxExtension) {
    // if (isTop_bool) {
    //   var articleList = data.topArticles && data.topArticles.reverse() || []
    // } else {
    // }
    if (isGetTopArticles) {
      if (data.topArticles) {
        var articleList = data.topArticles.reverse() || []
      } else {
        var articleList = []
      }
      console.log(articleList);
    } else {
      if (data.articleList) {
        var articleList = data.articleList.list.reverse() || []

      } else {
        var articleList = data.articleList.list.reverse() || []

      }
      articleList = articleList.filter(item => item.isTop !== 2)
    }
    articleList.forEach(item => {
      if (item.commentList.length > 0) {
        item.commentListNum_int = item.commentList[0].commentCount
      } else {
        item.commentListNum_int = 'x'
      }

      if (isGetTopArticles) {
        item.isTop_bool = true
      } else {
        item.isTop_bool = false
      }

      item.wxExtension = this.data.wxExtension

      item.idd = item.id + item.isTop_bool
      item.sex_str = item.userList[0] && item.userList[0].sex // 0、未知，1、男，2、女

      var t_o = myTime(item.createTime)
      item.date_str = t_o.time
      // item.date_str = t_o.time_str
      // item.date_str = t_o.month + '-' + t_o.day
      // item.time_str = t_o.hour + ':' + t_o.minute
      let index_int = this.data.typeList_arr.indexOf(item.category)
      item.tagBg_str = this.data.tagBg_arr[index_int]

      if (item.dianzanUids) {
        let dz_arr = item.dianzanUids.split(',')
        dz_arr = dz_arr.filter(item => item !== '')
        item.dianzan_str = dz_arr.join(',')
        item.dianzanNum_int = dz_arr.length
        if (dz_arr.includes('' + app.globalData.uid_int)) {
          item.isZan = true
        } else {
          item.isZan = false
        }
      } else {
        item.dianzanNum_int = 0
        item.dianzan_str = ''
      }

      if (item.isAnonymous) {
        item.name_str = '官方表白墙'
        item.avatarUrl_str = app.globalData.anonymousAvatarUrl_str
      } else {
        item.name_str = item.userList[0] && item.userList[0].name || 'unknown'
        if (item.userList[0] && item.userList[0].userHeadpoait && item.userList[0].pictureName) {
          item.avatarUrl_str = item.userList[0] && item.userList[0].userHeadpoait && (app.globalData.baseUrl + item.userList[0].userHeadpoait.slice(25) + '/' + item.userList[0].pictureName)
        } else {
          item.avatarUrl_str = null
        }
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
    if (!isGetTopArticles && pageNum_int === 1 && articleList.length > 0) {
      // articleList[articleList.length - 1].isLast = true
    }
    return articleList
  },

  // 用户切换
  anonymou_fun() {
    var isAnonymous = this.data.isAnonymous_bool
    isAnonymous = !isAnonymous
    // wx.setStorageSync('isAnonymous', isAnonymous)

    this.setData({
      isAnonymous_bool: isAnonymous,
      reNewRotate_int: this.data.reNewRotate_int + 360,
      nickName_str: isAnonymous ? '用户' : app.globalData.nickName_str,
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
    const { windowHeight, windowWidth, statusBarHeight } = wx.getSystemInfoSync() // 屏幕的高度
    this.setData({
      statusBarHeight,
      windowWidth,
      // scrollHeight_flo: (windowHeight - 20) / windowWidth * 750 - 195
      scrollHeight_flo: (windowHeight - statusBarHeight) / windowWidth * 750 - 193
      // scrollHeight_flo: (windowHeight - this.data.statusBarHeight) / windowWidth * 750 - 140
      // scrollHeight_flo: 1016
    })
    console.log(windowHeight, windowWidth, statusBarHeight);
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
      res.articleList = res.articleList.filter(item => item.isTop !== 2)
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

  pageview_fun(e) {
    var id = e.detail.pageviewId_int
    let pageviewNum_int = e.detail.pageviewNum_int
    console.log(id, pageviewNum_int);
    let index_int = this.data.list_arr.findIndex(item => item.id === id)
    if (index_int !== -1) {
      this.setData({
        ['list_arr[' + index_int + '].pageviews']: pageviewNum_int
      })
      console.log();
    } else {
      console.log('浏览量设置失败');
    }
  },

  onReady: function () {
  },
  onShow: function () {
    $http({ url: '/Article/countArticleBySchool', method: 'post' }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        let nums = 0
        res.data.data.countMap.forEach(item => nums += item.nums)
        this.setData({
          nums
        })
      }
    })

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
          // ['list_arr[' + index_int + '].dianzanNum_int']: this.data.list_arr[index_int].dianzanNum_int + 1,
          ['list_arr[' + index_int + '].dianzanNum_int']: app.globalData.zanNum_int,
          ['list_arr[' + index_int + '].isZan']: app.globalData.isZan_bool
        })
      }
      app.globalData.zanId_int = -1
    }

    if (app.globalData.pageviewId_int !== -1) {
      let index_int = this.data.list_arr.findIndex(item => item.id === app.globalData.pageviewId_int)
      if (index_int !== -1) {
        this.setData({
          ['list_arr[' + index_int + '].pageviews']: app.globalData.pageviewNum_int,
        })
      }
      app.globalData.pageviewId_int = -1
      app.globalData.pageviewNum_int = -1
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
