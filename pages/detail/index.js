// pages/detail/index.js
const { $http, myTime, getRndName_fun } = require('../../utils/util')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList_arr: [],

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
    commentUser_arr: [],
    isAnonymous_int: 1,

    fromUid_int: -1
  },

  showActionDialog_fun() {
    if (this.data.isMy_bool === 'true') {
      console.log(this.data.isTop_int);
      switch (this.data.isTop_int) {
        case 0:
          wx.showActionSheet({
            itemList: ['由表白墙代发', '请推广到全部学校', '请置顶', '删除'],
            success: (result) => {
              switch (result.tapIndex) {
                case 0:
                  this.toAnonymous_fun()
                  break
                case 1:
                  this.toTop_fun(3)
                  break
                case 2:
                  this.toTop_fun(1)
                  break
                case 3:
                  this.deleteArtical_fun()
                  break
              }
            },
          });
          break
        case 1:
          wx.showActionSheet({
            itemList: ['请推广到全部学校', '取消置顶', '删除'],
            success: (result) => {
              switch (result.tapIndex) {
                case 0:
                  this.toTop_fun(3)
                  break
                case 1:
                  this.toTop_fun(0)
                  break
                case 2:
                  this.deleteArtical_fun()
                  break
              }
            },
          });
          break
        case 3:
          wx.showActionSheet({
            itemList: ['取消推广到全部学校', '请置顶', '删除'],
            success: (result) => {
              switch (result.tapIndex) {
                case 0:
                  this.toTop_fun(0)
                  break
                case 1:
                  this.toTop_fun(1)
                  break
                case 2:
                  this.deleteArtical_fun()
                  break
              }
            },
          });
          break
        case 2:
          // 已置顶
          wx.showActionSheet({
            itemList: ['取消置顶', '删除'],
            success: (result) => {
              switch (result.tapIndex) {
                case 0:
                  this.toTop_fun(0)
                  break
                case 1:
                  this.deleteArtical_fun()
                  break
              }
            },
          });
          break
        case 4:
          // 已推广到全部学校
          wx.showActionSheet({
            itemList: ['取消推广到全部学校', '删除'],
            success: (result) => {
              switch (result.tapIndex) {
                case 0:
                  this.toTop_fun(0)
                  break
                case 1:
                  this.deleteArtical_fun()
                  break
              }
            },
          });
          break
      }
    } else {
      wx.showActionSheet({
        itemList: ['举报'],
        success: (result) => {
          switch (result.tapIndex) {
            case 0:
              wx.navigateTo({
                url: '/pages/jubao/index?id=' + this.data.id_str,
              });
              break
          }
        },
      });
    }
  },

  // 匿名此贴
  toAnonymous_fun() {
    console.log(this.data.id_str - 0);
    $http({
      url: '/Article/setIsAnonymous', method: 'post', data: {
        isAnonymous: 1,
        articleId: this.data.id_str - 0
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        wx.showToast({
          title: '发送成功',
        });
        setTimeout(() => {
          var pages = getCurrentPages()
          var curPage = pages[pages.length - 1]
          var url = curPage && curPage.route
          if (url === 'pages/detail/index') {
            wx.navigateBack({
              delta: 1
            });
          }
        }, 1500);
        app.globalData.backState_int = 1
      } else {
        wx.showToast({ title: '匿名失败', icon: 'error' })
      }
    })
  },

  // 置顶请求
  toTop_fun(type) {
    let self = this
    wx.showModal({
      title: '提示',
      content: '确认操作？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          $http({
            url: '/User/articleTopRequest', method: 'post', data: {
              articleId: self.data.id_str - 0, status: type
            }
          }).then(res => {
            console.log(res);
            if (res.data.code === 200) {
              switch (type) {
                case 0:
                case 2:
                case 4:
                  wx.showToast({ title: '取消成功', icon: 'none' })
                  break
                case 1:
                case 3:
                  wx.showToast({ title: '请求成功，审核中', icon: 'none' })
                  break
              }
              self.setData({
                isTop_int: type
              })
            } else {
              wx.showToast({ title: '操作失败', icon: 'error' })
            }
          })
        }
      },
    });
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
      isReply_bool: false,
      comment_str: ''
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
    var add = e.currentTarget.dataset.add
    var anonymous = e.currentTarget.dataset.anonymous
    console.log(add, anonymous);
    if (anonymous === 1 && add === 'true') {
      return
    }

    var urls = e.currentTarget.dataset.urls
    var cururl = e.currentTarget.dataset.cururl
    wx.previewImage({
      current: cururl, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
    if (add !== 'true') {
      this.addPageview_fun()
    }
  },

  // 点赞
  dotZan_fun() {
    // if (this.data.isZan_bool) {
    //   return
    // }
    let dz_arr = this.data.dianzan_str.split(',')
    dz_arr = dz_arr.filter(item => item !== '')

    let dzIndex_int = dz_arr.indexOf(app.globalData.uid_int + '')
    if (dzIndex_int !== -1) {
      dz_arr.splice(dzIndex_int, 1)
      this.setData({
        isZan_bool: false
      })
    } else {
      dz_arr.push(app.globalData.uid_int + '')
      this.setData({
        isZan_bool: true
      })
    }
    let dz_str = dz_arr.join(',')
    this.setData({
      dianzan_str: dz_str,
      dianzanNum_str: dz_arr.length
    })

    $http({
      url: '/Article/updateDianzanToArtic', method: 'post', data: {
        articId: this.data.id_str - 0,
        dianzanUids: dz_str
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        // wx.showToast({ title: '点赞成功' })
        app.globalData.zanId_int = this.data.id_str
        app.globalData.zanNum_int = dz_arr.length
        app.globalData.isZan_bool = this.data.isZan_bool
        // 更新点赞到首页
      } else {
        // wx.showToast({ title: '点赞失败', icon: 'error' })
      }
    }).catch(res => {
      console.log(res);
      // wx.showToast({ title: '点赞失败', icon: 'error' })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var item_o = JSON.parse(decodeURIComponent(options.item))
    let ext = JSON.parse(item_o.wxExtension)
    if (ext) {
      this.setData({
        wxTitle_str: ext.title,
        wxExtension_arr: ext.arr
      })
    } else {
      this.setData({
        wxTitle_str: '',
        wxExtension_arr: []
      })
    }
    console.log(item_o);
    this.setData({
      id_str: item_o.id,
      isTop_int: item_o.isTop,
      isTop_bool: item_o.isTop_bool,
      sex_str: item_o.sex_str,
      location_str: item_o.location,
      category_str: item_o.category,
      commentListNum_str: item_o.commentListNum_int,
      img_arr: item_o.imgOrg,
      content_str: item_o.content,
      date_str: item_o.date_str,
      dianzanNum_str: item_o.dianzanNum_int,
      dianzan_str: item_o.dianzan_str,
      pageviews_str: item_o.pageviews,
      time_str: item_o.time_str,
      name_str: item_o.name_str,
      avatarUrl_str: item_o.avatarUrl_str,
      isZan_bool: item_o.isZan,
      isMy_bool: options.isMy,
      tagBg: options.tagBg,
      isAnonymous_int: item_o.isAnonymous,
      fromUid_int: item_o.fromUid,
      userAvatarUrl_str: app.globalData.avatarUrl_str,
      anonymousAvatarUrl_str: app.globalData.anonymousAvatarUrl_str
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
          this.setData({
            pageviews_str: this.data.pageviews_str - 0 + 1
          })
          app.globalData.pageviewId_int = articleId
          app.globalData.pageviewNum_int = this.data.pageviews_str - 0
        }
      }).catch(err => {
        console.log(err);
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
    $http({ url: '/Comment/getCommentsByArticleId', data: { articleId: id } })
      .then(res => {
        console.log(res);
        // this.setData({
        //   commentUser_arr: []
        // })
        var arr_arr = res.data.data.commentList

        arr_arr.forEach(item => {
          console.log(item.isAnonymous);
          item.nmIndex_int = item.nmIndex_int || 0
          item.nmIndex_int++

          if (item.isAnonymous === 0) {
            item.nmId_str = item.userList[0].name
            item.avatarUrl_str = item.userList[0].userHeadpoait && (app.globalData.baseUrl + item.userList[0].userHeadpoait.slice(25) + '/' + item.userList[0].pictureName)
          } else {
            // let nmId_int = this.data.commentUser_arr.indexOf(item.fromUid)
            // if (nmId_int === -1) {
            //   let temp_arr = this.data.commentUser_arr
            //   temp_arr.push(item.fromUid)
            //   this.setData({
            //     commentUser_arr: temp_arr
            //   })
            //   nmId_int = temp_arr.length
            // } else {
            //   nmId_int++
            // }
            // if (nmId_int < 10) {
            //   item.nmId_str = '00' + nmId_int
            // } else if (nmId_int < 100) {
            //   item.nmId_str = '0' + nmId_int
            // } else {
            //   item.nmId_str = nmId_int
            // }
            // item.avatarUrl_str = app.globalData.anonymousAvatarUrl_str
            let index = this.data.commentUser_arr.findIndex(item1 => item1.uid === item.fromUid)
            if (index === -1) {
              this.setData({
                commentUser_arr: this.data.commentUser_arr.concat({ uid: item.fromUid, name: item.name })
              })
            }
          }
        })
        arr_arr = arr_arr.reverse()
        arr_arr.forEach(item => {
          var t = myTime(item.createTime)
          // item.time_str = t.year + '-' + t.month + '-' + t.day + ' ' + t.hour + ':' + t.minute
          item.time_str = t.time
        })

        let p_arr = []
        arr_arr.forEach(item => {
          let p = new Promise((resolve, reject) => {
            $http({ url: '/Answer/getAnswersByCommentId', data: { commentId: item.id } })
              .then(res => {
                item.commentListNum_int = res.data.data.answerList.filter(item => item.toUid === 0).length
                item.reply = res.data.data.answerList
                item.reply.forEach(item1 => {
                  var t = myTime(item1.createTime)
                  // item.time_str = t.year + '-' + t.month + '-' + t.day + ' ' + t.hour + ':' + t.minute
                  item1.time_str = t.time
                  if (item1.isAnonymous === 0) {
                    item1.nmId_str = item1.userList[0].name
                    item1.avatarUrl_str = item1.userList[0].userHeadpoait && (app.globalData.baseUrl + item1.userList[0].userHeadpoait.slice(25) + '/' + item1.userList[0].pictureName)
                  } else {
                    // item1.avatarUrl_str = app.globalData.anonymousAvatarUrl_str

                    // let nmId_int = this.data.commentUser_arr.indexOf(item1.fromUid)
                    // if (nmId_int === -1) {
                    //   let temp_arr = this.data.commentUser_arr
                    //   temp_arr.push(item1.fromUid)
                    //   this.setData({
                    //     commentUser_arr: temp_arr
                    //   })
                    //   nmId_int = temp_arr.length
                    // } else {
                    //   nmId_int++
                    // }
                    // if (nmId_int < 10) {
                    //   item1.nmId_str = '00' + nmId_int
                    // } else if (nmId_int < 100) {
                    //   item1.nmId_str = '0' + nmId_int
                    // } else {
                    //   item1.nmId_str = nmId_int
                    // }
                    let index = this.data.commentUser_arr.findIndex(item2 => item2.uid === item1.fromUid)
                    if (index === -1) {
                      this.setData({
                        commentUser_arr: this.data.commentUser_arr.concat({ uid: item1.fromUid, name: item1.name })
                      })
                    }
                  }
                })
                item.reply = res.data.data.answerList.reverse()

                resolve()
              }).catch(err => {
                console.log(err);
                reject()
              })
          })
          p_arr.push(p)
        })

        // 添加匿名数组
        arr_arr.commentUser_arr = []
        Promise.all(p_arr).then(res => {
          arr_arr.forEach(item => {
            item.reply = []
          })
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
    let toUid_int = e.currentTarget.dataset.touid
    let anony_str = e.currentTarget.dataset.anony + ''
    let toAnswerId_int = e.currentTarget.dataset.answerid
    console.log(index_int);
    this.setData({
      commentId_int: id,
      isReply_bool: true,
      toUid_int,
      index_int,
      anony_str,
      toAnswerId_int,
      commentPlaceholder_str: '回复：',
      // commentPlaceholder_str: '回复：' + nmId,
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
  chat_fun(e) {
    if (this.data.comment_str.trim() === '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'error'
      })
      return
    }
    let isAnonymous = e.currentTarget.dataset.anonymous - 0
    console.log(isAnonymous, 'a');
    console.log(this.data.toAnswerId_int);

    let name = this.getName(app.globalData.uid_int)
    if (this.data.isReply_bool) {
      $http({
        url: '/User/publisAnswer', data: {
          commentId: this.data.commentId_int, content: this.data.comment_str, isAnonymous, toUid: this.data.toUid_int,
          toName: this.data.anony_str, toAnswerId: this.data.toAnswerId_int, name
        }
      })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            wx.showToast({ title: '回复成功' })
            this.closePingLun_fun()
            this.setData({
              showPingLun_bool: false,
              ['reply_arr[' + this.data.index_int + '].commentListNum_int']: this.data.reply_arr[this.data.index_int].commentListNum_int + 1
            })
            this.getCommentReplyFun_fun(this.data.commentId_int)
          } else if (res.data.code === 214) {
            wx.showToast({ title: '您已被禁言', icon: 'error' })
          } else {
            wx.showToast({ title: '回复失败', icon: 'error' })
          }
          this.setData({
            isReply_bool: false
          })
        }).catch(res => {
          this.setData({
            isReply_bool: false
          })
        })
    } else {
      $http({
        url: '/User/publisComment', data: {
          articleId: this.data.id_str - 0,
          content: this.data.comment_str, isAnonymous, name
        }
      })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            wx.showToast({
              title: '评论成功',
            })
            app.globalData.commentId_int = this.data.id_str - 0

            this.closePingLun_fun()
            this.setData({
              showPingLun_bool: false
            })
            this.getReply_fun(this.data.id_str - 0)
          } else if (res.data.code === 214) {
            wx.showToast({ title: '您已被禁言', icon: 'error' })
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
    if (this.data.reply_arr[index_int].isExtendsReply_bool) {
      this.setData({
        ['reply_arr[' + index_int + '].isExtendsReply_bool']: false,
        ['reply_arr[' + index_int + '].reply']: []
      })
    } else {
      this.setData({
        ['reply_arr[' + index_int + '].isExtendsReply_bool']: true,
      })
      this.getCommentReplyFun_fun(id)
    }
  },

  // 获取回复函数
  getCommentReplyFun_fun(id) {
    $http({ url: '/Answer/getAnswersByCommentId', data: { commentId: id } })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          let arr_arr = res.data.data.answerList
          arr_arr.forEach((item, index, arr) => {
            var t = myTime(item.createTime)
            // item.time_str = t.year + '-' + t.month + '-' + t.day + ' ' + t.hour + ':' + t.minute
            item.time_str = t.time
            if (item.isAnonymous === 0) {
              item.nmId_str = item.userList[0].name
              item.realyName_str = item.userList[0].name
              item.avatarUrl_str = item.userList[0].userHeadpoait && (app.globalData.baseUrl + item.userList[0].userHeadpoait.slice(25) + '/' + item.userList[0].pictureName)
            } else {
              // item.realyName_str = 'null'
              // item.avatarUrl_str = app.globalData.anonymousAvatarUrl_str

              // let nmId_int = this.data.commentUser_arr.indexOf(item.fromUid)
              // if (nmId_int === -1) {
              //   let temp_arr = this.data.commentUser_arr
              //   temp_arr.push(item.fromUid)
              //   this.setData({
              //     commentUser_arr: temp_arr
              //   })
              //   nmId_int = temp_arr.length
              // } else {
              //   nmId_int++
              // }

              // if (nmId_int < 10) {
              //   item.nmId_str = '00' + nmId_int
              // } else if (nmId_int < 100) {
              //   item.nmId_str = '0' + nmId_int
              // } else {
              //   item.nmId_str = nmId_int
              // }
              let index = this.data.commentUser_arr.findIndex(item1 => item1.uid === item.fromUid)
              if (index === -1) {
                this.setData({
                  commentUser_arr: this.data.commentUser_arr.concat({ uid: item.fromUid, name: item.name })
                })
              }
            }

            // item.nmId_str = item.name

            if (item.toUid !== 0) {
              if (item.toName === '0') {
                let t_o = arr.find(item1 => item.toUid === item1.fromUid && item1.isAnonymous === 0)
                if (t_o) {
                  item.toName_str = t_o.userList[0].name
                } else {
                  item.toName_str = '[delete]'
                }
              } else if (item.toName === '1') {
                item.toName_str = arr.find(item1 => item.toUid === item1.fromUid && item1.isAnonymous === 1).nmId_str || 'delete'
              }
            }
          })
          let reply_arr = arr_arr.filter(item => item.toUid === 0)
          console.log(reply_arr);
          reply_arr.forEach(item => item.rep = [])
          let rep_arr = arr_arr.filter(item => item.toUid !== 0)
          console.log(rep_arr);
          rep_arr.forEach(item => {
            let index_int = reply_arr.findIndex(item1 => item1.id === item.toAnswerId)
            console.log(index_int);
            if (index_int !== -1) {
              reply_arr[index_int].rep.push(item)
            }
          })
          // arr_arr = arr_arr.reverse()
          arr_arr.forEach(item => {
            var t = myTime(item.createTime)
            // item.time_str = t.year + '-' + t.month + '-' + t.day + ' ' + t.hour + ':' + t.minute
            item.time_str = t.time
          })
          this.setData({
            ['reply_arr[' + this.data.index_int + '].reply']: reply_arr
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

  // 删除评论
  deleteComment_fun(e) {
    // console.log(this.data.reply_arr);
    let item_o = e.currentTarget.dataset.item
    let fromUid_int = item_o.fromUid
    let id_int = item_o.id
    console.log(id_int);
    if (fromUid_int === app.globalData.uid_int) {
      // 自己发表的评论
      wx.showModal({
        title: '删除提示',
        content: '是否要删除该评论？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            $http({
              url: '/Comment/delComment', method: 'post', data: {
                commentId: id_int
              }
            }).then(res => {
              console.log(res);
              if (res.data.code === 200) {
                console.log('删除评论成功');
                let index_int = this.data.reply_arr.findIndex(item => item.id === id_int)
                if (index_int !== -1) {
                  let t_arr = [...this.data.reply_arr]
                  t_arr.splice(index_int, 1)
                  this.setData({
                    reply_arr: t_arr,
                    commentListNum_str: this.data.commentListNum_str - 1
                  })
                  app.globalData.commentId_int = this.data.id_str - 0
                  app.globalData.commentNum_int = this.data.commentListNum_str - 0
                } else {
                  console.log('没找到');
                }
              } else {
                console.log('删除失败');
              }
            })
          }
        }
      });
    } else {
      // 别人发表的评论
      wx.showActionSheet({
        itemList: ['举报'],
        itemColor: '#000000',
        success: (result) => {
          switch (result.tapIndex) {
            case 0:

              break
          }
        }
      });
    }
  },

  // 删除回复
  deleteReply_fun(e) {
    let item_o = e.currentTarget.dataset.item
    let fromUid_int = item_o.fromUid
    let id_int = item_o.id

    let index0 = e.currentTarget.dataset.indexz - 0
    let index1 = e.currentTarget.dataset.indexo - 0
    let index2 = e.currentTarget.dataset.indext - 0

    if (fromUid_int === app.globalData.uid_int) {
      // 自己发表的回复
      wx.showModal({
        title: '删除提示',
        content: '是否要删除该回复？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            $http({
              url: '/Answer/delAnswer', method: 'post', data: {
                answerId: id_int
              }
            }).then(res => {
              console.log(res);
              if (res.data.code === 200) {
                console.log('删除回复成功');

                if (index2 === -1) {
                  let arr = this.data.reply_arr[index0].reply
                  arr.splice(index1, 1)
                  this.setData({
                    ['reply_arr[' + index0 + '].reply']: arr,
                    ['reply_arr[' + this.data.index_int + '].commentListNum_int']: this.data.reply_arr[this.data.index_int].commentListNum_int - 1
                  })
                } else {
                  let arr = this.data.reply_arr[index0].reply[index1].rep
                  arr.splice(index2, 1)
                  this.setData({
                    ['reply_arr[' + index0 + '].reply[' + index1 + '].rep']: arr
                  })
                }

                // let index_int = this.data.reply_arr[replyArrIndex_int].reply.findIndex(item => item.id === id_int)
                // if (index_int !== -1) {
                //   let t_arr = [...this.data.reply_arr[replyArrIndex_int].reply]
                //   t_arr.splice(index_int, 1)
                //   this.setData({
                //     ['reply_arr[' + replyArrIndex_int + '].reply']: t_arr,
                //     ['reply_arr[' + this.data.index_int + '].commentListNum_int']: this.data.reply_arr[this.data.index_int].commentListNum_int - 1
                //   })
                // } else {
                //   console.log('没找到');
                // }
              } else {
                console.log('删除失败');
              }
            })
          }
        }
      });
    } else {
      // 别人发表的回复
      wx.showActionSheet({
        itemList: ['举报'],
        itemColor: '#000000',
        success: (result) => {
          switch (result.tapIndex) {
            case 0:

              break
          }
        }
      });
    }
  },

  // 关闭分享弹出框
  share_fun() {
    this.hideDialog_fun()
  },

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

  getName(uid) {
    let index = this.data.commentUser_arr.findIndex(item => item.uid === uid)
    if (index === -1) {
      let name = getRndName_fun()
      this.setData({
        commentUser_arr: this.data.commentUser_arr.concat({ uid, name })
      })
      return name
    }
    return this.data.commentUser_arr[index].name
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('abcdd');
    if (this.data.img_arr.length > 0) {
      return {
        title: this.data.content_str,
        imageUrl: this.data.img_arr[0]
      }
    } else {
      return {
        title: this.data.content_str
      }
    }
  },

  onShareTimeline() {
    if (this.data.img_arr.length > 0) {
      return {
        title: this.data.content_str,
        imageUrl: this.data.img_arr[0]
      }
    } else {
      return {
        title: this.data.content_str,
      }
    }
  }
})