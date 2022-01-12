// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    var voteRes = [
        {frame:0, votes:[null, null, null]},
        {frame:1, votes:[null, null, null, null]},
        {frame:2, votes:[null, null, null, null]},
        {frame:3, votes:[null, null, null, null, null]},
        {frame:4, votes:[null, null, null, null, null]}
    ]

    
    return {
        // event,
        // openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
    }
}