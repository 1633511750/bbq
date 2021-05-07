// pages/detail/index.js
const { $http, myTime } = require('../../utils/util')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList_arr: [],
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
    //     'https://i03piccdn.sogoucdn.com/089782feb3e09175',
    //     'https://i02piccdn.sogoucdn.com/fdd1e2dadbd01c8a',
    //     'https://i04piccdn.sogoucdn.com/af32dcada2c5a4a9',
    //     'https://i03piccdn.sogoucdn.com/089782feb3e09175',
    //     'https://i02piccdn.sogoucdn.com/fdd1e2dadbd01c8a',
    //     'https://i04piccdn.sogoucdn.com/af32dcada2c5a4a9',
    //     'https://i03piccdn.sogoucdn.com/089782feb3e09175'
    //   ],
    //   isZan: false,
    //   chat: 3,
    //   hot: 33,
    //   zan: 34,
    //   type: '游戏'
    // }],

    showDialog_bool: false,
    showPingLun_bool: false,
    keyHeight_int: 0,
    replyHeight_flo: 160,
    // item
    id_str: '',
    name_str: '',
    avatarUrl_str: '',
    category_str: '',
    img_arr: [],
    commentListNum_str: '',
    content_str: '',
    date_str: '',
    dianzanNum_str: '',
    pageviews_str: '',
    time_str: '',
    //回复数据
    reply_arr: [],
    isMy_bool: false,

    isReply_bool: false,
    // 评论框是否聚焦
    replyFocus_bool: false,
    isZan_bool: false,
    // 评论内容
    commentId_int: 0,
    comment_str: '',
    commentPlaceholder_str: '请输入评论内容',

    replyResult_str: '努力加载评论',
    // 匿名用户名称数组
    commentUser_arr: []
  },

  showActionDialog_fun() {
    if (this.data.isMy_bool === 'true') {
      wx.showActionSheet({
        itemList: ['置顶', '转发', '删除'],
        success: (result) => {
          switch (result.tapIndex) {
            case 0:

              break
            case 1:
              wx.showToast({
                title: '请点击上方按钮进行分享',
                icon: 'none',
                duration: 2000,
              });
              break
            case 2:
              this.deleteArtical_fun()
              break
          }
        },
      });
    } else {
      wx.showActionSheet({
        itemList: ['举报', '转发'],
        success: (result) => {
          switch (result.tapIndex) {
            case 0:
              wx.navigateTo({
                url: '/pages/jubao/index?id=' + this.data.id_str,
              });
              break
            case 1:
              wx.showToast({
                title: '请点击上方按钮进行分享',
                icon: 'none',
                duration: 2000,
              });
              break
          }
        },
      });
    }
  },

  // 置顶请求
  toTop_fun() {

  },

  // 隐藏分享弹窗
  hideDialog_fun() {
    wx.setNavigationBarColor({
      frontColor: '#000000', // 必写项
      backgroundColor: '#fff', // 传递的颜色值
    })
    this.setData({
      showDialog_bool: false
    })
  },

  showDialog_fun() {
    wx.setNavigationBarColor({
      frontColor: '#000000', // 必写项
      backgroundColor: '#ddd', // 传递的颜色值
    })
    this.setData({
      showDialog_bool: true
    })
  },

  // 显示评论弹窗
  showPingLun_fun() {
    wx.setNavigationBarColor({
      frontColor: '#000000', // 必写项
      backgroundColor: '#ddd', // 传递的颜色值
    })
    this.setData({
      showPingLun_bool: true,
      replyFocus_bool: true,
      commentPlaceholder_str: '请输入评论内容'
    })
  },

  closePingLun_fun() {
    wx.setNavigationBarColor({
      frontColor: '#000000', // 必写项
      backgroundColor: '#fff', // 传递的颜色值
    })
    this.setData({
      showPingLun_bool: false,
      isReply_bool: false
    })
  },

  // 调整大小
  keyboardheight_fun: function (e) {
    this.setData({
      keyHeight_int: e.detail.height
    })
  },

  // 放大textarea
  extend_fun() {
    this.setData({
      replyHeight_flo: this.data.replyHeight_flo === 160 ? 800 : 160
    })
  },

  useCamera_fun() {
    var self = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        self.setData({
          // tempFilePath可以作为img标签的src属性显示图片
          tempImgSrc_arr: res.tempFilePaths,
        })
      }
    })
  },

  empty_fun() { },

  // 大图预览功能
  previewImage_fun(e) {
    var urls = e.currentTarget.dataset.urls
    var cururl = e.currentTarget.dataset.cururl
    wx.previewImage({
      current: cururl, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },



  // 点赞
  dotZan_fun() {
    if (this.data.isZan_bool) {
      return
    }
    $http({
      url: '/Article/updateDianzanToArtic', method: 'post', data: {
        articId: this.data.id_str - 0
      }
    }).then(res => {
      console.log(res);
      if (res.data.success) {
        this.setData({
          isZan_bool: true,
          dianzanNum_str: ++this.data.dianzanNum_str
        })
        // wx.showToast({ title: '点赞成功' })
        app.globalData.zanId_int = this.data.id_str
        // 更新点赞到首页
      } else {
        wx.showToast({ title: '点赞失败', icon: 'error' })
      }
    }).catch(res => {
      console.log(res);
      wx.showToast({ title: '点赞失败', icon: 'error' })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var item_o = JSON.parse(options.item)

    this.setData({
      id_str: item_o.id,
      category_str: item_o.category,
      commentListNum_str: item_o.commentListNum_int,
      img_arr: item_o.imgOrg,
      content_str: item_o.content,
      date_str: item_o.date_str,
      dianzanNum_str: item_o.dianzanNum_int,
      pageviews_str: item_o.pageviews,
      time_str: item_o.time_str,
      name_str: item_o.name_str,
      avatarUrl_str: item_o.avatarUrl_str,
      isZan_bool: item_o.isZan,
      isMy_bool: options.isMy
    })
    this.addPageview_fun(this.data.id_str - 0)
    this.getReply_fun(this.data.id_str - 0)
  },

  // 浏览量+1
  addPageview_fun(articleId) {
    $http({ url: '/Article/countPageViews', method: 'post', data: { articleId } })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          app.globalData.pageviewId_int = articleId
        } else {
          // wx.showToast({
          //   title: '获取浏览量失败',
          //   icon: 'none',
          // });
        }
      }).catch(err => {
        // wx.showToast({
        //   title: '获取浏览量失败',
        //   icon: 'none',
        // });
        console.log(err);
      })
    this.setData({
      pageviews_str: this.data.pageviews_str - 0 + 1
    })
  },

  // 删除帖子
  deleteArtical_fun() {
    var self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success(res) {
        if (res.confirm) {
          $http({ url: '/Article/deleteArticlesById', method: 'post', data: { articleId: self.data.id_str - 0 } })
            .then(res => {
              console.log(res);
              if (res.data.success) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                });
                app.globalData.backState_int = 1
                setTimeout(() => {
                  var pages = getCurrentPages()
                  var curPage = pages[pages.length - 1]
                  var url = curPage.route
                  if (url === 'pages/detail/index') {
                    wx.navigateBack({
                      delta: 1
                    });
                  }
                }, 1500);
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'error',
                });
              }
            })
        } else if (res.cancel) {
          // wx.showToast({
          //   title: '已取消删除',
          //   icon: 'error',
          // });
        }
      }
    })
  },

  // 获取评论
  getReply_fun(id) {
    $http({ url: '/getCommentsByArticleId', data: { articleId: id } })
      .then(res => {
        console.log(res);
        // this.setData({
        //   commentUser_arr: []
        // })
        var arr_arr = res.data.data.commentList
        arr_arr.forEach(item => {
          let nmId_int = this.data.commentUser_arr.indexOf(item.fromUid)
          if (nmId_int === -1) {
            let temp_arr = this.data.commentUser_arr
            temp_arr.push(item.fromUid)
            this.setData({
              commentUser_arr: temp_arr
            })
            nmId_int = temp_arr.length
          } else {
            nmId_int++
          }
          if (nmId_int < 10) {
            item.nmId_str = '00' + nmId_int
          } else if (nmId_int < 100) {
            item.nmId_str = '0' + nmId_int
          } else {
            item.nmId_str = nmId_int
          }
        })
        arr_arr = arr_arr.reverse()
        arr_arr.forEach(item => {
          var t = myTime(item.createTime)
          item.time_str = t.year + '-' + t.month + '-' + t.day + ' ' + t.hour + ':' + t.minute
        })

        let p_arr = []
        arr_arr.forEach(item => {
          let p = new Promise((resolve, reject) => {
            $http({ url: '/Answer/getAnswersByCommentId', data: { commentId: item.id } })
              .then(res => {
                console.log(res);
                item.commentListNum_int = res.data.data.answerList.length
                resolve()
              }).catch(err => {
                console.log(err);
                reject()
              })
          })
          p_arr.push(p)
        })
        Promise.all(p_arr).then(res => {
          this.setData({
            reply_arr: arr_arr,
            commentListNum_str: arr_arr.length,
            replyResult_str: '无评论'
          })
          app.globalData.commentNum_int = this.data.commentListNum_str - 0
        }).catch(err => {
          console.log(err);
        })
      }).catch(err => {
        // wx.showToast({
        //   title: '获取评论失败',
        //   icon: 'error',
        // });
        this.setData({
          replyResult_str: '请前往小程序查看评论'
        })
        console.log(err);
      })
  },

  // 评论按钮点击事件
  replyBtn_fun(e) {
    let id = e.currentTarget.dataset.id
    let nmId = e.currentTarget.dataset.nmid
    let index_int = e.currentTarget.dataset.index
    console.log(index_int);
    this.setData({
      commentId_int: id,
      isReply_bool: true,
      index_int,
      commentPlaceholder_str: '回复：' + nmId,
      showPingLun_bool: true,
      replyFocus_bool: true
    })
  },

  // 设置textarea的值
  setInputValue_fun(e) {
    this.setData({
      comment_str: e.detail.value
    })
  },

  // 评论
  chat_fun() {
    if (this.data.comment_str.trim() === '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'error'
      })
      return
    }
    if (this.data.isReply_bool) {
      $http({ url: '/User/publisAnswer', data: { commentId: this.data.commentId_int, content: this.data.comment_str, isAnonymous: 1 } })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            wx.showToast({ title: '回复成功' })
            wx.setNavigationBarColor({
              frontColor: '#000000', // 必写项
              backgroundColor: '#fff', // 传递的颜色值
            })
            this.setData({
              showPingLun_bool: false,
              ['reply_arr[' + this.data.index_int + '].commentListNum_int']: this.data.reply_arr[this.data.index_int].commentListNum_int + 1
            })
            this.getCommentReplyFun_fun(this.data.commentId_int)
          } else {
            wx.showToast({ title: '回复失败', icon: 'error' })
          }
        })
    } else {
      $http({ url: '/User/publisComment', data: { articleId: this.data.id_str - 0, content: this.data.comment_str, isAnonymous: '0' } })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            wx.showToast({
              title: '评论成功',
            })
            app.globalData.commentId_int = this.data.id_str - 0

            wx.setNavigationBarColor({
              frontColor: '#000000', // 必写项
              backgroundColor: '#fff', // 传递的颜色值
            })
            this.setData({
              showPingLun_bool: false
            })
            this.getReply_fun(this.data.id_str - 0)
          } else {
            wx.showToast({
              title: '评论失败',
            })
          }
        })
    }
  },

  // 获取回复
  getCommentReply_fun(e) {
    let id = e.currentTarget.dataset.id
    let index_int = e.currentTarget.dataset.index
    this.setData({
      commentId_int: id,
      index_int
    })
    this.getCommentReplyFun_fun(id)
  },

  // 获取回复函数
  getCommentReplyFun_fun(id) {
    $http({ url: '/Answer/getAnswersByCommentId', data: { commentId: id } })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          let arr_arr = res.data.data.answerList
          arr_arr.forEach(item => {
            let nmId_int = this.data.commentUser_arr.indexOf(item.fromUid)
            if (nmId_int === -1) {
              let temp_arr = this.data.commentUser_arr
              temp_arr.push(item.fromUid)
              this.setData({
                commentUser_arr: temp_arr
              })
              nmId_int = 'x'
            } else {
              nmId_int++
            }
            if (nmId_int !== 'x') {
              if (nmId_int < 10) {
                item.nmId_str = '00' + nmId_int
              } else if (nmId_int < 100) {
                item.nmId_str = '0' + nmId_int
              } else {
                item.nmId_str = nmId_int
              }
            } else {
              item.nmId_str = '00X'
            }
          })
          arr_arr = arr_arr.reverse()
          arr_arr.forEach(item => {
            var t = myTime(item.createTime)
            item.time_str = t.year + '-' + t.month + '-' + t.day + ' ' + t.hour + ':' + t.minute
          })
          this.setData({
            ['reply_arr[' + this.data.index_int + '].reply']: arr_arr
          })
        }
      }).catch(res => {
        wx.showToast({
          title: '获取回复失败',
          icon: 'error',
        });
        console.log(res);
      })
  },

  // 分享功能
  // share_fun() {
  //   wx.showShareMenu({
  //     withShareTicket: true,
  //     menus: ['shareAppMessage', 'shareTimeline']
  //   })
  // },

  // 分享到朋友圈
  friendsCircle_fun() {
    wx.showToast({
      title: '请点击右上角按钮分享到朋友圈',
      icon: 'none',
      duration: 2000,
    });
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
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
    console.log('abcdd');
    return {
      title: this.data.content_str
    }
  },

  onShareTimeline() {
    return {
      title: this.data.content_str
    }
  }
})