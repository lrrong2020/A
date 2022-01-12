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
    hasFellow2:false,
    hasFellow3:false,
    hasFellow4:false,
    hasFellow5:false,
    displayFellow: [],
    displayFellow2: [],
    displayFellow3: [],
    displayFellow4: [],
    displayFellow5: [],
    displayVote:[],
    isLeader: false,
    isGoddess: false,
    isAssa: app.globalData.isAssa,
    votes1: [1],
    votes2: [2],
    votes3: [3],
    votes4: [4],
    votes5: [5],
    canGo: app.globalData.canGo,
    isBegun:false,
    queueIdx: -1,
    inFellow: false

  },
  onShow(){
    this.setData({
      canGo: app.globalData.canGo,    
      isAssa: app.globalData.isAssa,
    })
    if((this.data.hasUserInfo && this.data.displayQueue.length == 0) || (this.data.hasUserInfo && this.data.queueIdx == -1)){
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'房间已经被清理或你已经被踢出房间. 如要重新进入房间, 请点击右上角三个点 → "重新进入小程序"'
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
    // var currentRound = this.data.currentRound


   
    const displayQueue = this.data.displayQueue
    const db = wx.cloud.database()
    const watcher = db.collection('queue')
      .where({})
      .watch({
        onChange: function(snapshot) {
          // console.log("curentRound:")
          // console.log(curentRound)

          if(snapshot.docChanges.length > 0 && (snapshot.docChanges[0].dataType == "add" || snapshot.docChanges[0].dataType == "update")){
          // console.log('docs\'s changed events', snapshot.docChanges)
          // console.log('query result snapshot after the event', snapshot.docs)
          // console.log('is init data', snapshot.type === 'init')
          // console.log("Test Interval 0")
          // console.log("Test Interval 2")
          
          //refresh
          setTimeout(() => {
            that.checkUser()
            const avt = that.data.userInfo.avatarUrl
            let doc = snapshot.docs
            if(avt != doc[0].avatar){
              that.setData({isOwner: false})
            }
            else{
              that.setData({isOwner: true})
            }
            let idx = -1
            for(let i = 0; i < doc.length;++i){
              if(doc[i].avatar == avt){
                idx = i
                that.setData({queueIdx: idx})
                break
              }
            }
            // console.log("idx: " + idx)
            console.log("Auto Update")
            var isLeader = doc[idx].isLeader//???????????????????????????????
            var isGoddess = doc[idx].isGoddess
            console.log("isLeader:" + isLeader)
            console.log("isGoddess:" + isGoddess)
            that.setData({
              displayQueue: snapshot.docs,
              isLeader: isLeader,
              isGoddess: isGoddess,
            })
            app.globalData.myQueue = snapshot.docs
            // console.log("global.myQueue ")
            // console.log(app.globalData.myQueue)
          }, 5000);
 
          }
          if(snapshot.docChanges.length > 0 && snapshot.docChanges[0].dataType == "remove"){
            console.log(snapshot.docChanges[0])
            if(snapshot.docChanges[0].doc.avatar == that.data.userInfo.avatarUrl){
              that.setData({
                queueIdx: -1
              })
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
            }, 2000);
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
          that.refresh()
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
              if(snapshot.type != 'init'){
                app.globalData.currentFrame = 1
                console.log("[0]app.globalData.currentFrame: "+app.globalData.currentFrame)
                getApp().globalData.canGo = true
              }

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





            const watcher3 = db.collection('fellow2')
        .where({})
        .watch({
          onChange: function(snapshot) {
            if(snapshot.type != 'init'){
              app.globalData.currentFrame = 2
              console.log("[1]app.globalData.currentFrame: "+app.globalData.currentFrame)
              getApp().globalData.canGo = true
            }
            // console.log('docs\'s changed events', snapshot.docChanges)
            // console.log('query result snapshot after the event', snapshot.docs)
            // console.log('is init data', snapshot.type === 'init')
            if(snapshot.docChanges.length > 0){          
              console.log("fellow2 changed")
              that.setData({
                hasFellow2: true,
                hasFellow2: app.globalData.hasFellow2,
                displayFellow2: app.globalData.fellow2
              })

          }
          },
          onError: function(err) {
          }
        })


        const watcher4 = db.collection('fellow3')
          .where({})
          .watch({
            onChange: function(snapshot) {
              if(snapshot.type != 'init'){
                app.globalData.currentFrame = 3
                console.log("[2]app.globalData.currentFrame: "+app.globalData.currentFrame)
                getApp().globalData.canGo = true
              }
              const watcher4 = db.collection('fellow3')
              // console.log('docs\'s changed events', snapshot.docChanges)
              // console.log('query result snapshot after the event', snapshot.docs)
              // console.log('is init data', snapshot.type === 'init')
              if(snapshot.docChanges.length > 0){          
                console.log("fellow3 changed")
                that.setData({
                  hasFellow3: true,
                  hasFellow3: app.globalData.hasFellow3,
                  displayFellow3: app.globalData.fellow3
                })

            }
            },
            onError: function(err) {
            }
          })
          //  watcher.close()



          const watcher5 = db.collection('fellow4')
      .where({})
      .watch({
        onChange: function(snapshot) {
          if(snapshot.type != 'init'){
            app.globalData.currentFrame = 4
            console.log("[3]app.globalData.currentFrame: "+app.globalData.currentFrame)
            getApp().globalData.canGo = true
          }
          // console.log('docs\'s changed events', snapshot.docChanges)
          // console.log('query result snapshot after the event', snapshot.docs)
          // console.log('is init data', snapshot.type === 'init')
          if(snapshot.docChanges.length > 0){          
            console.log("fellow4 changed")
            that.setData({
              hasFellow4: true,
              hasFellow4: app.globalData.hasFellow4,
              displayFellow4: app.globalData.fellow4
            })

        }
        },
        onError: function(err) {
        }
      })




          const watcher6 = db.collection('fellow5')
          .where({})
          .watch({
            onChange: function(snapshot) {
              if(snapshot.type != 'init'){
                app.globalData.currentFrame = 5
                console.log("[4]app.globalData.currentFrame: "+app.globalData.currentFrame)
              }
              // console.log('docs\'s changed events', snapshot.docChanges)
              // console.log('query result snapshot after the event', snapshot.docs)
              // console.log('is init data', snapshot.type === 'init')
              if(snapshot.docChanges.length > 0){          
                console.log("fellow5 changed")
                that.setData({
                  hasFellow5: true,
                  hasFellow5: app.globalData.hasFellow5,
                  displayFellow5: app.globalData.fellow5
                })

            }
            },
            onError: function(err) {
            }
          })

  },


  async getUserProfile(e) {

    console.log("Login")
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

        app.globalData.userInfo = res.userInfo
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
            nickName: res.userInfo.nickName,
            avatar: res.userInfo.avatarUrl,
            isLeader: false,
            isGoddess: false
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
    let renshu = "队列中人数: " + this.data.displayQueue.length + "/10"
    const that = this
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"你确定要开始游戏吗?",
      content: renshu,
      success:function(res){
        if(res.cancel){
          return
        }
        if(res.confirm){
          
    that.setData({isBegun: true})
    that.checkUser()

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

  console.log(1)
    //append shuffled queue to role
    const db = wx.cloud.database({})
    console.log(2)
    //pick leader
    db.collection('queue').where({})
    .get({
      success: function(res) {
        console.log(3)
        // res.data 是包含以上定义的两条记录的数组
        var idList = []
        for(var i = 0;i < res.data.length;++i){
          idList.push(res.data[i]._id)
        }
        console.log(idList)
        //借用id实现随机选择
        console.log(4)
        //rd 0 ~ queue.length-1
        let rd = Math.floor(Math.random() * that.data.displayQueue.length)
        console.log("rd: " + rd)
        console.log(5)
        db.collection('queue').doc(idList[rd]).update({
          data:{
            isLeader: true
          },
          success: function(res) {
            console.log("success rd")
            console.log(res)
          },
          fail: function(res){
            console.log("fail rd")
            console.log(res)
          }
        })
        console.log(6)
      }
    })



    console.log(6)


    // var shuffledMyQueue = app.globalData.myQueue.shuffle()
    var shuffledMyQueue = that.data.displayQueue.shuffle()
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
        }
      }
    })

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
           name: 'add2',
           // 传给云函数的参数
           data: {
           },
         })
         .then(res => {
           // console.log(res.result) // 3
         })
         .catch(console.error)
         console.log("fellow2 cleared")


         

         wx.cloud.callFunction({
           // 云函数名称
           name: 'add3',
           // 传给云函数的参数
           data: {
           },
         })
         .then(res => {
           // console.log(res.result) // 3
         })
         .catch(console.error)
         console.log("fellow3 cleared")

         wx.cloud.callFunction({
          // 云函数名称
          name: 'add4',
          // 传给云函数的参数
          data: {
          },
        })
        .then(res => {
          // console.log(res.result) // 3
        })
        .catch(console.error)
        console.log("fellow4 cleared")

        wx.cloud.callFunction({
          // 云函数名称
          name: 'add5',
          // 传给云函数的参数
          data: {
          },
        })
        .then(res => {
          // console.log(res.result) // 3
        })
        .catch(console.error)
        console.log("fellow5 cleared")

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
        var avt = userInfo.avatarUrl
        //需要换成avatar否则发身份有问题

                    
        // console.log(avt)
        for(var i = 0;i < role.length;++i){
          // if(role[i].nickName == nm){
            // console.log(role[i].avatar)
        if(role[i].avatar == avt){

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
  const that = this
  if(this.data.isOwner && (!this.data.isBegun)){

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


  }

  else if(that.data.isAssa){
    let leaderText = app.globalData.myQueue[e.target.id].isLeader?"(此轮车长)":""
    let assText = "你确定要刺杀 " + app.globalData.myQueue[e.target.id].nickName + leaderText + " 吗?"
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"猎杀时刻",
      content: assText,
      success:function(res){
        if(res.confirm){
          console.log(that.data.displayQueue[that.data.queueIdx].nickName + " 刺杀了 " + app.globalData.myQueue[e.target.id].nickName)
        }
      }
    })
    return
  }
  else{
    let leaderText = app.globalData.myQueue[e.target.id].isLeader?"(此轮车长)":""
    let content = app.globalData.myQueue[e.target.id].nickName + leaderText
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"玩家昵称",
      content: content
    })
    return
  }
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

})