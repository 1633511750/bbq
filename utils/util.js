function $http({ isJson = false, url, isOrgUrl = false, data = {}, method = 'get', complete, hasLimit = true }, hasLoading = false) {
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
    if (!isOrgUrl) {
      url = 'https://www.guoer.ltd' + url
    }
    wx.request({
      // url: 'http://159.75.6.154:8080' + url,
      // url: 'http://www.coldice.top:8080' + url,
      // url: 'http://www.guoer.ltd:8080' + url,
      url,
      data,
      header,
      method,
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(result);
        // console.log('+1');
        // if (result.statusCode === 200) {
        if (!isJson && result.data.code === 205) {
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

  let time_str = ''
  var d = new Date(arg)
  let now = new Date()
  let someTime = new Date(2020, 1, 1, 0, 0, 0)

  let dayDur_int = d.getTime() - someTime.getTime()
  let dayNowDur_int = now.getTime() - someTime.getTime()
  let DNowDur_int = now.getTime() - d.getTime()
  let days_int = Math.floor(dayDur_int / 1000 / 60 / 60 / 24)
  let dayNows_int = Math.floor(dayNowDur_int / 1000 / 60 / 60 / 24)
  let durDays = dayNows_int - days_int
  let DNowHour_int = Math.floor(DNowDur_int / 1000 / 60 / 60)
  let DNowMinute_int = Math.floor(DNowDur_int / 1000 / 60)

  let year = d.getFullYear()
  let month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
  let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  if (durDays > 30) {
    time_str = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  } else if (durDays === 1) {
    time_str = '昨天 ' + hour + ':' + minute
  } else if (durDays === 2) {
    time_str = '前天 ' + hour + ':' + minute
  } else if (durDays !== 0) {
    time_str = durDays + '天前 ' + hour + ':' + minute
  } else if (DNowHour_int !== 0 && DNowHour_int !== -1) {
    time_str = DNowHour_int + '小时前'
  } else if (DNowMinute_int !== 0 && DNowMinute_int !== -1) {
    time_str = DNowMinute_int + '分钟前'
  } else {
    time_str = '刚刚'
  }

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
    day: d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
    hour: d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
    minute: d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
    time: time_str
  }
}

// function getAccessToken_fun() {
//   $http({
//     isOrgUrl: true,
//     url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx8c84e9f59ed23d2d&secret=4b58b9b16c626dcfa7f9b81e1b75591c'
//   }).then(res => {
//     console.log(res);
//   })
// }

module.exports = {
  $http,
  myTime
  // getAccessToken_fun
}
