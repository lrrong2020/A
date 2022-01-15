// FakeIndex.js
// 获取应用实例

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
    wasGoddess:false,
    isAssa: app.globalData.isAssa,
    votes0: -1,
    votes1: -1,
    votes2: -1,
    votes3: -1,
    votes4: -1,
    canGo: app.globalData.canGo,
    isBegun:false,
    queueIdx: -1,
    inFellow: false,
    fellowNo:[3,4,4,5,5],
    successGames:0,
    failGames:0,
    canSetGod: false,
  },

  onShow(){
    this.refresh()
    const that = this
    setTimeout(() => {
      that.refresh()
    }, 1000)

    this.setData({
      canGo: app.globalData.canGo,    
      isAssa: app.globalData.isAssa,
    })
    // if((this.data.hasUserInfo && this.data.displayQueue.length == 0) || (this.data.hasUserInfo && this.data.queueIdx == -1)){
    //   wx.showModal({
    //     cancelColor: 'cancelColor',
    //     title:'房间已经被清理或你已经被踢出房间. 如要重新进入房间, 请点击右上角三个点 → "重新进入小程序"'
    //   })
    // }

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
            var wasGoddess = doc[idx].wassGoddess

            that.setData({
              displayQueue: snapshot.docs,
              isLeader: isLeader,
              isGoddess: isGoddess,
              wasGoddess: wasGoddess,
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
          // console.error('the watch closed because of error', err)
          // wx.showModal({
          //   cancelColor: 'cancelColor',
          //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
          // })
          // wx.showModal({
          //   cancelColor: 'cancelColor',
          //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
          // })
        }
      })

      const watcher1 = db.collection('role')
      .where({})
      .watch({
        onChange: function(snapshot) {
          // that.refresh()

          // console.log('docs\'s changed events', snapshot.docChanges)
          // console.log('query result snapshot after the event', snapshot.docs)
          // console.log('is init data', snapshot.type === 'init')
          if(snapshot.type != 'init'){
            // wx.showModal({
            //   cancelColor: 'cancelColor',
            //   title:"游戏开始",
            //   content:"请查看你的身份牌"
            // })

            // console.log("Role changed")
          that.setData({roleChanged: true})
        }

        },
        onError: function(err) {
          // wx.showModal({
          //   cancelColor: 'cancelColor',
          //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
          // })
          // wx.showModal({
          //   cancelColor: 'cancelColor',
          //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
          // })
        }

      })




              const watcher2 = db.collection('fellow')
          .where({})
          .watch({
            
            onChange: function(snapshot) {
              if(snapshot.type != 'init'){
                app.globalData.currentFrame = 1
                console.log("[0]app.globalData.currentFrame: "+app.globalData.currentFrame)
                getApp().globalData.canGo = false
                that.setData({
                  canGo: false
                })
                if(that.data.votes0 != -1){
                  getApp().globalData.canGo = true
                  that.setData({
                    canGo: true,
                    canSetGod: false
                  })
                }
                else{
                  getApp().globalData.canGo = false
                  that.setData({
                    canGo: false,

                  })
                }

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

                const avt = that.data.userInfo.avatarUrl
                let doc = snapshot.docs
                for(let i = 0; i < doc.length;++i){
                  if(doc[i].avatar == avt){
                    that.setData({inFellow: true})
                    break
                  }
                }



                // console.log("global.hasFellow")
                // console.log(app.globalData.hasFellow)
                // console.log("global.fellow")
                // console.log(app.globalData.fellow)

            }
            },
            onError: function(err) {
              // wx.showModal({
              //   cancelColor: 'cancelColor',
              //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
              // })
              // wx.showModal({
              //   cancelColor: 'cancelColor',
              //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
              // })
            }
          })





            const watcher3 = db.collection('fellow2')
        .where({})
        .watch({
          onChange: function(snapshot) {
            if(snapshot.type != 'init'){
              app.globalData.currentFrame = 2
              that.setData({
                canSetGod:true,
              })
              console.log("[1]app.globalData.currentFrame: "+app.globalData.currentFrame)
              getApp().globalData.canGo = false
                that.setData({
                  canGo: false
                })
                if(that.data.votes1 != -1){
                  getApp().globalData.canGo = true
                  that.setData({
                    canGo: true,

                  })
                }
                else{
                  getApp().globalData.canGo = false
                  that.setData({
                    canGo: false,

                  })
                }
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
              const avt = that.data.userInfo.avatarUrl
              let doc = snapshot.docs
              for(let i = 0; i < doc.length;++i){
                if(doc[i].avatar == avt){
                  that.setData({inFellow: true})
                  break
                }
              }

          }
          },
          onError: function(err) {
        //     wx.showModal({
        //     //   cancelColor: 'cancelColor',
        //     //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
        //     // })
        //     // wx.showModal({
        //     //   cancelColor: 'cancelColor',
        //     //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
        //     // })
          }
        })


        const watcher4 = db.collection('fellow3')
          .where({})
          .watch({
            onChange: function(snapshot) {
              if(snapshot.type != 'init'){
                app.globalData.currentFrame = 3
                console.log("[2]app.globalData.currentFrame: "+app.globalData.currentFrame)
                getApp().globalData.canGo = false
                that.setData({
                  canGo: false
                })
                if(that.data.votes2 != -1){
                  getApp().globalData.canGo = true
                  that.setData({
                    canGo: true,

                  })
                }
                else{
                  getApp().globalData.canGo = false
                  that.setData({
                    canGo: false,

                  })
                }
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
                const avt = that.data.userInfo.avatarUrl
                let doc = snapshot.docs
                for(let i = 0; i < doc.length;++i){
                  if(doc[i].avatar == avt){
                    that.setData({inFellow: true})
                    break
                  }
                }

            }
            },
            onError: function(err) {
              // wx.showModal({
              //   cancelColor: 'cancelColor',
              //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
              // })
              // wx.showModal({
              //   cancelColor: 'cancelColor',
              //   title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
              // })
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
            getApp().globalData.canGo = false
                that.setData({
                  canGo: false
                })
                if(that.data.votes3 != -1){
                  getApp().globalData.canGo = true
                  that.setData({
                    canGo: true,

                  })
                }
                else{
                  getApp().globalData.canGo = false
                  that.setData({
                    canGo: false,

                  })
                }
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
            const avt = that.data.userInfo.avatarUrl
            let doc = snapshot.docs
            for(let i = 0; i < doc.length;++i){
              if(doc[i].avatar == avt){
                that.setData({inFellow: true})
                break
              }
            }

        }
        },
        onError: function(err) {
      //     wx.showModal({
      //       cancelColor: 'cancelColor',
      //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
      //     })
      //     wx.showModal({
      //       cancelColor: 'cancelColor',
      //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
      //     })
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
                  displayFellow5: app.globalData.fellow5,
                  canSetGod: false
                })
                const avt = that.data.userInfo.avatarUrl
                let doc = snapshot.docs
                for(let i = 0; i < doc.length;++i){
                  if(doc[i].avatar == avt){
                    that.setData({inFellow: true})
                    break
                  }
                }

            }
            },
            onError: function(err) {
          //     wx.showModal({
          //       cancelColor: 'cancelColor',
          //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
          //     })
          //     wx.showModal({
          //       cancelColor: 'cancelColor',
          //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
          //     })
            }
          })

          const curFrame = getApp().globalData.currentFrame


              const watcher114 = db.collection('vote')
              .where({
                  currentFrame: 0
              })
              .watch({
                onChange: function(snapshot) {
                  that.refresh()
                  const fellowNo = [3,4,4,5,5]
                  // console.log('docs\'s changed events', snapshot.docChanges)
                  // console.log('query result snapshot after the event', snapshot.docs)
                  // console.log('is init data', snapshot.type === 'init')
                  if(snapshot.docs.length > 0 && snapshot.type != 'init'){
                    if(snapshot.docs.length != fellowNo[0]){
                      that.setData({
                        canGo: false
                      })
                      getApp().globalData.canGo = false
                    }
                  else{
                    that.setData({
                      canGo: true
                    })
                    getApp().globalData.canGo = true
                    let no = 0
                    for(let index = 0;index < snapshot.docs.length;index++){
                      if(snapshot.docs[index].vote){
                        no++
                      }
                    }
                    that.setData({
                      votes0: no
                    })


                    const incS = that.data.successGames + 1
                    const incF = that.data.failGames + 1
                    if(no == 3){
                      that.setData({
                        successGames: incS
                      })
                    }
                    else{
                      that.setData({
                        failGames: incF
                      })
                    }

                    watcher114.close()
                  }
                } 
                },
                onError: function(err) {
              //     wx.showModal({
              //       cancelColor: 'cancelColor',
              //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
              //     })
              //     wx.showModal({
              //       cancelColor: 'cancelColor',
              //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
              //     })
                }
              })
 

                const watcher1141 = db.collection('vote')
                .where({
                    currentFrame: 1
                })
                .watch({
                  onChange: function(snapshot) {
                    that.refresh()
                    const fellowNo = [3,4,4,5,5]
                    console.log('docs\'s changed events', snapshot.docChanges)
                    // console.log('query result snapshot after the event', snapshot.docs)
                    // console.log('is init data', snapshot.type === 'init')
                    if(snapshot.docs.length > 0 && snapshot.type != 'init'){
                      if(snapshot.docs.length != fellowNo[1]){
                        that.setData({
                          canGo: false
                        })
                        getApp().globalData.canGo = false
                      }
                    else{
                      that.setData({
                        canGo: true
                      })
                      getApp().globalData.canGo = true
                      let no = 0
                      for(let index = 0;index < snapshot.docs.length;index++){
                        if(snapshot.docs[index].vote){
                          no++
                        }
                      }
                      that.setData({
                        votes1: no
                      })
                      const incS = that.data.successGames + 1
                      const incF = that.data.failGames + 1
                      if(no == 4){
                        that.setData({
                          successGames: incS
                        })
                      }
                      else{
                        that.setData({
                          failGames: incF
                        })
                      }
                      watcher1141.close()
                    }
                  } 
                  },
                  onError: function(err) { 
                //     wx.showModal({
                //       cancelColor: 'cancelColor',
                //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                //     })
                //     wx.showModal({
                //       cancelColor: 'cancelColor',
                //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                //     }) 
                  }
                })

                  const watcher1142 = db.collection('vote')
                  .where({
                      currentFrame: 2
                  })
                  .watch({
                    onChange: function(snapshot) {
                      that.refresh()
                      const fellowNo = [3,4,4,5,5]
                      console.log('docs\'s changed events', snapshot.docChanges)
                      console.log('query result snapshot after the event', snapshot.docs)
                      console.log('is init data', snapshot.type === 'init')
                      if(snapshot.docs.length > 0 && snapshot.type != 'init'){
                        if(snapshot.docs.length != fellowNo[2]){
                          that.setData({
                            canGo: false
                          })
                          getApp().globalData.canGo = false
                        }
                      else{
                        that.setData({
                          canGo: true
                        })
                        getApp().globalData.canGo = true
                        let no = 0
                        for(let index = 0;index < snapshot.docs.length;index++){
                          if(snapshot.docs[index].vote){
                            no++
                          }
                        }
                        that.setData({
                          votes2: no
                        })
                        
                        const incS = that.data.successGames + 1
                        const incF = that.data.failGames + 1
                        if(no == 4){
                          that.setData({
                            successGames: inc
                          })
                        }
                        else{
                          that.setData({
                            failGames: incF
                          })
                        }

                        //if end
                        const suc = that.data.successGames
                        const fa = that.data.failGames

                        if(suc > 2){
                          getApp().globalData.canGo = false
                          that.setData({
                            canGo: false
                          })
                          wx.showModal({
                            cancelColor: 'cancelColor',
                            title:"刺杀环节",
                            content:"蓝方获得三局胜利, 请刺客刺杀"
                          })
                        }
                        if(fa > 2){
                          getApp().globalData.canGo = false
                          that.setData({
                            canGo: false
                          })
                          wx.showModal({
                            cancelColor: 'cancelColor',
                            title:"游戏结束",
                            content:"红方获胜"
                          })
                        }

                        watcher1142.close()
                      }
                    } 
                    },
                    onError: function(err) {  
                  //     wx.showModal({
                  //       cancelColor: 'cancelColor',
                  //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                  //     })
                  //     wx.showModal({
                  //       cancelColor: 'cancelColor',
                  //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                  //     })
                    }
                  })

                    const watcher1143 = db.collection('vote')
                    .where({
                        currentFrame: 3
                    })
                    .watch({
                      onChange: function(snapshot) {
                        that.refresh()
                        const fellowNo = [3,4,4,5,5]
                        console.log('docs\'s changed events', snapshot.docChanges)
                        console.log('query result snapshot after the event', snapshot.docs)
                        console.log('is init data', snapshot.type === 'init')
                        if(snapshot.docs.length > 0 && snapshot.type != 'init'){
                          if(snapshot.docs.length != fellowNo[3]){
                            that.setData({
                              canGo: false
                            })
                            getApp().globalData.canGo = false
                          }
                        if(snapshot.docs.length == fellowNo[3]){
                          that.setData({
                            canGo: true
                          })
                          getApp().globalData.canGo = true
                          let no = 0
                          for(let index = 0;index < snapshot.docs.length;index++){
                            if(snapshot.docs[index].vote){
                              no++
                            }
                          }
                          that.setData({
                            votes3: no
                          })

                          const incS = that.data.successGames + 1
                          const incF = that.data.failGames + 1
                          if(no > 3){
                            that.setData({
                              successGames: incS
                            })
                          }
                          else{
                            that.setData({
                              failGames: incF
                            })
                          }

                           //if end
                        const suc = that.data.successGames
                        const fa = that.data.failGames

                        if(suc > 2){
                          getApp().globalData.canGo = false
                          that.setData({
                            canGo: false
                          })
                          wx.showModal({
                            cancelColor: 'cancelColor',
                            title:"刺杀环节",
                            content:"蓝方获得三局胜利, 请刺客点击头像开始刺杀"
                          })
                        }
                        if(fa > 2){
                          getApp().globalData.canGo = false
                          that.setData({
                            canGo: false
                          })
                          wx.showModal({
                            cancelColor: 'cancelColor',
                            title:"游戏结束",
                            content:"红方获胜"
                          })
                        }
                          watcher1143.close()
                        }
                      } 
                      },
                      onError: function(err) {  
                    //     wx.showModal({
                    //       cancelColor: 'cancelColor',
                    //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                    //     })
                    //     wx.showModal({
                    //       cancelColor: 'cancelColor',
                    //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                    //     })
                      }
                    })
 
                      const watcher1144 = db.collection('vote')
                      .where({
                          currentFrame: 4
                      })
                      .watch({
                        onChange: function(snapshot) {
                          that.refresh()
                          const fellowNo = [3,4,4,5,5]
                          // console.log('docs\'s changed events', snapshot.docChanges)
                          // console.log('query result snapshot after the event', snapshot.docs)
                          // console.log('is init data', snapshot.type === 'init')
                          if(snapshot.docs.length > 0 && snapshot.type != 'init'){
                            if(snapshot.docs.length != fellowNo[4]){
                              that.setData({
                                canGo: false
                              })
                              getApp().globalData.canGo = false
                            }
                          if(snapshot.docs.length == fellowNo[4]){

                            let no = 0
                            for(let index = 0;index < snapshot.docs.length;index++){
                              if(snapshot.docs[index].vote){
                                no++
                              }
                            }
                            that.setData({
                              votes4: no
                            })
                            
                            const incS = that.data.successGames + 1
                            const incF = that.data.failGames + 1
                            if(no == 5){
                              that.setData({
                                successGames: incS
                              })
                            }
                            else{
                              that.setData({
                                failGames: incF
                              })
                            }

                             //if end
                        const suc = that.data.successGames
                        const fa = that.data.failGames

                        if(suc > 2){
                          getApp().globalData.canGo = false
                          that.setData({
                            canGo: false
                          })
                          wx.showModal({
                            cancelColor: 'cancelColor',
                            title:"刺杀环节",
                            content:"蓝方获得三局胜利, 请刺客点击头像开始刺杀"
                          })
                        }
                        if(fa > 2){
                          getApp().globalData.canGo = false
                          that.setData({
                            canGo: false
                          })
                          wx.showModal({
                            cancelColor: 'cancelColor',
                            title:"游戏结束",
                            content:"红方获胜"
                          })
                        }
                            watcher1144.close()
                          }
                        } 
                        },
                        onError: function(err) {  
                      //     wx.showModal({
                      //       cancelColor: 'cancelColor',
                      //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                      //     })
                      //     wx.showModal({
                      //       cancelColor: 'cancelColor',
                      //       title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                      //     })
                        }
                      })

                      // const watcherAssa = db.collection('end')
                      // .where({})
                      // .watch({
                      //     onChange: function(snapshot) {
                      //       console.log("informed 猎杀")
                      //       console.log(snapshot)
                      //         if(if(snapshot.type != 'init' && snapshot.docChanges[0].dataType == "add")){
                                  
                      //             getApp().globalData.assaAvt = snapshot.docs.assa,
                      //             getApp().globalData.deadAvt = snapshot.docs.dead
                      //             if(snapshot.docs.dead == getApp().globalData.role[0].avatar){
                      //                 wx.showModal({
                      //                   cancelColor: 'cancelColor',
                      //                   title:"刺杀成功",
                      //                   content:"红方胜利"
                      //                 })
                      //             }
                      //             else{
                      //                 wx.showModal({
                      //                     cancelColor: 'cancelColor',
                      //                     title:"刺杀失败",
                      //                     content:"蓝方胜利"
                      //                   })
                      //             }
                      //         }
                             
                      //      },
                      //     onError: function(err) {
                      //         console.error('the watch closed because of error', err)
                      //         wx.showModal({
                      //           cancelColor: 'cancelColor',
                      //           title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                      //         })
                      //         wx.showModal({
                      //           cancelColor: 'cancelColor',
                      //           title:'小程序出现错误! 请立即通知房主. . 请点击右上角三个点 → "重新进入小程序"'
                      //         })
                      //     }
                      // })



  },


  async getUserProfile(e) {
    const that = this
    console.log("Login")

    wx.getUserProfile({
      desc: '展示用户信息', 
      success: (res) => {
      
        this.setData({
          hasUserInfo: true,
          userInfo: res.userInfo,
          displayQueue: app.globalData.myQueue
        })

        app.globalData.userInfo = res.userInfo
        //console.log(this.data.userInfo)

        const db = wx.cloud.database({})

        db.collection('queue').where({
          avatar: res.userInfo.avatarUrl
        })
        .get({
          success:function(ress){
            if(ress.data.length != 0){
              // that.refresh()
              return
            }
            else{
              db.collection('queue').add({
                data: {
                  nickName: res.userInfo.nickName,
                  avatar: res.userInfo.avatarUrl,
                  isLeader: false,
                  isGoddess: false,
                  wasGoddess: false
                }
              })
              .then(res => {
                that.setData({
                  displayQueue: app.globalData.myQueue
                })
                // that.refresh()
              })
            }
          }
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


    //append shuffled queue to role
    const db = wx.cloud.database({})
db.collection('role').where({}).get({
  success:function(resss){
    if(resss.data.length > 0){
      return
    }
    else{
    //pick leader
    db.collection('queue').where({})
    .get({
      success: function(res) {


        // res.data 是包含以上定义的两条记录的数组
        var idList = []
        for(var i = 0;i < res.data.length;++i){
          idList.push(res.data[i]._id)
        }
        console.log(idList)
        //借用id实现随机选择

        //rd 0 ~ queue.length-1
        let rd = Math.floor(Math.random() * that.data.displayQueue.length)

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

      }
    })






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
    // console.log('shuffledMyQueue')
    // console.log(shuffledMyQueue)
        }
      }
    })

    }
  }
})

  },

  async refresh(e){

    const that = this
    this.checkUser()
    const db = wx.cloud.database({})
    db.collection('queue').where({})
    .get({
      success: function(res) {
        app.globalData.myQueue = []
        const myQueue = app.globalData.myQueue
        for(var i = 0;i < res.data.length;++i){
          myQueue.push(res.data[i])
        }
      }
    })
    this.setData({
      displayQueue: app.globalData.myQueue
    })
    // const db = wx.cloud.database({})
    // user collection 设置权限为仅创建者及管理员可读写
    // 这样除了管理员之外，其它用户只能读取到自己的用户信息
    const user = await db.collection('queue').where({
      avatar: that.data.userInfo.avatarUrl
    }).get()

    // 如果没有用户，跳转到登录页面登录
    if (user.data.length > 0 && user.data[0].avatar == that.data.userInfo.avatarUrl) {
      that.setData({isOwner:true})
    }
    db.collection('fellow').where({})
    .get({
      success:function(res){
        if(res.data.length != 0){
getApp().globalData.currentFrame = getApp().globalData.currentFrame>0?getApp().globalData.currentFrame:1
          that.setData({
            displayFellow: res.data,
            hasFellow: true
          })
        }
      }
    })

    db.collection('fellow2').where({})
    .get({
      success:function(res){
        if(res.data.length != 0){
          getApp().globalData.currentFrame = getApp().globalData.currentFrame>1?getApp().globalData.currentFrame:2
          that.setData({
            displayFellow2: res.data,
            hasFellow2: true
          })
        }
      }
    })

    db.collection('fellow3').where({})
    .get({
      success:function(res){
        if(res.data.length != 0){
          getApp().globalData.currentFrame = getApp().globalData.currentFrame>1?getApp().globalData.currentFrame:3
          that.setData({
            displayFellow3: res.data,
            hasFellow3: true
          })
        }
      }
    })

    db.collection('fellow4').where({})
    .get({
      success:function(res){
        if(res.data.length != 0){
          getApp().globalData.currentFrame = getApp().globalData.currentFrame>1?getApp().globalData.currentFrame:4
          that.setData({
            displayFellow4: res.data,
            hasFellow4: true
          })
        }
      }
    })

    db.collection('fellow5').where({})
    .get({
      success:function(res){
        if(res.data.length != 0){

          that.setData({
            displayFellow5: res.data,
            hasFellow5: true
          })
        }
      }
    })

    // db.collection('vote').where({
    //   currentFrame: 0
    // })
    // .get({
    //   success:function(res){
    //     if(res.data.length > 0){
    //       getApp().globalData.currentFrame = 1
    //       that.setData({currentFrame: 1})
    //       var counter = 0
    //       for(var ii = 0;i < res.data.length;i++){
    //         if(res.data[ii].vote){
    //           counter++
    //         }
    //       }
    //       that.setData({
    //         votes0: counter
    //       })
    //     }
    //   }
    // })

    // db.collection('vote').where({
    //   currentFrame: 1
    // })
    // .get({
    //   success:function(res){
    //     if(res.data.length > 0){
    //       getApp().globalData.currentFrame = 2
    //       that.setData({currentFrame: 2})
    //       var counter = 0
    //       for(var ii = 0;i < res.data.length;i++){
    //         if(res.data[ii].vote){
    //           counter++
    //         }
    //       }
    //       that.setData({
    //         votes1: counter
    //       })
    //     }
    //   }
    // })

    // db.collection('vote').where({
    //   currentFrame: 2
    // })
    // .get({
    //   success:function(res){
    //     if(res.data.length > 0){
    //       getApp().globalData.currentFrame = 3
    //       that.setData({currentFrame: 3})
    //       var counter = 0
    //       for(var ii = 0;i < res.data.length;i++){
    //         if(res.data[ii].vote){
    //           counter++
    //         }
    //       }
    //       that.setData({
    //         votes2: counter
    //       })
    //     }
    //   }
    // })


    // db.collection('vote').where({
    //   currentFrame: 3
    // })
    // .get({
    //   success:function(res){
    //     if(res.data.length > 0){
    //       getApp().globalData.currentFrame = 4
    //       that.setData({currentFrame: 4})
    //       var counter = 0
    //       for(var ii = 0;i < res.data.length;i++){
    //         if(res.data[ii].vote){
    //           counter++
    //         }
    //       }
    //       that.setData({
    //         votes3: counter
    //       })
    //     }
    //   }
    // })


    // db.collection('vote').where({
    //   currentFrame: 4
    // })
    // .get({
    //   success:function(res){
    //     if(res.data.length > 0){
    //       getApp().globalData.currentFrame = 4
    //       that.setData({currentFrame: 4})
    //       var counter = 0
    //       for(var ii = 0;i < res.data.length;i++){
    //         if(res.data[ii].vote){
    //           counter++
    //         }
    //       }
    //       that.setData({
    //         votes4: counter
    //       })
    //     }
    //   }
    // })
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
        wx.cloud.callFunction({
          // 云函数名称
          name: 'addE',
          // 传给云函数的参数
          data: {
          },
        })
        .then(res => {
          // console.log(res.result) // 3
        })
        .catch(console.error)


        console.log("end cleared")
        
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
        // console.log("shuffled role from Database")
        // console.log(role)
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
  else if(that.data.isGoddess && that.data.canSetGod){
    wx.showModal({
      cancelColor: 'cancelColor',
      title:'你确定要查验此人吗?',
      success:function(res){
        if(res.confirm){
          const av = getApp().globalData.myQueue[e.target.id].avatar
          var resNo = -1
          for(var i = 0;i < getApp().globalData.role.length;i++){
            if(getApp().globalData.role[i].avatar == av){
              resNo = i
              let resText = (resNo < 6)?"蓝方":"红方"
              wx.showModal({
                cancelColor: 'cancelColor',
                title:'查验',
                content: resText,
                success:function(res){
                  const db = wx.cloud.database()
                  db.collection('queue').where({
                  })
                  .get({
                    success:function(res){
                      var resId = ""
                      for(var i = 0;i < res.data.length;i++){
                        if(res.data[i].avatar == av){
                          resId = res.data[i]._id
                          break
                        }
                        else{
                          continue
                        }
                      }
                      db.collection('queue').where({
                        isGoddess: true
                      }).update({
                        data:{
                          isGoddess: false
                        },
                        success:function(res){
                          db.collection('queue').doc(resId).update({
                            data:{
                              isGoddess: true
                            }
                          })
                        }
                      })
                    }
                  })
              
                }
              })



            }

          }         
        }
      }
    })
  }

  // else if(that.data.isAssa){
  //   const dd = app.globalData.myQueue[e.target.id]

  //   let leaderText = app.globalData.myQueue[e.target.id].isLeader?"(此轮车长)":""


  //   // if(app.globalData.myQueue[e.target.id].isLeader){
  //   //   if()

  //   // }
  //   let godText = (app.globalData.myQueue[e.target.id].isGoddess && app.globalData.currentFrame > 1)?" (湖中仙女)":""
  //   let assText = "你确定要刺杀 " + dd.nickName + leaderText + godText + " 吗?"
  //   wx.showModal({
  //     cancelColor: 'cancelColor',
  //     title:"猎杀时刻",
  //     content: assText,
  //     success:function(res){
  //       if(res.confirm){

  //         console.log(that.data.displayQueue[that.data.queueIdx].nickName + " 刺杀了 " + app.globalData.myQueue[e.target.id].nickName)
  //         const assaData = that.data.userInfo.avatarUrl
  //         const deadData = dd.avartar


  //         console.log(dd)
  //         console.log(dd.avatar)
  //         // const db = wx.cloud.database()
  //         // db.collection('end').add({
  //         //   data:{
  //         //     assa: assaData,
  //         //     dead: deadData,
  //         //     hasVote: true
  //         //   }
  //         // })
  //       }

  //     }
  //   })
  //   return
  // }
  else{
    let leaderText = app.globalData.myQueue[e.target.id].isLeader?"(此轮车长)":""
    let godText = (app.globalData.myQueue[e.target.id].isGoddess && that.data.canSetGod && app.globalData.currentFrame > 1)?" (湖中仙女)":""
    let content = app.globalData.myQueue[e.target.id].nickName + leaderText + godText
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

sucMis(e){
  //success
  const currentFrame = app.globalData.currentFrame - 1
  console.log(currentFrame)
  console.log("任务开始")
  const db = wx.cloud.database()
  db.collection('vote').add({
    data:{
      currentFrame: currentFrame,
      vote: true
    }
  })      
  .then(res => {
  })
  this.setData({
    inFellow:false
  })

},

failMis(e){
  //fail
  const currentFrame = app.globalData.currentFrame - 1
  console.log(currentFrame)
  console.log("任务开始")
  // console.log(getApp().globalData.currentFrame)
  const db = wx.cloud.database()
  db.collection('vote').add({
    data:{
      currentFrame: currentFrame,
      vote: false
    }
  })   
  .then(res => {
  })
  this.setData({
    inFellow:false
  })

},

nxtLeader(e){
  // const avt = app.globalData.userInfo.avatarUrl
  //         console.log("avt")
  //         console.log(avt)
      console.log("next")
  
      this.setData()
      var avt = ''
      for(let i = 0;i < this.data.displayQueue.length;i++){
        if(this.data.displayQueue[i].isLeader){
          avt = this.data.displayQueue[i].avatar
          break
        }
      }
      console.log("avt" + avt)
      const db = wx.cloud.database({})
      db.collection('queue').where({
      })
      .get({
        success:function(res){
          var resId = ""
          var nextId = ""
          for(var i = 0;i < res.data.length;i++){
            if(res.data[i].avatar == avt){
              resId = res.data[i]._id
              nextId = res.data[(i+1) % res.data.length]._id
              break
            }
            else{
              continue
            }
          }
          db.collection('queue').doc(resId).update({
            data:{
              isLeader: false
            }
          })

          db.collection('queue').doc(nextId).update({
            data:{
              isLeader: true
            }
          })
        }
      })
}
})