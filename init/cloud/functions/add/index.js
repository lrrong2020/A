// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// let myList = []

// // 云函数入口函数
// exports.main = async (event, context) => {
//     const wxContext = cloud.getWXContext()

//     // return {
//     //     event,
//     //     openid: wxContext.OPENID,
//     //     appid: wxContext.APPID,
//     //     unionid: wxContext.UNIONID,
//     // }
//     myList.push(event)

//     if(myList.length == 3){


//         return {
//         myList: myList
//       }

//     }

// }

// 使用了 async await 语法
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('fellow').where({
      isExisted: true
    }).remove()
  } catch(e) {
    console.error(e)
  }finally{
    db.collection('fellow').where({
      isExisted: true
    }).remove()
  }
}
