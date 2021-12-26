//index.js
const regeneratorRuntime = require('../common/regenerator-runtime.js')
//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    onLoad() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })

            this.addUser(app.globalData.userInfo)
        } 
        else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })

                this.addUser(res.userInfo)
            }
        }
         else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            wx.getUserProfile({
                desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
              console.log(res)
              app.globalData.userInfo = e.detail.userInfo
  
              this.setData({
                  userInfo: e.detail.userInfo,
                  hasUserInfo: true
              })
  
              this.addUser(app.globalData.userInfo)
  
               //wx.switchTab({ url: '/pages/index/index' })
            }
          })
        }
    },

    getUserProfile(e) {
        console.log('cnm')
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
           console.log('success')
          }
        })
      },
    // 如果数据库没有此用户，则添加
    async addUser (user) {
        if (app.globalData.hasUser) {
            return
        }
        console.log('database no user')
        // 在此插入储存用户代码
        const db = wx.cloud.database({})

        let result = await db.collection('user').add({
            data:{
                nickName: user.nickName,
                albums:[]
            }
        })

        app.globalData.nickName = user.nickName
        app.globalData.id = result._id
    }
})
