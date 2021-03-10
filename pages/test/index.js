
Page({
  data: {
    flag: true,
  },
  showMask: function () {
    this.setData({ flag: false })
  },
  closeMask: function () {
    this.setData({ flag: true })
  }
})