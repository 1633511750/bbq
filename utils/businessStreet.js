import { $http } from '../utils/util'
/**
 * 创业街模块
 */

// 获取店铺
function getShops_fun({ data_obj = {}, success_fun = () => { } }) {
  $http({
    isJson: true, url: '/businessStreet/getShops', method: 'post', data: { ...data_obj, pageSize: 20 }
  }).then(res => {
    console.log(res);
    if (res.data.code === 200) {
      success_fun(res)
    } else {
      wx.showToast({ title: '!200', icon: 'none' })
    }
  }).catch(err => {
    wx.showToast({ title: err, icon: 'none' })
  })
}

// 获取商品
function getGoods_fun() {

}

// 更新/添加店铺
function addOrUpdateShop_fun() {

}

// 更新/添加商品
function addOrUpdateGood_fun() {

}

// 删除店铺
function deleteShop_fun() {

}

// 删除商品
function deleteGood_fun() {

}

module.exports = {
  getShops_fun, getGoods_fun, addOrUpdateShop_fun, addOrUpdateGood_fun, deleteShop_fun, deleteGood_fun
}