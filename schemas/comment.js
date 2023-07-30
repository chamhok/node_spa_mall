const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user : {
        type: String,
        required: true,
    },
    title:{
        type:String,
        required: true,
    },
    postId : {
        type: String,
        require : true,
        unique: true
    },
    createdAt : {
        type: String,
        require: true,
    },
    commentId:{
        type : String,
        unique: true

    }
});

module.exports = mongoose.model("comment", commentSchema);