// pages/home/home.js
let globalBgAudioManager = getApp().globalData.backgroundAudioManager;
var currentMusicInfo = getApp().globalData.currentMusicInfo;
var timer;
const hours=[];
const minutes = [];
for(let i = 0; i <= 12; i++){
  hours.push(i)
}
for (let i = 1; i <= 60; i++) {
  minutes.push(i)
}
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
    repeatStatus:true,//列表循环
    repeatStatusImage:'../../images/repeat.png',
    timerValue: 0,
    selectTimeArray:[],
    selectTimeIndex:0,
    showModalStatus:false,
    //timeSelect
    hours:hours,
    hour:0,
    minutes:minutes,
    minute:1,
    timeValue: [0,1],
    playCurrentTime:'00:00'
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
    
    /**
   * 音频自然结束更新
   */
    globalBgAudioManager.onEnded(function () {
      var index = that.data.currentName + 1;
      that.playTargetMusic(false);
      if (that.data.repeatStatus){
        if (index == that.data.musicData.length - 1){
          index = 0;
        }
        that.setData({
          playStatusImage: '../../images/play.png',
          currentName: index
        })
        console.log('12')
      }
      var time = setTimeout(function () {
        that.playTargetMusic(true);
      }, 300)
    })
    /**
     * 音频播放进度更新
     */
    globalBgAudioManager.onTimeUpdate(function(){
      var time = that.formatSeconds(globalBgAudioManager.duration - globalBgAudioManager.currentTime);
      if(time != '0:0'){
        that.setData({
          playCurrentTime: time
        })
      }
    })

    /**
     * 音频暂停
     */
    globalBgAudioManager.onPause(function(){
      currentMusicInfo.playCurrentTime = globalBgAudioManager.duration - globalBgAudioManager.currentTime;
      that.setData({
        playCurrentTime: that.formatSeconds(currentMusicInfo.playCurrentTime)
      })
      //console.log(currentMusicInfo.playCurrentTime)
    })
  },
  /**
   * 时间格式转换
   */
  formatSeconds(value){
    var min = Math.floor(value / 60);
    //var second = parseInt(value % 60);
    var second = Math.floor(value % 60) < 10 ? '0' + Math.floor(value % 60) : Math.floor(value % 60);
    return min+':'+second;
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
    
    if (globalBgAudioManager.paused == false) {
      this.playTargetMusic(false);
      console.log(globalBgAudioManager.paused)
    }
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
    globalBgAudioManager.pause();
    this.playTargetMusic(this.data.paused);
  }, 
  /**
   * 定时器选择器
   */
  bindClockChange:function(){
    var that = this;
    this.clearTimer();
    wx.showActionSheet({
      itemList: ['关闭', '10分钟后', '20分钟后', '30分钟后', '60分钟后', '自定义'],
      success: function(res){
        var index = res.tapIndex;
        var timeValue = 0;
        if (index == 0) {
          wx.showToast({
            title: '已关闭定时',
            icon: 'success',
            duration: 2000
          })
          return;
        }
        if (index == 5) {
          that.util('open')
        } else {
          if (index == 4) {
            timeValue = 6*600000;
          }else{
            timeValue = index * 600000;
          }
          that.timerStart(timeValue);
        }
      },
      fail:function(err){

      }
    })
  },
  /**
   * 自定义定时
   */
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      hour: this.data.hours[val[0]],
      minute: this.data.minutes[val[1]],
    })
  },
  /**
   * 确认是否开启定时
   */
  setClock:function(e){
    var currentStatu = e.currentTarget.dataset.statu;
    if(currentStatu == 'set'){
      var timeValue = this.data.hour * 60 + this.data.minute;
      this.timerStart(timeValue*60000);
    } else if (currentStatu == 'cancel'){
      this.setData({
        hour:0,
        minute:1
      })
    }
    this.util('close');
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  /**
   * 开启定时
   */
  timerStart: function(timeValue){
    var that = this;
    var showValue = timeValue;
    timer = setTimeout(function () {
      if (globalBgAudioManager.paused == false){
        that.playTargetMusic(false);
      }
    }, timeValue)
  },
  /**
   * 停止定时器
   */
  clearTimer:function(){
    if(timer){
      clearTimeout(timer);
    }
  },
  /**
   * 播放目标音乐
   */
  setMusic(){
    
  },
  playTargetMusic:function(status){
    var playStatusImage = ''
    const musicInfo = this.data.musicData[this.data.current]
    if (musicInfo.id != currentMusicInfo.id) {
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
      this.clearTimer();
    }
    this.setData({
      paused: !status,
      playStatusImage: playStatusImage
    })
    //console.log(globalBgAudioManager.duration())
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
      this.clearTimer();
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