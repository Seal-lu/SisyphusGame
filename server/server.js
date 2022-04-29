const express = require('express'),mongoose = require('mongoose')
let app = express();
// mongoose连接数据库
mongoose.connect('mongodb://localhost:27017/gameInfo')
mongoose.connection.on('error',(err)=>{
    if(err) console.log(err);
})
mongoose.connection.on('open',()=>{
    console.log('连接成功');
})

// 设计数据模型
// 游戏信息模型
let game = new mongoose.Schema({
    name:{type:String,required:true},
    price:Number,
    nowPrice:Number,
    tags:Array,
    type:String,
    score:Number,
    imgUrl:String
})
// 评论信息模型
let comments = new mongoose.Schema({
    userName:{type:String,required:true},
    info:String,
    date:Date,
    stars:Number,
    gameName:String
})
// 将数据模型映射到数据库集合
let gameModel = mongoose.model('games',game,'games')
let commentsModel = mongoose.model('comments',comments)
// 设置静态文件
app.use(express.static('public'))

// 封装方法
let find = (target,res) =>{
    target.find({},(err,data)=>{
        if(err) console.log(err);
        res.send(JSON.stringify(data))
    })
}
// route path
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/view/index/index.html')
})
app.get('/game/:name',(req,res)=>{
    let name = req.params
    res.sendFile(__dirname +'/view/info/index.html')
})
// api
app.get('/api/gameInfo',(req,res)=>{
    find(gameModel,res)
})
app.get('/api/comments',(req,res)=>{
    find(commentsModel,res)
})
app.get('/api/popular',(req,res)=>{
    gameModel.find({},(err,data)=>{
        if(err) console.log(err);
        res.send(JSON.stringify(data))
    }).sort({'score':-1})
})
app.get('/api/issue',(req,res)=>{
    gameModel.find({},(err,data)=>{
        if(err) console.log(err);
        res.send(JSON.stringify(data))
    }).sort({'issue':-1})
})
app.get('/api/sales',(req,res)=>{
    gameModel.find({},(err,data)=>{
        if(err) console.log(err);
        res.send(JSON.stringify(data))
    }).sort({'sales':-1})
})
app.listen(3000,()=>{
    console.log('opened at port 3000')
})