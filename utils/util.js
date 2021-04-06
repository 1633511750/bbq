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
      // url: 'http://159.75.6.154:8080' + url,
      url: 'http://www.guoer.ltd:8080/' + url, 
      // url: 'https://www.guoer.ltd:443/' + url,
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
          wx.showToast({ title: '请先登录', icon: 'error' })
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

function myTime(arg) {
  var t_arr = arg.split('.')[0].split('T')

  var tt_arr = t_arr[0].split('-')
  var year = tt_arr[0] - 0
  var month = tt_arr[1] - 0
  var day = tt_arr[2] - 0

  tt_arr = t_arr[1].split(':')
  var hour = tt_arr[0] - 0
  var minute = tt_arr[1] - 0
  var second = tt_arr[2] - 0

  var d = new Date()
  d.setFullYear(year)
  d.setMonth(month)
  d.setDate(day)
  d.setHours(hour + 8)
  d.setMinutes(minute)
  d.setSeconds(second)

  return {
    year: d.getFullYear(),
    month: d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth(),
    day: d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
    hour: d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
    minute: d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  }
}

module.exports = {
  $http,
  myTime
}
