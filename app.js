const express = require('express');
const app = express();
const port = 3000;
const commentsRouter = require('./router/comments.js');
const postsRouter = require("./router/posts.js");
const connect = require("./schemas");
connect();

app.use(express.json());



// localgost:3000/api -> commentsRouter,postsRouter
app.use("/" , [commentsRouter,postsRouter]);



app.get('/', (req, res) => {
  res.send('반갑습니다. 강건욱의 블로그 입니다.');
});


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
