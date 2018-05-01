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
    currentName:'0',
    current:0,
    paused:true,
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
   * 初始化播放器
   */
  initBgAudioListManager:function(){
    const page = this;
    const self = globalBgAudioManager;
    const option = {
      
    };
  },
  /**
   * 通过名字来切换
   */
  selectName:function(event){
    var index = event.detail.current;
    globalBgAudioManager.pause();
    this.setData({
      playStatusImage: '../../images/play.png',
      current: index
    })
    this.changeContentView(this.data.musicData[index].image, this.data.musicData[index].name, '')
  },
  /**
   * 切换音乐
   */
  changeMusic:function(event){
    var index = event.detail.current;
    globalBgAudioManager.pause();
    this.setData({
      playStatusImage: '../../images/play.png',
      currentName: index
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
    //console.log(this.data.current)
  },
  /**
   * 播放或者暂停播放
   */
  playMusic: function () {
    var status = this.data.paused
    this.playTargetMusic(status);
  }, 
  /**
   * 播放目标音乐
   */
  playTargetMusic:function(status){
    var playStatusImage = ''
    const musicInfo = this.data.musicData[this.data.current]
    if (musicInfo.id != currentMusicInfo.id){
      globalBgAudioManager.title = musicInfo.name
      globalBgAudioManager.epname = musicInfo.name
      globalBgAudioManager.singer = musicInfo.composer
      globalBgAudioManager.coverImgUrl = musicInfo.image
      globalBgAudioManager.src = musicInfo.music
    }
    if(status){
      playStatusImage = '../../images/pause.png';
      globalBgAudioManager.play()
    }else{
      playStatusImage = '../../images/play.png';
      globalBgAudioManager.pause()
    }
    this.setData({
      paused: !status,
      playStatusImage: playStatusImage
    })
    console.log(globalBgAudioManager.duration())
    this.recordCurrentAudioInfo(musicInfo);
  },
  /**
   * 记录当前播放音乐信息
   */
  recordCurrentAudioInfo(musicInfo){
    currentMusicInfo = musicInfo;
    //console.log(currentMusicInfo);
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
    if (globalBgAudioManager.paused) {
      globalBgAudioManager.pause();
      this.setData({
        paused: globalBgAudioManager,
        playStatusImage : '../../images/play.png'
      })
    }else{

    }
    
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