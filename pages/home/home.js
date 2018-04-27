// pages/home/home.js
let globalBgAudioManager = getApp().globalData.backgroundAudioManager;
var currentMusicInfo = getApp().globalData.currentMusicInfo;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicData:[],
    bgImg:'',
    typeTitle:'',
    current:0,
    paused:globalBgAudioManager.paused,
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
    this.initBgAudioListManager();
    if (JSON.stringify(currentMusicInfo) != '{}'){
      console.log(currentMusicInfo);
      this.changeContentView(currentMusicInfo.image, currentMusicInfo.name, currentMusicInfo.id)
    }
    if(this.data.paused){
      playStatusImage = '../../images/play.png';
      globalBgAudioManager.pause();
    }else{

    }
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
        }
    })
  },
  /**
   * 获取当前播放音频
   */
  getcurrentAudio:function(){
    if(globalBgAudioManager.name != currentMusicInfo.name){
      
    }
  },
  /**
   * 初始化播放器
   */
  initBgAudioListManager:function(){
    const page = this;
    const self = globalBgAudioManager;
    const option = {
      
    };
  },
  /**
   * 切换音乐
   */
  changeMusic:function(event){
    this.data.current = event.detail.current;
    var index = this.data.current;
    globalBgAudioManager.pause();
    this.setData({
      playStatusImage: '../../images/play.png'
    })
    this.changeContentView(this.data.musicData[index].image, this.data.musicData[index].name,'')
  },
  /**
   * 修改视图
   */
  changeContentView:function(bgImg,typeTitle,current){
    this.setData({
      bgImg: bgImg,
      typeTitle: typeTitle,
    })
    if(current != ''){
      this.setData({
        current: current
      })
    }
  },
  /**
   * 播放或者暂停播放
   */
  playMusic: function () {
    var that = this;
    var playStatusImage = '';
    
    if (this.data.playStatus){
      playStatusImage = '../../images/pause.png';
      //console.log(musicData[0].music)
      this.playTargetMusic(1);
    }else{
      playStatusImage = '../../images/play.png';
      this.playTargetMusic(0);
    }
    this.data.playStatus = !this.data.playStatus;
    that.setData({
      playStatusImage: playStatusImage
    })
  }, 
  /**
   * 播放目标音乐
   */
  playTargetMusic:function(status){
    const musicInfo = this.data.musicData[this.data.current]
    if (musicInfo.id != currentMusicInfo.id){
      globalBgAudioManager.title = musicInfo.name
      globalBgAudioManager.epname = musicInfo.name
      globalBgAudioManager.singer = 'TT'
      globalBgAudioManager.coverImgUrl = musicInfo.image
      globalBgAudioManager.src = musicInfo.music
    }
    if(status == 1){
      globalBgAudioManager.play()
    }else{
      globalBgAudioManager.pause()
    }
    this.recordCurrentAudioInfo(musicInfo);
  },
  /**
   * 记录当前播放音乐信息
   */
  recordCurrentAudioInfo(musicInfo){
    currentMusicInfo = musicInfo;
    console.log(currentMusicInfo);
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