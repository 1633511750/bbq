
Page({
  data: {
    showEdit: false,
    text: '你好，易语言'
  },

  btn_fun() {
    this.setData({
      showEdit: !this.data.showEdit
    })
  },

  input_fun(e) {
    this.setData({
      text: e.detail.value
    })
    console.log(this.data.text);
  }
})