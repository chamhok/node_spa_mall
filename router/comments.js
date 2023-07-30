const express = require("express");
const router = express.Router();

const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");
const comment = require("../schemas/comment.js");
// 댓글 생성
router.post('/posts/:_postId/comments', async(req,res) => {
    try{
      const { _postId:postId } = req.params;
      const { user, password, content } = req.body;
      console.log(postId);
      if(content === undefined){
        return res.status(400).json({
          message: "댓글 내용을 입력해 주세요."
        })
      }
    
      const existsPost = await Post.find({_id:postId});
      if(existsPost.length){
        await Comment.create({ postId, user, password, content});
      }
    
      res.status(200).json({
        message: "댓글을 생성하였습니다.",
      });
  
    } catch (err){
      res.status(400).json({ 
        message: "데이터 형식이 올바르지 않습니다."
      });
    }
  
  });

// 댓글 목록 조회
router.get('/posts/:_postId/comments', async (req,res) => {
  try{
    const { _postId } = req.params;
    console.log('Post ID:', _postId);
    const comments = await Comment.find({});
    console.log('Comments:', comments); 
    const results = comments.map((comment) => {
      return {
        "commentId": comment._id,
        "user": comment.user,
        "content": comment.content,
        "createdAt": comment.createdAt
      }
    })
    
    res.status(200).json({
      "data": results
    })

  } catch (err){
    res.status(400).json({ 
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

// 댓글 수정
router.put('/posts/:_postId/comments/:_commentId', async (req,res) => {
  if(Object.keys(req.body).length === 0){
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    })
    return;
  }

  const { _commentId } = req.params;
  const { password, content } = req.body;

  try{

    if(content === undefined){
      return res.status(400).json({
        message: "댓글 내용을 입력해 주세요."
      });
    }

    const existsComment = await Comment.find({_id:_commentId});
    if(existsComment.length && existsComment[0].password === password){
      await Comment.updateOne({_id:_commentId},{$set:{content:content}});
    }

    res.status(200).json({
      message: "댓글을 수정했습니다."
    });
  } catch(err){
    res.status(404).json({
      message: "데이터 댓글 조회에 실패하였습니다."
    })
  }
});

// 댓글 삭제
router.delete('/posts/:_postId/comments/:_commentId', async(req,res) => {

  if(Object.keys(req.body).length === 0) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    })
    return;
  }

  const { _commentId } = req.params;
  const { password } = req.body;


  try{
    const existsComment = await Comment.find({_id:_commentId});
    console.log(existsComment.length);
    if(existsComment.length && existsComment[0].password === password){
      console.log(_commentId);
      await Comment.deleteOne({_id:_commentId});
    }
    
    res.status(200).json({
      message: "댓글을 삭제하였습니다."
    })

  } catch(err) {
    res.status(404).json({
      message: "댓글 조회에 실패하였습니다."
    })
    return;
  }

});

module.exports = router;