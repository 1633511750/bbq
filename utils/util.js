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
          console.log('to-login-page');
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
  // if (durDays > 30) {
  //   time_str = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  // } else if (durDays === 1) {
  //   time_str = '昨天 ' + hour + ':' + minute
  // } else if (durDays === 2) {
  //   time_str = '前天 ' + hour + ':' + minute
  // } else if (durDays !== 0) {
  //   time_str = durDays + '天前 ' + hour + ':' + minute
  // } else if (DNowHour_int !== 0 && DNowHour_int !== -1) {
  //   time_str = DNowHour_int + '小时前'
  // } else if (DNowMinute_int !== 0 && DNowMinute_int !== -1) {
  //   time_str = DNowMinute_int + '分钟前'
  // } else {
  //   time_str = '刚刚'
  // }
  if (durDays > 1) {
    time_str = month + '-' + day + ' ' + hour + ':' + minute
  } else if (durDays === 1) {
    time_str = '昨天 ' + hour + ':' + minute
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

function $getAllSchool(isHasAll) {
  let school = [
    '山西大学',
    '太原科技大学',
    '中北大学',
    '太原理工大学',
    '山西农业大学',
    '山西医科大学',
    '长治医学院',
    '山西师范大学',
    '太原师范学院',
    '山西大同大学',
    '晋中学院',
    '长治学院',
    '运城学院',
    '忻州师范学院',
    '山西财经大学',
    '山西中医药大学',
    '吕梁学院',
    '太原学院',
    '山西警察学院',
    '山西应用科技学院',
    '山西大学商务学院',
    '太原理工大学现代科技学院',
    '山西师范大学现代文理学院',
    '山西农业大学信息学院',
    '中北大学信息商务学院',
    '太原科技大学华科学院',
    '山西医科大学晋祠学院',
    '山西财经大学华商学院',
    '山西工商学院',
    '太原工业大学',
    '运城职业技术大学',
    '山西传媒学院',
    '山西工程技术学院',
    '山西能源学院',

    '山西旅游职业学院',
    '山西戏剧职业学院',
    '山西职业技术学院',
    '山西工程职业技术学院',
    '山西工程技术学院',
    '山西经贸职业学院',
    '运城职业技术学院',
    '晋中职业技术学院',
    '山西财贸职业技术学院',
    '太原电力高等专科学校',
    '运城幼儿师范高等专科学校',
    '山西药科职业学院',
    '临汾职业技术学院',
    '晋城职业技术学院',
    '山西信息职业技术学院',
    '大同煤炭职业技术学院',
    '山西华澳商贸职业学院',
    '长治职业技术学院',
    '山西水利职业技术学院',
    '山西艺术职业学院',
    '山西机电职业技术学院',
    '山西国际商务职业学院',
    '山西建筑职业技术学院',
    '阳泉职业技术学院',
    '运城护理职业学院',
    '山西运城农业职业技术学院',
    '阳泉师范高等专科学校',
    '太原旅游职业学院',
    '忻州职业技术学院',
    '山西交通职业技术学院',
    '太原城市职业技术学院',
    '潞安职业技术学院',
    '晋中师范高等专科学校',
    '山西省财政税务专科学校',
    '山西煤炭职业技术学院',
    '山西管理职业学院',
    '山西青年职业学院',
    '山西金融职业学院',
    '山西警官职业学院',
    '山西电力职业技术学院',
    '朔州职业技术学院',
    '山西老区职业技术学院',
    '山西林业职业技术学院',
    '山西轻工职业技术学院',
    '山西警官高等专科学校',
    '山西体育职业学'
  ]
  if (isHasAll) {
    school.unshift('全部')
  }
  return school
}

function $getAllJobLabel(isHasAll) {
  let label = ['美妆', '服饰', '休闲', '学习', '艺术', '代劳', '自主创业', 'IT', '兴趣', '其他']
  if (isHasAll) {
    label.unshift('全部')
  }
  return label
}

let name_s = '康星翰晸建家致树炎德行时泰盛雄琛钧士以若鸣朋斌梁栋维启克伦翔旭鹏泽朗伯昮晋晟诚先敬震振壮会思群豪心邦承乐宏言旲旻昊光天达安岩中茂进林有坚和彪博泰盛振挺掣明永健世广志义兴良海山仁波宁行时志忠思绍功松善厚庆磊民友裕河哲江超炎德彰征律晨辰士以建家致煜煊炎波宁贵福生龙元全国胜学祥才发武新利清飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博诚先敬震振壮会思群豪心邦承乐绍功松善厚庆磊民友裕河哲江超浩亮政谦亨奇固之轮翰朗伯宏言若鸣朋斌梁栋维启克伦翔旭鹏泽晨辰容儒彰昭逸冠耀意钊易代敬贵璟利彦福谱钢茵瑞梁襦诚为凤以涓英佚钧河筠高崇飒炎缜驹镇哲颜俊军彤宜艺瑾隆正晷垒焘社圣谚森佳万晋鹏诤琛晟涛承频卿瀚兴俯豪毅谊章理凌星靖海恬澔锦鑫珺登聪睿亨罡桦弓禅迅超达茹之稹阔丞砂韦科固胜大苓纲骏来亿沧珑康瀛迎奕浦聚政盈畅歌益雄帝立韩殿庆舱凯广若励淇全弛谦臻善朕采波光合升国照竣乔征鹰喆震滢劭澎颔真华基振景锐生钦菁礼泉义刚增尧巩功榕翰富铠斌骅山绮辅议力溢亦进亮吉铖朗融展寒博驰部澉候珂佩玮诗韵藻敏慧欣宜云雪菲洋冉瑞静颖韶爱姿惠娇媛妩萱安蓝春语彤晴瑜瑶瑾璇璐璟惠慧敏旭春晴曼宁欣凡佳勤雪琳晗玉萍红娥玲芬芳燕彩露瑶珍贞莉兰琳素云莲真环雪荣爱妹霞瑞凡佳嘉琼娅琦晶妍茜秋珊莎锦薇亭瀚桓东滢恬瑾眉君琴仙伊叶宝容芸妮娜承民智棠胜荷丹蓉晓欢霄娅瑞凡嘉琼勤蓓纨珍贞莉菲淑澜依毓悦昭冰爽琬茗羽希怡婵欣飘育富泽新恩羽旭维家琰韵晴晶妍茜秋珊莎锦黛青倩'

function getRndName_fun() {
  let num = Math.floor(Math.random() * 3) + 2
  let len = name_s.length
  let str = ''
  for (let i = 0; i < num; i++) {
    let rnd = Math.floor(Math.random() * len)
    str += name_s[rnd]
  }
  return str
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
  myTime,
  $getAllSchool,
  $getAllJobLabel,
  getRndName_fun
  // getAccessToken_fun
}
