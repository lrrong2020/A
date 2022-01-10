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
    hasRole: false,
    hasFellow: false,
    displayFellow: [],
    displayVote:[]

  },
  onShow(){

    if(this.data.hasUserInfo && this.data.displayQueue.length == 0){

      wx.showModal({
        cancelColor: 'cancelColor',
        title:'房间已经被清理. 请点击右上角三个点 → "重新进入小程序"'
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
          
          if(snapshot.docChanges.length > 0 && snapshot.docChanges[0].dataType == "add"){
          // console.log('docs\'s changed events', snapshot.docChanges)
          // console.log('query result snapshot after the event', snapshot.docs)
          // console.log('is init data', snapshot.type === 'init')
          // console.log("Test Interval 0")

          // console.log("Test Interval 2")
          
          //refresh
          setTimeout(() => {
            that.checkUser()
            let doc = snapshot.docs
            // console.log(doc)
            if(that.data.userInfo.avatarUrl != doc[0].avatar){
              that.setData({isOwner: false})
            }
            else{
              that.setData({isOwner: true})
            }
            console.log("Auto Update")
            that.setData({
              displayQueue: snapshot.docs        
              // hasFellow: app.globalData.hasFellow,
              // displayFellow: app.globalData.fellow
            })
            app.globalData.myQueue = snapshot.docs
            // console.log("global.myQueue ")
            // console.log(app.globalData.myQueue)
          }, 3000);
 
          }
          if(snapshot.docChanges.length > 0 && snapshot.docChanges[0].dataType == "remove"){
            console.log(snapshot.docChanges[0])
            if(snapshot.docChanges[0].doc.avatar == that.data.userInfo.avatarUrl){
              wx.showModal({
                cancelColor: 'cancelColor',
                title:'你已经被房主踢出',
                content:'拜拜咯'
              })
            }
            setTimeout(() => {
              that.checkUser()
              console.log("Auto Update")
              that.setData({
                displayQueue: snapshot.docs        
              })
              app.globalData.myQueue = snapshot.docs
            }, 3000);
          }
          
        },
        onError: function(err) {
          console.error('the watch closed because of error', err)
        }
      })

      const watcher1 = db.collection('role')
      .where({})
      .watch({
        onChange: function(snapshot) {
          // console.log('docs\'s changed events', snapshot.docChanges)
          // console.log('query result snapshot after the event', snapshot.docs)
          // console.log('is init data', snapshot.type === 'init')
          if(snapshot.docChanges.length > 0){          
            console.log("Role changed")
          that.setData({roleChanged: true})
        }

        },
        onError: function(err) {
          
        }

      })

      const watcher2 = db.collection('fellow')
      .where({})
      .watch({
        onChange: function(snapshot) {
          // console.log('docs\'s changed events', snapshot.docChanges)
          // console.log('query result snapshot after the event', snapshot.docs)
          // console.log('is init data', snapshot.type === 'init')
          if(snapshot.docChanges.length > 0){          
            console.log("fellow changed")
            that.setData({
              hasFellow: true,
              hasFellow: app.globalData.hasFellow,
              displayFellow: app.globalData.fellow
            })
            // console.log("global.hasFellow")
            // console.log(app.globalData.hasFellow)
            // console.log("global.fellow")
            // console.log(app.globalData.fellow)
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
        console.log("res userinfo: ")
        console.log(res)
      
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
    this.checkUser()
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"你确定要清理房间吗?",
      success:function(res){
        if(res.confirm){
          //to clear queue and role

          //isOwner only

          // if(!this.data.isOwner){
          //   return
         // }
         const db = wx.cloud.database({})
         db.collection('queue').where({})
         .get({
           success: function(res) {
             // res.data 是包含以上定义的两条记录的数组
             var idList = []
             for(var i = 0;i < res.data.length;++i){
               idList.push(res.data[i]._id)
             }
             // console.log(idList)
             //借用id实现多记录删除
             for(var j = 0;j < idList.length;++j ){
               db.collection('queue').doc(idList[j]).remove({
                 success: function(res) {
                   // console.log("remove success")
                   // console.log(res)
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
                   // console.log("remove success")
                   // console.log(res)
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
           // console.log(res.result) // 3
         })
         .catch(console.error)
         console.log("fellow cleared")
         wx.cloud.callFunction({
           // 云函数名称
           name: 'addd',
           // 传给云函数的参数
           data: {
           },
         })
         .then(res => {
           // console.log(res.result) // 3
         })
         .catch(console.error)
         console.log('vote cleared')    
        }
      }
    })

   
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
        //需要换成avatar否则发身份有问题
         //需要换成avatar否则发身份有问题
          //需要换成avatar否则发身份有问题
           //需要换成avatar否则发身份有问题
            //需要换成avatar否则发身份有问题
             //需要换成avatar否则发身份有问题
              //需要换成avatar否则发身份有问题
               //需要换成avatar否则发身份有问题
                //需要换成avatar否则发身份有问题
                 //需要换成avatar否则发身份有问题
                  //需要换成avatar否则发身份有问题
                   //需要换成avatar否则发身份有问题
                    //需要换成avatar否则发身份有问题
                    

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
    if (user.data.length < 1) {
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
  if(this.data.isOwner == false){
    // console.log('kickout player')
    return
  }

  let displayContent = "你确定要将" + app.globalData.myQueue[e.target.id].nickName + "踢出房间吗?"
  wx.showModal({
    cancelColor: 'cancelColor',
    title:'踢出房间',
    content: displayContent,
    success: function(res){
      if(res.confirm){
        const realId = app.globalData.myQueue[e.target.id]._id
        // console.log(realId)

        const db = wx.cloud.database({})
        db.collection('queue').doc(realId).remove({
          success: function(res) {
          }
        })
      }
    }
  })

  

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

},

clickYes(e){
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
  const that = this
  this.setData({hasFellow: false})

  const db = wx.cloud.database({})
  db.collection('vote').add({
    data: {
      nickName: this.data.userInfo.nickName,
      avatar: this.data.userInfo.avatarUrl,
      hasVote: true,
      voteRes: [true, null, null, null, null]
    }
  })
  .then(res => {
    wx.showModal({
      cancelColor: 'cancelColor',
      title:'投票成功!'
    })
  })

  const watcher3 = db.collection('vote')
  .where({})
  .watch({
    onChange: function(snapshot) {
      // console.log('docs\'s changed events', snapshot.docChanges)
      // console.log('query result snapshot after the event', snapshot.docs)
      // console.log('is init data', snapshot.type === 'init')
      if(snapshot.docChanges.length == that.data.displayQueue.length){          
        that.setData({
          displayVote:snapshot.docs.shuffle()
        })
    }
    },
    onError: function(err) {
    }

  })
},


clickNo(e){
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
  const that = this
  this.setData({hasFellow: false})

  const db = wx.cloud.database({})
  db.collection('vote').add({
    data: {
      nickName: this.data.userInfo.nickName,
      avatar: this.data.userInfo.avatarUrl,
      hasVote: true,
      voteRes: [false, null, null, null, null]
    }
  })
  .then(res => {
    wx.showModal({
      cancelColor: 'cancelColor',
      title:'投票成功!'
    })
  })

  const watcher3 = db.collection('vote')
  .where({})
  .watch({
    onChange: function(snapshot) {
      // console.log('docs\'s changed events', snapshot.docChanges)
      // console.log('query result snapshot after the event', snapshot.docs)
      // console.log('is init data', snapshot.type === 'init')
      if(snapshot.docChanges.length == that.data.displayQueue.length){          
        that.setData({
          displayVote:snapshot.docs.shuffle()
        })
    }
    },
    onError: function(err) {
    }

  })
},
})
