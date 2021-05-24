// pages/search/index.js
const app = getApp()
var pageNum_int = 1
var pageTotal_int = 0
const { $http, myTime } = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue_str: '',
    text: '搜索',
    list_arr: [],
    wall_arr: [],
    job_arr: [],
    wallValue_str: '',
    jobValue_str: '',
    // 顶部消息
    topMsg_str: '',
    topMsgHeight_int: 0,
    topMsgTimer_int: null,

    bottomMsg_str: '',
    bottomMsgHeight_int: 0,
    bottomMsgTimer_int: null,

    typeIndex_int: 0,
  },

  /**
   * 生命周期函数--监听页面搜索
   */
  onLoad: function (options) {

  },

  // 切换type
  switchType_fun(e) {
    let index_int = e.currentTarget.dataset.index - 0
    if (this.data.typeIndex_int === index_int) {
      return
    }

    if (index_int === 0) {
      this.setData({
        typeIndex_int: index_int,
        list_arr: this.data.wall_arr
      })
      if (this.data.wall_arr.length > 0) {
        this.setData({
          topMsg_str: '关键词 [' + this.data.wallValue_str + '] 共找到' + this.data.wall_arr.length + '条记录'
        })
      } else {
        this.setData({
          topMsg_str: '',
          bottomMsg_str: ''
        })
      }
    } else {
      this.setData({
        typeIndex_int: index_int,
        list_arr: this.data.job_arr
      })
      if (this.data.job_arr.length > 0) {
        this.setData({
          topMsg_str: '关键词 [' + this.data.jobValue_str + '] 共找到' + this.data.job_arr.length + '条记录'
        })
      } else {
        this.setData({
          topMsg_str: '',
          bottomMsg_str: ''
        })
      }
    }
  },

  getSearchValue_fun(e) {
    this.setData({
      searchValue_str: e.detail
    })
    if (this.data.typeIndex_int === 0) {
      this.setData({
        wallValue_str: e.detail
      })
    } else {
      this.setData({
        jobValue_str: e.detail
      })
    }
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
        topMsg_str: '正在努力搜索',
        topMsgHeight_int: 50,
      })
    }
    let category_str = 'all'
    this.getArticle_fun({ category: category_str, hasLoading: false })
      .then(res => {
        console.log(res);
        pageTotal_int = res.total_int
        pageNum_int = Math.ceil(res.total_int / 5)
        this.setData({
          wall_arr: [],
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
          wall_arr: res.articleList,
          list_arr: res.articleList
        })
        if (pageNum_int > 1) {
          pageNum_int--
          return this.getArticle_fun({ category: category_str, pageNumber: pageNum_int, hasLoading: false })
        } else {
          return -1
        }
      }).then(res => {
        console.log(res);
        if (res !== -1) {
          var arr_arr = this.data.wall_arr
          arr_arr.push(...res.articleList)
          this.setData({
            wall_arr: arr_arr,
            list_arr: arr_arr
          })
        } else {

        }
        this.setData({
          topMsg_str: ''
        })
        // wx.hideLoading();
        this.topMsgFinish_fun('关键词 [' + this.data.searchValue_str.trim() + '] 共找到' + pageTotal_int + '条记录')
        // if (isAuto) {
        // } else {
        //   // this.topMsgFinish_fun('搜索成功')
        //   this.topMsgFinish_fun()
        // }
        callback && callback()
      }).catch(res => {
        // wx.hideLoading();
        this.topMsgFinish_fun('搜索失败')
        console.log(res);
      })
  },

  initTemp_fun(isAuto) {
    if (this.data.typeIndex_int === 0) {
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
            // this.setData({
            //   bottomMsg_str: '关键词 [' + this.data.searchValue_str + '] 无搜索内容'
            // })
          }
          this.setData({ searchValue_str: '' })
        }, isAuto
      )
    } else {
      // 创业街搜索
      this.setData({
        jobValue_str: '',
        searchValue_str: ''
      })
      wx.showToast({
        title: '敬请期待',
        icon: 'none',
      });
    }
  },

  getArticle_fun({ category, school = app.globalData.school_str, callback, isShowSuccess, pageNumber = 1, hasLoading = false } = {}) {
    return new Promise((resolve, reject) => {
      // this.data.commentwall_arr1.forEach(item => {
      //   item.avatarUrl_str = app.globalData.avatarUrl_str
      // })
      $http({ url: '/Article/getArticleByKeywords', method: 'get', data: { keywords: this.data.searchValue_str.trim(), school, pageNum: pageNumber, pageSize: 5 }, complete: () => { callback && callback() } }, hasLoading)
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
            title: '搜索失败',
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
    let articleList = data.articleList && data.articleList.list.reverse() || []
    articleList.forEach(item => {
      if (item.commentList.length > 0) {
        item.commentListNum_int = item.commentList[0].commentCount
      } else {
        item.commentListNum_int = 'x'
      }

      var t_o = myTime(item.createTime)
      item.date_str = t_o.month + '-' + t_o.day
      item.time_str = t_o.hour + ':' + t_o.minute

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
    })
    if (pageNum_int === 1 && articleList.length > 0) {
      articleList[articleList.length - 1].isLast = true
    }
    return articleList
  },

  // 触发点赞
  dotZan_fun(e) {
    var id = e.currentTarget.dataset.id
    let index_int = this.data.wall_arr.findIndex(item => item.id === id)
    if (index_int !== -1) {
      this.setData({
        ['wall_arr[' + index_int + '].dianzanNum_int']: this.data.wall_arr[index_int].dianzanNum_int + 1,
        ['wall_arr[' + index_int + '].isZan']: true
      })
    }
  },

  topMsgFinish_fun(msg_str) {
    this.setData({
      bottomMsg_str: ''
    })
    if (pageNum_int === 1) {
      this.setData({
        bottomMsg_str: '已全部加载',
        bottomMsgHeight_int: 50
      })
    }
    console.log(msg_str);
    if (msg_str) {
      this.setData({
        topMsg_str: msg_str,
        topMsgHeight_int: 50
      })
    }
    // if (msg_str) {
    //   this.setData({
    //     topMsg_str: msg_str,
    //     topMsgHeight_int: 50
    //   })
    // } else {
    //   this.setData({
    //     topMsgHeight_int: 0
    //   })
    // }
    clearTimeout(this.data.topMsgTimer_int)
    // var t_int = setTimeout(() => {
    //   this.setData({
    //     topMsg_str: '',
    //     topMsgHeight_int: 0
    //   })
    // }, 1500);
    // this.setData({
    //   topMsgTimer_int: t_int
    // })
  },

  // 触发点赞
  dotZan_fun(e) {
    var id = e.currentTarget.dataset.id
    let dz_arr = e.detail.dz_arr
    console.log(dz_arr);

    let index_int = this.data.wall_arr.findIndex(item => item.id === id)
    if (index_int !== -1) {
      let index = dz_arr.indexOf(app.globalData.uid_int + '')
      if (index !== -1) {
        this.setData({
          ['wall_arr[' + index_int + '].dianzanNum_int']: dz_arr.length,
          ['wall_arr[' + index_int + '].isZan']: true,
          ['wall_arr[' + index_int + '].dianzan_str']: dz_arr.join(',')
        })
      } else {
        this.setData({
          ['wall_arr[' + index_int + '].dianzanNum_int']: dz_arr.length,
          ['wall_arr[' + index_int + '].isZan']: false,
          ['wall_arr[' + index_int + '].dianzan_str']: dz_arr.join(',')
        })
      }
      console.log(this.data.wall_arr[index_int]);
    }
  },

  searchHandle_fun() {
    if (this.data.searchValue_str.trim() !== '') {
      this.initTemp_fun()
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
      });
    }
  },

  upPullLoadList_fun() {
    if (pageNum_int <= 1) {
      this.setData({
        bottomMsg_str: '已全部加载',
        bottomMsgHeight_int: 50
      })
      return
    }
    this.setData({
      bottomMsg_str: '正在努力加载',
      bottomMsgHeight_int: 50
    })
    pageNum_int--
    let category_str = 'all'
    this.getArticle_fun({
      callback: () => {
        this.setData({
          isPullDown_bool: false
        })
      }, pageNumber: pageNum_int, category: category_str
    }).then(res => {
      var arr_arr = this.data.wall_arr

      arr_arr.push(...res.articleList)
      this.setData({
        wall_arr: arr_arr,
        list_arr: arr_arr
      })
      // 不知为啥这里报错：_this5.bottomMsgFinish_fun不是一个函数
      // this.bottomMsgFinish_fun()
    }).catch(err => {
      console.log(err);
      this.bottomMsgFinish_fun('加载失败，请重试')
    })
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
    if (app.globalData.zanId_int !== -1) {
      console.log(app.globalData.zanId_int);
      let index_int = this.data.wall_arr.findIndex(item => item.id === app.globalData.zanId_int)
      if (index_int !== -1) {
        this.setData({
          // ['wall_arr[' + index_int + '].dianzanNum_int']: this.data.wall_arr[index_int].dianzanNum_int + 1,
          ['wall_arr[' + index_int + '].dianzanNum_int']: app.globalData.zanNum_int,
          ['wall_arr[' + index_int + '].isZan']: app.globalData.isZan_bool
        })
      }
      app.globalData.zanId_int = -1
    }

    if (app.globalData.pageviewId_int !== -1) {
      let index_int = this.data.wall_arr.findIndex(item => item.id === app.globalData.pageviewId_int)
      if (index_int !== -1) {
        this.setData({
          ['wall_arr[' + index_int + '].pageviews']: app.globalData.pageviewNum_int,
        })
      }
      app.globalData.pageviewId_int = -1
      app.globalData.pageviewNum_int = -1
    }

    if (app.globalData.commentId_int !== -1) {
      let index_int = this.data.wall_arr.findIndex(item => item.id === app.globalData.commentId_int)
      if (index_int !== -1) {
        this.setData({
          ['wall_arr[' + index_int + '].commentListNum_int']: app.globalData.commentNum_int
        })
      }
      console.log(app.globalData.commentId_int, app.globalData.commentNum_int);
      app.globalData.commentId_int = -1
      app.globalData.commentNum_int = -1
    }
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