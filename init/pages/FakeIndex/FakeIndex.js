// FakeIndex.js
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
    isOwner: false,
    displayQueue:[],
    displayRole:[],
    nickName:'',
    roleText: -1,
    roleChanged: false,
    hasRole: false

  },
  onshow(){
    if(this.data.hasUserInfo && this.data.displayQueue.length == 0){
      console.log("危险")
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'请点击右上角三个点 → "重新进入小程序"',
      })
    }
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
        displayQueue: app.globalData.myQueue
      })
    }
    // this.refresh()
    const that = this
    const db = wx.cloud.database()
    const watcher = db.collection('queue')
      .where({})
      .watch({
        onChange: function(snapshot) {
          // console.log('docs\'s changed events', snapshot.docChanges)
          // console.log('query result snapshot after the event', snapshot.docs)
          // console.log('is init data', snapshot.type === 'init')
          // console.log("Test Interval 0")

          // console.log("Test Interval 2")
          
          //refresh
               
          setTimeout(() => {
            that.checkUser()
            console.log("Auto Update")
            that.setData({displayQueue: snapshot.docs})
            app.globalData.myQueue = snapshot.docs
            console.log("global: ")
            console.log(app.globalData.myQueue)

          }, 3000);
        },
        onError: function(err) {
          console.error('the watch closed because of error', err)
        }
      })

      const watcher1 = db.collection('role')
      .where({})
      .watch({
        onChange: function(snapshot) {
          console.log('docs\'s changed events', snapshot.docChanges)
          console.log('query result snapshot after the event', snapshot.docs)
          console.log('is init data', snapshot.type === 'init')
          if(snapshot.docChanges.length > 0){          
            console.log("Role changed")
          that.setData({roleChanged: true})

        }

        },
        onError: function(err) {
          
        }

      })
      //  watcher.close()
  },

  async getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("res userinfo: "+res.userInfo)
      
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          displayQueue: app.globalData.myQueue
        })

        //console.log(this.data.userInfo)

        const db = wx.cloud.database({})
        const queue = db.collection('queue')
        console.log("isOwner: "+this.data.isOwner)

        //如果已经存在于数据库中 而且不应该超过10人
        // const exist = await db.collection('queue').get()
        // db.collection('queue').where({})
        //   .get({
        //     success: function(res) {
        //     // res.data 是包含以上定义的两条记录的数组
        //     var avatarList = []
        //     for(var i = 0;i < res.data.length;++i){
        //       if(res.data[i]._avatar == this.data.userInfo.avatarUrl){
                
        //         return
        //       }
        //       else{
        //         avatarList.push(res.data[i]._avatar)
        //       }

        //     }

        //     //借用id实现多记录删除
        //     // for(var j = 0;j < idList.length;++j ){
        //     //   db.collection('queue').doc(idList[j]).remove({
        //     //     success: function(res) {
        //     //     }
        //     //   })
        //     // }
        //   }
        // })


        db.collection('queue').add({
          data: {
            nickName: this.data.userInfo.nickName,
            avatar: this.data.userInfo.avatarUrl
          }
        })
        .then(res => {
          this.setData({
            displayQueue: app.globalData.myQueue
          })
          // return "200"
        })
      }
    })
  },
  enterRoom(e){
    this.checkUser()
    console.log("enter room")
    //isOwner only (may be only visible to the onwer)
    // if(!this.data.isOwner){
    //   return
    // }

    //shuffle users in queue
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

    //append shuffled queue to role
    const db = wx.cloud.database({})
    // var shuffledMyQueue = app.globalData.myQueue.shuffle()
    var shuffledMyQueue = this.data.displayQueue.shuffle()
    for(var i = 0;i < shuffledMyQueue.length;++i){
      db.collection('role').add({
        data: {
          info: shuffledMyQueue[i]
        }
      })
      .then(res => {
      })
    }
    console.log('shuffledMyQueue')
    console.log(shuffledMyQueue)
  },

  async refresh(e){
    this.checkUser()

    console.log("refreshing myQueue")

    //successfully upload user profile and then refresh

    // const code = await this.getUserProfile()
    // console.log("code")
    // console.log(code)

    const db = wx.cloud.database({})
    db.collection('queue').where({})
    .get({
      success: function(res) {
        app.globalData.myQueue = []//clear existent queue
        const myQueue = app.globalData.myQueue
        //const theQueue = this.data.displayQueue

        for(var i = 0;i < res.data.length;++i){
          myQueue.push(res.data[i])
          //theQueue.push(res.data[i])
          //dq.push(res.data[i])
        }
        console.log('myQueue:')
        console.log(myQueue)
        //console.log(theQueue)
      }
    })
    this.setData({
      displayQueue: app.globalData.myQueue
    })

    console.log("this.data")
    console.log(this.data)
  },

  clearRoom(e){
    //to clear queue and role

    //isOwner only

    // if(!this.data.isOwner){
    //   return
    // }
    this.checkUser()

    const db = wx.cloud.database({})
    db.collection('queue').where({})
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        var idList = []
        for(var i = 0;i < res.data.length;++i){
          idList.push(res.data[i]._id)
        }
        console.log(idList)
        //借用id实现多记录删除
        for(var j = 0;j < idList.length;++j ){
          db.collection('queue').doc(idList[j]).remove({
            success: function(res) {
              console.log("remove success")
              console.log(res)
            }
          })
        }
      }
    })
    console.log("Queue cleared")

    db.collection('role').where({})
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
              console.log("remove success")
              console.log(res)
            }
          })
        }
      }
    })
    console.log("role cleared")

    wx.cloud.callFunction({
      // 云函数名称
      name: 'add',
      // 传给云函数的参数
      data: {
      },
    })
    .then(res => {
      console.log(res.result) // 3
    })
    .catch(console.error)
    console.log("fellow cleared")
  },


  getRole(e){
    // this.checkUser()
    console.log("getting role")
    const userInfo = this.data.userInfo
    const db = wx.cloud.database({})
    const role = app.globalData.role
    var roleNo = -1

    db.collection('role').where({})
    .get({
      success: function(res) {
        for(var i = 0;i < res.data.length;++i){
          role.push(res.data[i].info)
        }
        // this.setData({
        //   displayRole: app.globalData.role
        // })
        console.log("shuffled role from Database")
        console.log(role)
        var nm = userInfo.nickName

        for(var i = 0;i < role.length;++i){
          if(role[i].nickName == nm){
            roleNo = i

            break
          }
        }
        app.globalData.roleNo_G = roleNo
        // console.log("roleNo:")
        // console.log(roleNo)
        // console.log("a")
        // console.log(app.globalData.roleNo_G)
        // console.log("b")

          wx.navigateTo({
            url: '/pages/roles/0',
          })
          // this.setData({hasRole: true})
      }

    })
  },
  getRoleNo(){

  },

  async checkUser () {
    const db = wx.cloud.database({})
    // user collection 设置权限为仅创建者及管理员可读写
    // 这样除了管理员之外，其它用户只能读取到自己的用户信息
    const user = await db.collection('queue').get()

    // 如果没有用户，跳转到登录页面登录
    if (user.data.length < 2) {
        app.globalData.hasUser = false
        app.globalData.isOwner = true
        this.setData({isOwner: true})
    }
    const userinfo = user.data[0]
    //console.log("userinfo: "+userinfo)
    app.globalData.hasUser = true
    //app.globalData.id = userinfo._id
    // app.globalData.nickName = userinfo.nickName
    //app.globalData.allData.albums = userinfo.albums

},

onclickProfile(e){
  if(this.isOwner){
    // console.log('kickout player')
  }
  const id = e.target.id
  console.log(id)
  console.log(app.globalData.myQueue[id])

  // const query = wx.createSelectorQuery()
  // query.select(id).style.color = "red" 
},

testCloud(e){
  wx.cloud.callFunction({
    // 云函数名称
    name: 'add',
    // 传给云函数的参数
    data: {
    },
  })
  .then(res => {
    console.log(res.result) // 3
  })
  .catch(console.error)
},

seeRole(e){
    wx.navigateTo({
      url: '/pages/roles/0',
    })
  // console.log(app.globalData.roleNo_G)
},

drive(e){
  wx.navigateTo({
    url: '/test/test',
  })

}
})
