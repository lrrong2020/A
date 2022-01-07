// test/test.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buttons: [{ id: 1, name: '银色' }, { id: 2, name: '白色' }, { id: 3, name: '黑色' }],
        msg:'',
        number: 0
      },
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.data.buttons[0].checked = true;
        // this.setData({
        //   buttons: this.data.buttons,
        // })
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
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == id) {
        //当前点击的位置为true即选中
        this.data.buttons[i].checked = true;


      }
      else {
        //其他的位置为false
        this.data.buttons[i].checked = false;
      }
    }
    this.setData({
      buttons: this.data.buttons,
      msg: "id:"+id
    })
  },
  checkButtonTap:function(e){
      var n = 0
      var f = 0
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == id) {
        if (this.data.buttons[i].checked == true) {
          this.data.buttons[i].checked = false;
          n--

        } else {
          this.data.buttons[i].checked = true;
        
            //record first button met
            if(f == 0 & n == 0){
                f = i
            }
          //if reaches upper limit
          if((this.data.number + n + 1) > 2){
            // for(let j = 0; j < this.data.buttons.length; j++){
            //     if(this.data.buttons[j].checked == true){
            //         this.data.buttons[j].checked = false;
            //         break
            //     }
            // }
            this.data.buttons[f].checked = false;
            break
          }
          n++

        }
      }
    }
   this.setData({
     buttons: this.data.buttons,
     msg: "id:"+id,
     number: this.data.number += n
    })

  },

})