const app = getApp()
// test/test.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buttons: [{ id: 1, name: '银色' }, { id: 2, name: '白色' }, { id: 3, name: '黑色' }],
        msg:'',
        number: 0,
        f: -1,
        theQueue: app.globalData.myQueue,
        displayQueue:[],
        submitList:[],
        fellowNo:[3,4,4,5,5],
        currentFrame: app.globalData.currentFrame,
        hasQueue: false
      },
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.data.buttons[0].checked = true;
        // this.setData({
        //   buttons: this.data.buttons,
        // })
        this.setData({
          theQueue: app.globalData.myQueue,
          currentFrame: getApp().globalData.currentFrame,
          hasQueue: false
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

    },
    /**
 * 事件监听,实现单选效果
 * e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
 */
radioButtonTap: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    for (let i = 0; i < this.data.displayQueue.length; i++) {
      if (this.data.displayQueue[i].id == id) {
        //当前点击的位置为true即选中
        this.data.displayQueue[i].checked = true;
      }
      else {
        //其他的位置为false
        this.data.displayQueue[i].checked = false;
      }
    }
    this.setData({
      displayQueue: this.data.displayQueue,
      msg: "id:"+id
    })
  },
  checkButtonTap:function(e){
    const currentFrame = getApp().globalData.currentFrame
    const FELLOW_NO = [3,4,4,5,5]
      var n = 0
      const f = this.data.f
    // console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    for (let i = 0; i < this.data.displayQueue.length; i++) {
      if (this.data.displayQueue[i].id == id) {
        if (this.data.displayQueue[i].checked == true) {
          this.data.displayQueue[i].checked = false;
          n--
        } else {
          this.data.displayQueue[i].checked = true;
            //record first button met
            if(this.data.number == 0){

                this.setData({f: i})
            }
          //if reaches upper limit
          if((this.data.number + n + 1) > FELLOW_NO[currentFrame]){
            // for(let j = 0; j < this.data.buttons.length; j++){
            //     if(this.data.buttons[j].checked == true){
            //         this.data.buttons[j].checked = false;
            //         break
            //     }
            // }
            let zuiduo = "此轮最多可以选 " + FELLOW_NO[currentFrame]+ " 个人\n请再次点击取消选取"
            wx.showModal({
              cancelColor: 'cancelColor',
              title: zuiduo
            })
            this.data.displayQueue[f].checked = false;
            break
          }
          n++

        }
      }
    }


   this.setData({
     displayQueue: this.data.displayQueue,
     msg: "id:"+id,
     number: this.data.number += n
    })

  },

  select(e){
    //create new array of objecs including surrogate ids

    this.setData({
      theQueue: app.globalData.myQueue,
      currentFrame: getApp().globalData.currentFrame
    })
    this.setData({
      hasQueue: true
    })
    const displayQueue = this.data.displayQueue

    if(this.data.displayQueue.length > 0){
      return
    }
      for(let a = 0; a < this.data.theQueue.length;++a){
        displayQueue.push({id: a, nickName: this.data.theQueue[a].nickName, avatar: this.data.theQueue[a].avatar})
      }
      this.setData({displayQueue})

  },

  submit(e){
    const currentFrame = getApp().globalData.currentFrame
    const FELLOW_NO = [3,4,4,5,5]
    this.setData({submitList: []})
    for (let i = 0; i < this.data.displayQueue.length; i++) {
      if(this.data.displayQueue[i].checked == true){
        this.data.submitList.push(this.data.displayQueue[i])
      }
      else{continue}
    }
    this.setData({submitList: this.data.submitList})

    console.log("submit")
    const submitList = this.data.submitList
    console.log(submitList)

    let displayContent = ""
    for(let i = 0; i < submitList.length; i++){
      displayContent = displayContent +  submitList[i].nickName+ ", "  
    }

    if(submitList.length < FELLOW_NO[currentFrame]){
      let notEnough = "当前已选人数: " + submitList.length + "/" + FELLOW_NO[currentFrame]
      wx.showModal({
        cancelColor: 'cancelColor',
        title:"人数不够, 无法发车",
        content: notEnough
      })
      return
    }


    wx.showModal({
      cancelColor: 'cancelColor',
      title:"请确认你的选择",
      content: displayContent,
      success: function(res){
        getApp().globalData.canGo = false
        if(res.confirm){
          const db = wx.cloud.database({})

          switch(app.globalData.currentFrame){
            case 0:
              for(let i = 0;i < submitList.length;i++){
                db.collection('fellow').add({
                  data:{
                    nickName: submitList[i].nickName,
                    avatar: submitList[i].avatar,
                    isExisted: true
                  }
                })      
                  .then(res => {
                }) 
              }
              break

              case 1:
                for(let i = 0;i < submitList.length;i++){
                  db.collection('fellow2').add({
                    data:{
                      nickName: submitList[i].nickName,
                      avatar: submitList[i].avatar,
                      isExisted: true
                    }
                  })      
                    .then(res => {
                  }) 
                }
                break

                case 2:
                  for(let i = 0;i < submitList.length;i++){
                    db.collection('fellow3').add({
                      data:{
                        nickName: submitList[i].nickName,
                        avatar: submitList[i].avatar,
                        isExisted: true
                      }
                    })      
                      .then(res => {
                    }) 
                  }
                  break
              
                  case 3:
                    for(let i = 0;i < submitList.length;i++){
                      db.collection('fellow4').add({
                        data:{
                          nickName: submitList[i].nickName,
                          avatar: submitList[i].avatar,
                          isExisted: true
                        }
                      })      
                        .then(res => {
                      }) 
                    }
                    break
                    case 4:
                      for(let i = 0;i < submitList.length;i++){
                        db.collection('fellow5').add({
                          data:{
                            nickName: submitList[i].nickName,
                            avatar: submitList[i].avatar,
                            isExisted: true
                          }
                        })      
                          .then(res => {
                        }) 
                      }
                      break
          }
          console.log("app.globalData.userInfo")
          console.log(app.globalData.userInfo)

          const avt = app.globalData.userInfo.avatarUrl
          console.log("avt")
          console.log(avt)

          db.collection('queue').where({
          })
          .get({
            success:function(res){
              var resId = ""
              var nextId = ""
              for(var i = 0;i < res.data.length;i++){
                if(res.data[i].avatar == avt){
                  resId = res.data[i]._id
                  const nextIndex = (i+1) % res.data.length
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
              if(getApp().globalData.currentFrame < 5){
                db.collection('queue').doc(nextId).update({
                  data:{
                    isLeader: true
                  }
                })
              }
            }
          })
          //voted = false (globaldata)
          //navigate to FakeIndex
          //hide 发车
        }



      }
    })
  }
})