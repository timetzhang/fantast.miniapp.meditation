// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicData:[],
    bgImg:'',
    typeTitle:'',
    playStatus:true,
    playStatusImage:'../../images/play.png',
    repeatStatus:true,
    repeatStatusImage:'../../images/repeat.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    wx.request({
      url: 'https://www.zhangtt.cn/meditation/getscenes',
      data:{},
      method:'GET',
      header: {'Accept':'application/json'},
      success: function(res) {
          that.setData({
            musicData: res.data,
            bgImg: res.data[0].image,
            typeTitle: res.data[0].name
          })
          console.log(that.data.musicData);
        }
    })
  },
  /**
   * 切换音乐
   */
  changeMusic:function(event){
    console.log(event.detail.current);
    var that = this;
    var index = event.detail.current;
    that.setData({
      bgImg: that.data.musicData[index].image,
      typeTitle: that.data.musicData[index].name
    })
  },
  /**
   * 播放或者暂停播放
   */
  playMusic: function () {
    var that = this;
    var playStatusImage = '';
    if (this.data.playStatus){
      playStatusImage = '../../images/pause.png';
    }else{
      playStatusImage = '../../images/play.png';
    }
    this.data.playStatus = !this.data.playStatus;
    that.setData({
      playStatusImage: playStatusImage
    })
  },
  /**
   * 循环状态
   */
  repeatStatus:function(){
    var that = this;
    var repeatStatusImage = '';
    if (this.data.repeatStatus) {
      repeatStatusImage = '../../images/rotate.png';
    } else {
      repeatStatusImage = '../../images/repeat.png';
    }
    this.data.repeatStatus = !this.data.repeatStatus;
    that.setData({
      repeatStatusImage: repeatStatusImage
    })
    console.log(this.data.repeatStatusImage)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})