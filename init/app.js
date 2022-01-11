//app.js
App({
    onLaunch () {
        // 初始化云函数
        wx.cloud.init({
            env:'cloud1-8gpoj75ocecfa904',
            traceUser: true
        })

        // 获取用户信息
        //wx.getSetting({
            //success: res => {
                    wx.getUserProfile({
                        success: res => {
                            console.log('success')
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            //if (this.userInfoReadyCallback) {
                            //    this.userInfoReadyCallback(res)
                            //}
                       // }
                    //})        
            }
        })
        const that = this
        const db = wx.cloud.database()
        const watcher = db.collection('fellow')
        .where({})
        .watch({
            onChange: function(snapshot) {
                // console.log('docs\'s changed events', snapshot.docChanges)
                // console.log('query result snapshot after the event', snapshot.docs)
                // console.log('is init data', snapshot.type === 'init')
                
                if(snapshot.docChanges.length > 0 && snapshot.docChanges[0].dataType == "add"){
                    // console.log('1.docs\'s changed events', snapshot.docChanges)
                    // console.log('2,query result snapshot after the event', snapshot.docs)
                    // console.log('3.is init data', snapshot.type === 'init')    
                    console.log("fellow changed")
                    getApp().globalData.hasFellow = true
                    getApp().globalData.fellow = snapshot.docs
                    wx.showModal({
                    cancelColor: 'cancelColor',
                    title:"任务进行中"
                    })
                    wx.navigateBack({
                        delta: 1
                      })
                }
             },
            onError: function(err) {
                console.error('the watch closed because of error', err)
            }
        })
        const watcher1 = db.collection('queue')
        .where({})
        .watch({
            onChange: function(snapshot) {
                // console.log('docs\'s changed events', snapshot.docChanges)
                // console.log('query result snapshot after the event', snapshot.docs)
                // console.log('is init data', snapshot.type === 'init')
                // console.log('docs\'s changed events', snapshot.docChanges)
                // console.log('query result snapshot after the event', snapshot.docs)
                // console.log('is init data', snapshot.type === 'init')
                if(snapshot.docs.length == 0 && snapshot.docChanges.length > 0){
                    getApp().globalData.cleared = true
                    wx.showModal({
                    cancelColor: 'cancelColor',
                    title:"房间已清理 请点击右上角 ... 重新进入小程序"
                    })
                    wx.showModal({
                        cancelColor: 'cancelColor',
                        title:"房间已清理 请点击右上角 ... 重新进入小程序"
                    })
                    wx.showModal({
                        cancelColor: 'cancelColor',
                        title:"房间已清理 请点击右上角 ... 重新进入小程序"
                    })
                }
             },
            onError: function(err) {
                console.error('the watch closed because of error', err)
            }
        })
    },

    globalData: {
        hasUser: false, // 数据库中是否有用户
        hasUserInfo: false, // 小程序的userInfo是否有获取
        userInfo: null,
        checkResult: null,
        code: null,
        openId: null,
        flag: 0,
        allData: {
            albums: []
        },
        id: null,
        owner: false,
        myQueue:[],
        role:[],
        nickName:null,
        roleNo_G: -1,
        hasFellow:false,
        hasFellow2:false,
        hasFellow3:false,
        hasFellow4:false,
        hasFellow5:false,
        fellow:[],
        fellow2:[],
        fellow3:[],
        fellow4:[],
        fellow5:[],
        cleared: false,
        vote:[],
        currentRound:0,//for leader to vote (<5)
        currentFrame:0,//for count larger frames
        canGo: true,
        isAssa: false,
    }
})
