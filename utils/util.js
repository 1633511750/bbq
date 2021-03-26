var aaa = 'aaaaaaa'
function $http({ url, data = {}, method = 'get', complete, hasLimit = true }, hasLoading = true) {
  return new Promise((resolve, reject) => {
    if (hasLimit) {
      var Cookie = wx.getStorageSync('Cookie');
      if (method.toLowerCase() === 'get') {
        var header = { 'content-type': 'application/json', 'cookie': Cookie }
      } else {
        var header = { 'content-type': 'application/x-www-form-urlencoded', 'cookie': Cookie }
      }
    } else {
      if (method.toLowerCase() === 'get') {
        var header = { 'content-type': 'application/json' }
      } else {
        var header = { 'content-type': 'application/x-www-form-urlencoded' }
      }
    }
    if (hasLoading) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
    }
    wx.request({
      url: 'http://159.75.6.154:8080' + url,
      data,
      header,
      method,
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        if (result.statusCode === 200) {
          if (result.data.code === 211) {
            wx.navigateTo({
              url: '/pages/login/index',
            });
          }
          resolve(result)
        } else if (result.statusCode === 500) {
          wx.navigateTo({
            url: '/pages/login/index',
          });
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '请求失败',
          icon: 'error',
        });
        reject(res)
      },
      complete: () => {
        hasLoading && wx.hideLoading()
        complete && complete()
      }
    });
  })

}

module.exports = {
  $http,
  aaa
}
