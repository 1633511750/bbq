// pages/publish/index.js
var app = getApp()
const { $http } = require('../../utils/util')
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({ key: 'OQRBZ-FQJE3-YEO3L-35QNA-D5CXT-F6BQU' })
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyHeight_int: 0,
    tempImgSrc_arr: [],
    friendsName_arr: [],// @好友的名字
    text_str: '',//textarea的内容
    category_str: '',// 帖子分类
    school_str: '',
    isNM_bool: true, // 是否匿名

    textareaFouce_bool: false,
    tempBlur_bool: false,
  },

  // 大图预览
  previewImages_fun(e) {
    var urls = e.currentTarget.dataset.urls
    var cururl = e.currentTarget.dataset.cururl
    wx.previewImage({
      current: cururl, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },

  uploadImage_fun: function (id) {
    var p_arr = []
    this.data.tempImgSrc_arr.forEach((item, index) => {
      var p = new Promise((resolve, reject) => {
        var imgPath = this.data.tempImgSrc_arr[index]
        var Cookie = wx.getStorageSync('Cookie');
        wx.uploadFile({
          url: 'https://www.guoer.ltd/Article/uploadImage',
          filePath: imgPath,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data", "cookie": Cookie
          },
          formData: {
            'articId': id
          },
          success(res) {
            const data = res.data
            console.log('1', data);
            resolve(index)
          },
          fail(res) {
            console.log(res);
            reject(res)
          }
        })
      })
      p_arr.push(p)
    })
    return p_arr
  },

  keyboardheight_fun: function (e) {
    this.setData({
      keyHeight_int: e.detail.height
    })
  },

  focus_fun(e) {
    this.setData({ keyHeight_int: e.detail.height })
    console.log('聚焦焦点');
  },

  blur_fun() {
    this.setData({ keyHeight_int: 0 })
    console.log('失去聚焦');
  },

  // 调用相机、图库弹框
  tapPic_fun: function () {
    wx.showActionSheet({
      itemList: ['拍摄', '从相册选择'],
      // itemColor: '#aaa',
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.useCamera_fun('camera')
            break
          case 1:
            this.useCamera_fun('album')
            break
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },

  // 调用相机、图库
  useCamera_fun(type) {
    var self = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        console.log(res.tempFilePaths, 'oo');
        let tempImg_arr = [...res.tempFilePaths]
        if (this.data.tempImgSrc_arr.length + tempImg_arr.length > 9) {
          wx.showToast({
            title: '最多可以发表9张图片哦',
            icon: 'none',
          });
          var num_int = this.data.tempImgSrc_arr.length + tempImg_arr.length - 9
          var index_int = tempImg_arr.length - num_int
          tempImg_arr.splice(index_int, num_int)
        }

        let temp_arr = this.data.tempImgSrc_arr
        temp_arr.push(...tempImg_arr)
        self.setData({
          // tempFilePath可以作为img标签的src属性显示图片
          tempImgSrc_arr: temp_arr,
        })
        console.log(this.data.tempImgSrc_arr);
      }
    })
  },

  // 跳转到@好友页面
  tapAite_fun: function () {
    wx.navigateTo({
      url: '/pages/aite/index',
    });
  },

  //textchange
  textchange_fun(e) {
    this.setData({
      text_str: e.detail.value
    })
  },

  // 发帖
  publicArtical_fun() {
    if (this.data.text_str.trim() === '' && this.data.tempImgSrc_arr.length === 0) {
      wx.showToast({ title: '必须有文字或图片', icon: 'none' })
      return
    }
    wx.showModal({
      title: '',
      content: '是否发表？',
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          wx.showLoading({
            title: '正在发帖...'
          });
          $http({
            url: '/User/publisArticle', method: 'post', data: {
              category: this.data.category_str,
              content: this.data.text_str.trim(),
              school: app.globalData.school_str,
              location: this.data.school_str === '定位中，请稍候...' ? '' : this.data.school_str,
              isAnonymous: this.data.isNM_bool ? 1 : 0
            }
          }, false).then(res => {
            console.log('发帖成功');
            console.log(res);
            if (res.data.success) {
              var id = res.data.data.articleId - 0
              var p_arr = this.uploadImage_fun(id)
              Promise.all(p_arr).then(arr => {
                wx.hideLoading();
                wx.showToast({ title: '发帖成功' })
                app.globalData.backState_int = 1
                setTimeout(() => {
                  var pages = getCurrentPages()
                  var curPage = pages[pages.length - 1]
                  var url = curPage.route
                  if (url === 'pages/publish/index') {
                    wx.navigateBack({
                      delta: 1
                    });
                  }
                }, 1500);
              }).catch(err => {
                console.log(err);
              })
            } else {
              wx.showToast({ title: '发帖失败', icon: 'error' })
            }
          }).catch(res => {
            console.log('发帖错误');
            console.log(res);
            wx.showToast({ title: res, icon: 'error' })
          })
        }
      },
    });
  },

  // 删除图片
  deleteImg_fun(e) {
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除提示',
      content: '是否要删除该图片？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '删除',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          let arr_arr = this.data.tempImgSrc_arr
          arr_arr.splice(index, 1)
          this.setData({
            tempImgSrc_arr: arr_arr
          })
        }
      },
    });
  },

  getPosition_fun() {
    console.log('pos');
    this.setData({
      school_str: '定位中，请稍候...'
    })
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: false,
      success: (res) => {
        // 调用sdk接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: (res) => {
            console.log(res)  //获取成功
            let province_str = res.result.address_component.province//当前位置省会
            let city_str = res.result.address_component.city//当前位置城市
            let district_str = res.result.address_component.district//当前位置区域
            this.setData({
              school_str: province_str + ' ' + city_str + ' ' + district_str
            })
          },
          fail: err => {
            console.log(err);
          }
        })
      },
      fail: (err) => {
        console.log(err);
      },
      complete: () => { console.log('complete'); }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      school_str: '',
      // school_str: app.globalData.country_str + ' ' + app.globalData.province_str + ' ' + app.globalData.city_str,
      category_str: options.category,
      isNM_bool: options.isNM === 'true' ? true : false
    })
    console.log(options.isNM);
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
    if (this.data.friendsName_str !== '') {
      var friendName_str = ''
      this.data.friendsName_arr.forEach(item => {
        friendName_str += '@' + item + ' '
      })
      this.setData({
        text_str: this.data.text_str + friendName_str
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      friendsName_arr: []
    })
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