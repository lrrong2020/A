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
    displayQueue:[],
    displayRole:[],
    nickName:'',
    roleTextList:[]
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
          console.log('docs\'s changed events', snapshot.docChanges)
          console.log('query result snapshot after the event', snapshot.docs)
          console.log('is init data', snapshot.type === 'init')
          // console.log("Test Interval 0")

          // console.log("Test Interval 2")
          
          //refresh
          
          
          setTimeout(() => {
            console.log("Auto Update")
            that.setData({displayQueue: snapshot.docs})
          }, 3000);


        },
        onError: function(err) {
          console.error('the watch closed because of error', err)
        }
      })
      //  watcher.close()
  },

  getUserProfile(e) {
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
        console.log("owner: "+this.data.owner)

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
          return "200"
        })
      }
    })
  },
  enterRoom(e){
    this.checkUser()
    console.log("enter room")
    //owner only (may be only visible to the onwer)
    // if(!this.data.owner){
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

    //owner only


    // if(!this.data.owner){
    //   return
    // }

    this.checkUser()

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
        //借用id实现多记录删除
        for(var j = 0;j < idList.length;++j ){
          db.collection('queue').doc(idList[j]).remove({
            success: function(res) {
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
            }
          })
        }
      }
    })
    console.log("role cleared")
  },


  getRole(e){
    // this.checkUser()
    console.log("getting role")
    const userInfo = this.data.userInfo
    const db = wx.cloud.database({})
    const role = app.globalData.role
    const roleTextList = this.data.roleTextList
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
        console.log("roleNo:")
        console.log(roleNo)
        console.log("a")
        roleTextList.push(roleNo)
        console.log("b")

        console.log("c")
        // switch(roleNo){
        //   case 0:
        //     break
        //   case 1:
        //     break
        //   case 2:
        //     break
        // }
      }
      
    })
    this.setData({
      roleTextList
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

},

onclickProfile(e){
  if(this.owner){
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
      a: 1,
      b: 2,
    },
  })
  .then(res => {
    console.log(res.result) // 3
  })
  .catch(console.error)
},



})
