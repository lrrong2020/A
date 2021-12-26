// index.js
// 获取应用实例
const regeneratorRuntime = require('../common/regenerator-runtime.js')
const app = getApp()



Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false,
    owner: false,
    displayQueue:[]
    //wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数

  onLoad() {
    this.checkUser()
    this.refresh()
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  


  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("res userinfo: "+res.userInfo)
      
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        //console.log(this.data.userInfo)

        const db = wx.cloud.database({})
        const queue = db.collection('queue')
        this.checkUser()
        console.log("owner: "+this.data.owner)

        db.collection('queue').add({
          data: {
            nickName: this.data.userInfo.nickName,
            avatar: this.data.userInfo.avatarUrl,
            inQueue: true
          }
        })
        .then(res => {
          
        })
      }
    })
  },
  enterRoom(e){
    console.log("enter room")
    // if(!this.data.owner){
    //   return
    // }
    Array.prototype.shuffle = function() {
      var array = this;
      var m = array.length,
          t, i;
      while (m) {
          i = Math.floor(Math.random() * m--);
          t = array[m];
          array[m] = array[i];
          array[i] = t;
      }
      return array;
  }
    const db = wx.cloud.database({})
    var shuffledMyQueue = app.globalData.myQueue.shuffle()
    for(var i = 0;i < shuffledMyQueue.length;++i){
      db.collection('role').add({
        data: {
          info: shuffledMyQueue[i]
        }
      })
      .then(res => {
      })
    }
  },

  refresh(e){
    const db = wx.cloud.database({})
    db.collection('queue').where({
      inQueue: true
    })
    .get({
      success: function(res) {
        app.globalData.myQueue = []
        const myQueue = app.globalData.myQueue
        //const theQueue = this.data.displayQueue
        for(var i = 0;i < res.data.length;++i){
          myQueue.push(res.data[i])
          //theQueue.push(res.data[i])
        }
        console.log("refresh myQueue")
        console.log(myQueue)
        //console.log(theQueue)
      }
    })
    this.setData({
      displayQueue: app.globalData.myQueue
    })
  },

  clearRoom(e){
    // if(!this.data.owner){
    //   return
    // }
    const db = wx.cloud.database({})
    db.collection('queue').where({
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        var idList = []
        for(var i = 0;i < res.data.length;++i){
          idList.push(res.data[i]._id)
        }

        for(var j = 0;j < idList.length;++j ){
          db.collection('queue').doc(idList[j]).remove({
            success: function(res) {
            }
          })
        }
      }
    })
    console.log("Queue cleared")

    db.collection('role').where({
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        var idList = []
        for(var i = 0;i < res.data.length;++i){
          idList.push(res.data[i]._id)
        }

        for(var j = 0;j < idList.length;++j ){
          db.collection('role').doc(idList[j]).remove({
            success: function(res) {
            }
          })
        }
      }
    })
    console.log("role cleared")
  },
  getRole(e){
    console.log("get role")
    const db = wx.cloud.database({})
    const role = app.globalData.role
    db.collection('role').where({})
    .get({
      success: function(res) {
        for(var i = 0;i < res.data.length;++i){
          role.push(res.data[i].info)
        }
        console.log("globalData.role:")
        console.log(role)
      }
    })
  },

  async checkUser () {
    const db = wx.cloud.database({})

    // user collection 设置权限为仅创建者及管理员可读写
    // 这样除了管理员之外，其它用户只能读取到自己的用户信息
    const user = await db.collection('queue').get()

    // 如果没有用户，跳转到登录页面登录
    if (!user.data.length) {
        app.globalData.hasUser = false
        app.globalData.owner = true
        this.data.owner = true
        return
    }

    
    const userinfo = user.data[0]
    //console.log("userinfo: "+userinfo)
    app.globalData.hasUser = true
    //app.globalData.id = userinfo._id
    app.globalData.nickName = userinfo.nickName
    //app.globalData.allData.albums = userinfo.albums

}

})
