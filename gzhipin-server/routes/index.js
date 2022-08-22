var express = require('express');
var router = express.Router();


const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models')
const filter = {password: 0, __v: 0} // 制定过滤的属性
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册一个路由： 用户注册
/*
b. 提供一个用户注册的接口
a) path 为: /register
b) 请求方式为: POST
c) 接收username 和password 参数
d) admin 是已注册用户
e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f) 注册失败返回: {code: 1, msg: '此用户已存在'}
*/

/*
1 处理请求参数
2 处理
3 返回相应数据
*/
/*router.post('/register', function(req,res){
  console.log('register()')
  // 获取请求参数
  const {username, password} = req.body
  // 处理
  if (username === 'admin'){ //注册会失败
    //返回相应数据 （失败）
    res.send({code: 1, msg:'此用户已存在'})
  } else { //注册成功 返回相应数据 （成功）
    res.send({code: 0, data: {id: 'abc123', username, password}})
  }
})
*/

//注册的路由
router.post('/register', function(req,res){
  // 获取请求参数
  const{username, password, type} = req.body
  // 处理:判断用户是否存在，如果存在，返回提示错误的信息，如果不存在，保存
  //查询（根据username）
  UserModel.findOne({username}, function(err, user){
    //如果user有值（已存在）
      if(user){
        res.send({code: 1, msg :'此用户已存在'})
      } else { //不存在 保存信息
        new UserModel({username, password: md5(password), type}).save(function(err, user){
          // 生成一个cookie(userid: user._id), 并交给浏览器保存
          res.cookie('userid', user._id, {maxAge: 1000*60*60*24}) // 持久化cookie, 浏览器会保存在本地文件
          //返回包含user的json数据
          const data = {username, type, _id: user._id} //相应数据中不用返回密码了          
          res.send({code: 0, data})
        })
      }

  })
})

//登陆的路由
router.post('/login', function(req,res){
  const {username, password} =req.body
  //根据username和passw查询数据库users，如果没有，返回提示错误的信息，如果有，返回登陆成功的信息（包含user）
  UserModel.findOne({username, password: md5(password)},filter, function(err,user){
    if(!user){
      res.send({code: 1, msg :'用户名或密码不正确'})
    } else{
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24}) // 持久化cookie, 浏览器会保存在本地文件
      res.send({code: 0, data: user})
    }


  })


})

//更新用户信息的路由
router.post('/update', function(req,res){
  //从请求的cookie得到userid
  const userid = req.cookies.userid
  //如果不存在，直接返回一个提示信息
  if(!userid){
    return res.send({code: 1, msg:'pelase login first'})
  }

  //存在 ， 根据userid更新对应的user文档数据
  //得到提交的用户数据
  const user = req.body //没有_id
  UserModel.findByIdAndUpdate({_id:userid}, user, function(error,oldUser){
     if(!oldUser){
        //通知浏览器删除userid cookie
        res.clearCookie('userid')
        //返回一个提示信息
        res.send({code: 1,  msg:'pelase login first'})
     }else{
        //准备一个返回的user数据对象
        const {_id, username, type} = oldUser
        const data = Object.assign(user, {_id, username, type} )
        //返回
        res.send({code:0, data })
     }
  }) 
})

//获取用户信息的路由（根据cookie中的userid）
router.get('/user', function(req,res){
    //从请求的cookie得到userid
    const userid = req.cookies.userid
      //如果不存在，直接返回一个提示信息
  if(!userid){
    return res.send({code: 1, msg:'please login first'})
  }
  //根据userid查询对应的user
  UserModel.findOne({_id: userid}, filter, function(error, user){
    res.send({code: 0, data: user})
  })
})



//根据用户类型获取用户列表
router.get('/userlist', function(req,res){
  const {type} = req.query
  UserModel.find({type}, filter, function(error, users){
    res.send({code: 0, data: users})
  })
})

/*
获取当前用户所有相关聊天信息列表
 */
router.get('/msglist', function (req, res) {
  // 获取cookie中的userid
  const userid = req.cookies.userid
  // 查询得到所有user文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
    /*const users = {} // 对象容器
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, header: doc.header}
    })*/

    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header}
      return users
    } , {})
    /*
    查询userid相关的所有聊天信息
     参数1: 查询条件
     参数2: 过滤条件
     参数3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from
  const to = req.cookies.userid
  /*
  更新数据库中的chat数据
  参数1: 查询条件
  参数2: 更新为指定的数据对象
  参数3: 是否1次更新多条, 默认只更新一条
  参数4: 更新完成的回调函数
   */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})
module.exports = router;
