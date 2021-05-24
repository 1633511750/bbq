
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
    console.log(e.currentTarget.dataset.index);
  }
})