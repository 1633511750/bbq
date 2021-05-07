function $http({ isJson = false, url, data = {}, method = 'get', complete, hasLimit = true }, hasLoading = false) {
  return new Promise((resolve, reject) => {
    if (hasLimit) {
      var Cookie = wx.getStorageSync('Cookie');
      if (method.toLowerCase() === 'get') {
        var header = { 'content-type': 'application/json', 'cookie': Cookie }
      } else {
        var header = { 'content-type': 'application/x-www-form-urlencoded', 'cookie': Cookie }
      }
      if (isJson) {
        var header = { 'content-type': 'application/json', 'cookie': Cookie }
      }
    } else {
      if (method.toLowerCase() === 'get') {
        var header = { 'content-type': 'application/json' }
      } else {
        var header = { 'content-type': 'application/x-www-form-urlencoded' }
      }
      if (isJson) {
        var header = { 'content-type': 'application/json' }
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
      // url: 'http://www.coldice.top:8080' + url,
      // url: 'http://www.guoer.ltd:8080' + url,
      url: 'https://www.guoer.ltd' + url,
      data,
      header,
      method,
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(result);
        // if (result.statusCode === 200) {
        if (result.data.code === 205) {
          wx.navigateTo({
            url: '/pages/login/index',
          });
        }
        resolve(result)
        // } else if (result.statusCode === 500) {
        //   console.log(500);
        //   wx.navigateTo({
        //     url: '/pages/login/index',
        //   });
        //   wx.showToast({ title: '请先登录', icon: 'error' })
        // }
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
  // var t_arr = arg.split('.')[0].split('T')

  // var tt_arr = t_arr[0].split('-')
  // var year = tt_arr[0] - 0
  // var month = tt_arr[1] - 0
  // var day = tt_arr[2] - 0

  // tt_arr = t_arr[1].split(':')
  // var hour = tt_arr[0] - 0
  // var minute = tt_arr[1] - 0
  // var second = tt_arr[2] - 0

  var d = new Date(arg)
  // d.setFullYear(year)
  // d.setMonth(month - 1)
  // d.setDate(day)
  // d.setHours(hour + 8)
  // d.setMinutes(minute)
  // d.setSeconds(second)

  // let now_int = Date.now()
  // let dur_int = now_int - d.getTime()
  // let second_int = Math.ceil(dur_int / 1000)
  // let time_str = ''
  // let minute_int = Math.floor(second_int / 60)
  // let hours_int = Math.floor(minute_int / 60)
  // let day_int = Math.floor(hours_int / 24)

  // let year = d.getFullYear()
  // let month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
  // let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  // let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  // let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  // if (day_int > 3) {
  //   time_str = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  // } else if (day_int !== 0) {
  //   time_str = day_int + '天前 ' + 
  // } else if (hours_int !== 0) {
  //   time_str = hours_int % 24 + '小时前'
  // } else if (minute_int !== 0) {
  //   time_str = minute_int % 60 + '分钟前'
  // } else {
  //   time_str = '刚刚'
  // }

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
    day: d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
    hour: d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
    minute: d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  }
}

module.exports = {
  $http,
  myTime
}
