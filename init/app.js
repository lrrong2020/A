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
    },
    globalData: {
        hasUser: false, // 数据库中是否有用户
        hasUserInfo: false, // 小程序的userInfo是否有获取
        userInfo: null,
        checkResult: null,
        code: null,
        openId: null,
        flag: 0,
        nickName: '',
        allData: {
            albums: []
        },
        id: null,
        owner: false,
        myQueue:[],
        role:[]
    }
})
