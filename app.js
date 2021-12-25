// 定义一个con绑定 .container
if (typeof window !== 'undefined') {
  const con=document.querySelector('.container');

// 定义两个函数开关（门）
let isIn=true;      //鼠标进去的门，默认打开
let isOut=false;    //鼠标出去的门，默认关闭
var span;           //给未出生的元素取个名字
//监听鼠标进去的事件+进去的方法
con.addEventListener('mouseenter',(e)=>{
  if(isIn){//如果进去的门时打开的，就可以执行这个函数

      //获取进入的鼠标位置
      //生成元素的位置=进入点距离窗口的距离-父盒子距离窗口的距离
      let inx=e.clientX-e.target.offsetLeft;
      let iny=e.clientY-e.target.offsetTop;

      //创建一个span元素，并且给它对应的出生坐标
      let el=document.createElement('span');
      el.style.left=inx+'px';
      el.style.top=iny+'px';
      con.appendChild(el);//添加到con对应的父元素，即container

      $('.container span').removeClass('out');//除去出去的动画 不知道这样写是不是不太好
      $('.container span').addClass('in');//添加进入的动画
      span=document.querySelector('.container span');
      isIn=false; //关闭进来的门（不能使用进入的方法）
      isOut=true; //打开出去的门（可以使用出去的方法）
  }
})

//监听鼠标出来的事件+出来的方法
con.addEventListener('mouseleave',(e)=>{
  if(isOut){
      //获取出去的鼠标位置
      //生成元素的位置=进入点距离窗口的距离-父盒子距离窗口的距离
      let inx=e.clientX-e.target.offsetLeft;
      let iny=e.clientY-e.target.offsetTop;

      // 
      $('.container span').removeClass('in');//移除进入的动画
      $('.container span').addClass('out');//添加出去的动画
      $('.out').css('left',inx+'px');//添加出去的坐标
      $('.out').css('top',iny+'px');

      isOut=false;//关闭出去的大门
      //当动画结束后再删除元素
      setTimeout(()=>{
          con.removeChild(span);//删除元素
          isIn=true;//打开进来的大门
      },500)
      
  }
})
  }
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 1、导入session
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/************** 登录控制 ************/
// 2、session配置
app.use(session({
  secret: 'qf project',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 5
  } // 指定登录会话的有效时长
}));

// 登录拦截，必须先登录
app.get('*', function (req, res, next) {
  const path = req.path;
  const userName = req.session.userName;
  if (path !== '/users/login' && path !== '/users/regist') {
    if (!userName) {
      res.redirect('/users/login');
    }
  }
  next();
});

/************** 登录控制 ************/
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article', articleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.listen(50526);