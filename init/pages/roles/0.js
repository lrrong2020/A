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
        this.setData({roleNo: app.globalData.roleNo_G})
        const i = this.data.roleNo
        switch(i){
            case 0:
                this.setData({
                    text: "你是梅林"
                })
                break;
            case 1:
                this.setData({
                    text: "你是派西维尔"
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
                    text: "你是莫甘娜"
                })
                break;
            case 8:
                this.setData({
                    text: "你是刺客"
                })
                break;
            case 9:
                this.setData({
                    text: "你是莫德雷德"
                })
                break;                
        }
    }
})