const app = getApp()
// pages/roles/0.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roleNo: app.globalData.roleNo_G,
        text:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
       this.setData({roleNo: app.globalData.roleNo_G})


        // if(roleNo == 0){

        // }
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

    displayText(e){
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
        this.setData({roleNo: app.globalData.roleNo_G})
        const i = this.data.roleNo
        const role = app.globalData.role
        const meiLinArr = [role[6],role[7],role[8],role[9]].shuffle()
        const badGuyArr = [role[7],role[8],role[9]]
        const pieArr = [role[0],role[7]].shuffle()
        let meiLin = "你是梅林" + "\n红方:" + meiLinArr[0].nickName + "\n" + meiLinArr[1]+ "\n" + meiLinArr[2].nickName + "\n"
        let pai = "你是派西维尔" + "\n这两个人是派西维尔和梅林, 但是你不知道谁是谁:" + pieArr[0].nickName + "\n" + pieArr[1].nickName
        let badGuy = "你是红方" + "\n红方:" + "莫甘娜: "+badGuyArr[0].nickName + "\n" + "刺客: "+badGuyArr[1].nickName+ "\n" + "莫德雷德: "+badGuyArr[2].nickName + "\n"

        switch(i){
            case 0:
                this.setData({
                    text: meiLin
                })
                break;
            case 1:
                this.setData({
                    text: pai
                })
                break;
            case 2:
                this.setData({
                    text: "你是忠臣"
                })
                break;
            case 3:
                this.setData({
                    text: "你是忠臣"
                })
                break;
            case 4:
                this.setData({
                    text: "你是忠臣"
                })
                break;
            case 5:
                this.setData({
                    text: "你是忠臣"
                })
                break;
            case 6:
                this.setData({
                    text: "你是奥伯伦"
                })
                break;
            case 7:
                this.setData({
                    text: badGuy
                })
                break;
            case 8:
                this.setData({
                    text: badGuy
                })
                break;
            case 9:
                this.setData({
                    text: badGuy
                })
                break;                
        }
    }
})