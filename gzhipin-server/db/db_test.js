// 测试使用mongoose操作mongodb数据库
//引入加密的函数md5
const md5 = require('blueimp-md5')
//引入mongoose
const mongoose = require('mongoose')
//连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
//获取连接对象
const conn = mongoose.connection
//绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function(){//连接成功回调
    console.log('数据库连接成功 oye')
})

// 2. 得到对应特定集合的Model 
// 2.1. 定义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema) // 集合名: users

/* 3 通过Model或其实例对集合数据进行CRUD操作*/
// 3.1. 通过Model 实例的save()添加数据
function testSave(){
    //创建userModel的实例
   const userModel =  new UserModel({username:'Jack', password:md5('123'), type: 'Expert'})
   //调用save（）保存
   userModel.save(function(error, user){
    console.log('save()', error, user)
   })
}
//testSave()

// 3.2. 通过Model 的find()/findOne()查询多个或一个数据
function testFind(){
    UserModel.find(function(error,users){  //如果有匹配返回的是一个[user, user..], 如果没有一个匹配的返回[]
        console.log('find()', error, users)
    })
    //查询一个：得到的是匹配的文档对象，如果有匹配返回的是一个user, 如果没有一个匹配的返回null
    UserModel.findOne({_id: "62f321c0288dccc7c9703a92"}, function(error,user){
        console.log('fineOne()', error, user)
      })
}
//testFind()

// 3.3. 通过Model 的findByIdAndUpdate()更新某个数据
function testUpdate(){
    UserModel.findByIdAndUpdate({_id: "62f321c0288dccc7c9703a92"}, 
    {username: 'Jack111'}, function(error, oldUser){
        console.log('findByIdAndUpdate()', error, oldUser)
    })
}
//testUpdate()

// 3.4. 通过Model 的remove()删除匹配的数据
function testDelete(){
    UserModel.remove({_id:"62f300364fe6b95457997789"}, function(error, doc){
        console.log('remove', error, doc)
    })
}
testDelete()
