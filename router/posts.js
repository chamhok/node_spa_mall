const express = require("express");
const Post = require("../schemas/post");
const router = express.Router();


// 게시글 작성
router.post("/posts", async(req, res) => {
    try{
      const { user, password, title, content } = req.body;
  
      await Post.create({user, password, title, content});
  
      res.status(200).json({
        message: "게시글을 생성하였습니다.",
      });
    } catch(err){
      res.status(400).json({
        message: "데이터 형식이 올바르지 않습니다."
      });
    }
  
  });
  
  // 게시글 조회
router.get('/posts', async(req, res) => {
  
    const posts = await Post.find({}).sort({createdAt:-1});

    const results = posts.map((post) => {
        return {
        "postId": post._id,
        "user": post.user,
        "content": post.content,
        "createdAt": post.createdAt
        }
    })

    res.status(200).json({
        "data": results
    })
});

   /// 게시글 상세 조회
router.get('/posts/:_postId', async(req,res) => {
    try{
      const { _postId } = req.params;
      const [targetPost] = await Post.find({_id:_postId});
      
      result = {
        "postId": targetPost._id,
        "user": targetPost.user,
        "title": targetPost.title,
        "content": targetPost.content,
        "createdAt": targetPost.createdAt
      }
    
      res.status(200).json({
        "data": result
      });
    } catch(err){
      res.status(400).json({
        message: "데이터 형식이 올바르지 않습니다."
      });
    }
  });

    /// 게시글 수정
router.put('/posts/:_postId', async(req,res) => {
    try{
      const { _postId } = req.params;
      const {password,title,content} = req.body;
      
      if( !password || !title || !content ){
        return res.status(400).json({
          message: "데이터 형식이 올바르지 않습니다."
        })
      }

      const existsPost = await Post.find({_id:_postId})
      if(existsPost[0].password === password){
        await Post.updateOne({_id:_postId}, {$set:{password:password, title:title, content:content}});
      }
  
      res.status(200).json({ 
        message: "게시글을 수정하였습니다."
      });
  
    } catch(err) {
      res.status(404).json({ 
        message: "게시글 조회에 실패하였습니다."
      });
    }  
  });
  
//게시글 삭제
router.delete('/posts/:_postId', async (req, res) => {
    try {
      const { _postId } = req.params;
  
      const existingPost = await Post.findById(_postId);
      if (!existingPost) {
        return res.status(404).json({
          message: "게시글 조회에 실패하였습니다."
        });
      }
  
      await Post.deleteOne({ _id: _postId });
  
      res.status(200).json({
        message: "게시글을 삭제하였습니다."
      });
    } catch (err) {
      res.status(400).json({
        message: "데이터 형식이 옳바르지 않습니다.",
        error: err.message
      });
    }
  });
  
  module.exports = router;
  