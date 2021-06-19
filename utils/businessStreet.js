import { $http } from '../utils/util'
/**
 * 创业街模块
 */

// 获取店铺
function getShops_fun({ pageNum_int = 1, shop_obj = {}, success_fun = () => { }, pageSize_int = 50 }) {
  $http({
    isJson: true, url: '/businessStreet/getShops', method: 'post', data: { pageNum: pageNum_int, pageSize: pageSize_int, streetShop: shop_obj }
  }).then(res => {
    // console.log(res.data.data.streetShops);
    if (res.data.code === 200) {
      success_fun(res.data.data.streetShops)
    } else {
      wx.showToast({ title: '!200', icon: 'none' })
    }
  }).catch(err => {
    wx.showToast({ title: err + '', icon: 'none' })
  })
}

// 获取商品
function getGoods_fun({ good_obj = {}, pageNum_int = 1, pageSize_int = 50, success_fun = () => { } }) {
  $http({
    isJson: true, url: '/businessStreet/getGoods', method: 'post', data: { pageNum: pageNum_int, pageSize: pageSize_int, streetGoods: good_obj }
  }).then(res => {
    if (res.data.code === 200) {
      success_fun(res.data.data.streetGoods)
    } else {
      wx.showToast({ title: '!200', icon: 'none' })
    }
  }).catch(err => {
    wx.showToast({ title: err + '', icon: 'none' })
  })
}

// 更新/添加店铺
function addOrUpdateShop_fun({ data_obj = {}, success_fun = () => { } }) {
  $http({
    isJson: true, url: '/businessStreet/addOrUpdateShop', method: 'post', data: data_obj
  }).then(res => {
    console.log(res);
    if (res.data.code === 200) {
      success_fun(res)
    } else {
      wx.showToast({ title: '!200', icon: 'none' })
    }
  }).catch(err => {
    wx.showToast({ title: err + '', icon: 'none' })
  })
}

// 更新/添加商品
function addOrUpdateGood_fun({ data_obj = {}, success_fun = () => { } }) {
  $http({
    isJson: true, url: '/businessStreet/addOrUpdateGoods', method: 'post', data: data_obj
  }).then(res => {
    console.log(res);
    if (res.data.code === 200) {
      success_fun(res)
    } else {
      wx.showToast({ title: '!200', icon: 'none' })
    }
  }).catch(err => {
    wx.showToast({ title: err + '', icon: 'none' })
  })
}

// 删除店铺
function deleteShop_fun(id, callback = () => { }) {
  $http({ isJson: true, method: 'post', url: '/businessStreet/delShop/' + id })
    .then(res => {
      console.log(res);
      if (res.data.code === 200) {
        wx.showToast({
          title: '删除店铺成功',
        })
        callback()
      }
    })
}

// 删除商品
function deleteGood_fun(id, callback = () => { }) {
  $http({ isJson: true, method: 'post', url: '/businessStreet/delGoods/' + id })
    .then(res => {
      console.log(res);
      if (res.data.code === 200) {
        callback()
      }
    })
}

// 删除商品同时判断是否隐藏商店
function deleteGood1_fun(id, callback = () => { }) {
  getGoods_fun({
    good_obj: { id }, success_fun: (res) => {
      let shopId = res.shopId
      deleteGood_fun(id, () => {
        getGoods_fun({
          good_obj: { shopId }, success_fun: (res) => {
            if (res.length === 0) {
              addOrUpdateShop_fun({
                shop_obj: { examined: 3 }, success_fun: () => {
                  callback(0)
                }
              })
            } else {
              callback(1)
            }
          }
        })
      })
    }
  })
}

module.exports = {
  getShops_fun, getGoods_fun, addOrUpdateShop_fun, addOrUpdateGood_fun, deleteShop_fun,
  deleteGood_fun, deleteGood1_fun
}