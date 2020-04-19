const express = require('express');
const router =  express.Router();
const {check, validationResult} = require ('express-validator');
const Post = require('../../models/Posts');
const Profile = require('../../models/Profile')
const auth = require('../../middleware/auth');
const storage = require('../../utils/imageConfig');
const multer = require('multer');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        // const limit= parseInt(req.query.limit)
        const limit = 8
        const posts = await Post.find()
                                .skip((page - 1) * limit)
                                .limit(limit)
                                .sort({createdAt: -1})
                                .populate('user', ['name', 'avatar'])
                                .populate('likes.user', ['name', 'avatar' ])
        res.json(posts);
    } catch (err) {
        console.error(err.messgae)
        return res.status(500).json('Server error')
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const posts = await Post.find({user: req.user.id}).sort({
            createdAt: -1
        })
        return res.json(posts);
    } catch (err) {
        console.error(err.messgae)
        return res.status(500).json('Server error')
    }
});

router.get('/user/:id', auth, async (req, res) => {
    try {
        const posts = await Post.find({user: req.params.id}).sort({
            createdAt: -1
        }).populate('user', ['name', 'avatar'])
        res.json(posts);
    } catch (err) {
        console.error(err.messgae)
        return res.status(500).json('Server error')
    }
});

//image upload
const imageFilter = function(req, file, cb) {
   
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are accepted!'), false);
    }
    cb(null, true);
    };

const upload = multer({ storage: storage, fileFilter: imageFilter });
const cloudinary = require("cloudinary");
cloudinary.config({
cloud_name: process.env.CLOUD_NAME, //ENTER YOUR CLOUDINARY NAME
api_key: process.env.CLOUDINARY_API_KEY, // THIS IS COMING FROM CLOUDINARY WHICH WE SAVED FROM EARLIER
api_secret: process.env.CLOUDINARY_API_SECRET // ALSO COMING FROM CLOUDINARY WHICH WE SAVED EARLIER
});
router.post('/', [auth ,upload.single("image")], async(req, res)=>{
    if(!req.file.path ){
        return res.status(400).json({errors : [{msg : 'Please select an image'}]})
    }
   
   
cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
    if(err){
        return res.status(400).json({msg: 'Something went wrong'})
    }
    const image = result.secure_url ;
    const imageId = result.public_id;
    
    try {
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(400).json({errors : [{msg : "User doesn't exists."}]})
        }
        const profile = await Profile.findOne({user: req.user.id})
        const newPost = await new Post({
            user : req.user.id,
            profile: profile.id,
            image: image,
            imageId: imageId,
            caption: req.body.caption
        });
        const post = await newPost.save();
        const popluatePost = await post.populate('user', ['name', 'avatar']).populate('likes.user', ['name', 'avatar' ]).populate('comments.user', ['name', 'avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate()
        res.json(popluatePost);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
} )
});

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', ['name', 'avatar']).populate('likes.user', ['name', 'avatar' ]).populate('comments.user', ['name', 'avatar']).populate('comments.replies.user', ['name', 'avatar'])
        if (!post) {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        res.json(post);
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({
                msg: 'Post not found'
            })
        }
        console.error(err.messgae);
        return res.status(500).json('Server error')
    };
});
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        if (String(post.user) !== req.user.id) {
            return res.status(401).json({
                msg: 'user not authorized'
            })
        };
        await post.remove();

        res.json({
            msg: 'post removed'
        });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        console.error(err.message);
        return res.status(500).json('Server error')
    };
});
//update like in post
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        const profile = await Profile.findOne({user: req.user.id})
        if(!profile){
            return res.status(400).json({
                msg: 'You must create your profile first'
            })
        }
        //check if it has been liked
        if (post.likes.filter(like => String(like.user) === req.user.id).length > 0) {
            const removeIndex = post.likes.map(like => String(like.user)).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1)
            await post.save();
            const postl= await post.populate('likes.user', ['name', 'avatar']).execPopulate();
            return res.json(postl.likes);
        }
        post.likes.unshift({
            user: req.user.id,
        });
        await post.save();
        const postLikes= await post.populate('likes.user', ['name', 'avatar']).execPopulate();
        res.json(postLikes.likes);

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        console.error(err.message);
        return res.status(500).json('Server error')
    }
});
//add comment
router.put('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        const profile = await Profile.findOne({user: req.user.id})
        if(!profile){
            return res.status(400).json({
                msg: 'You must create your profile first'
            })
        }
        const newComment = {
            user: req.user.id,
            text: req.body.text,
        };
        post.comments.unshift(newComment)
        await post.save();
        const allComments = await post.populate('comments.user', ['name','avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate();
        res.json(allComments.comments);
    } catch (err) {
        console.error(err.message)
        return res.status(500).json('Server Error')
    }
});
//like reply to comment
router.put('/:id/comment/:comment_id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        const comment = post.comments.find(comment=> comment.id === req.params.comment_id);
        if(!comment){
           return res.status(404).json({msg: 'Comment does not exist'});
        };
       

        const commentIndex = post.comments.map(comment => String(comment._id)).indexOf(req.params.comment_id);
        //check if it has been liked
        if (post.comments[commentIndex].likes.filter(like => String(like.user) === req.user.id).length > 0) {
            const removeIndex = post.comments[commentIndex].likes.map(like => String(like.user)).indexOf(req.user.id);
            post.comments[commentIndex].likes.splice(removeIndex, 1)
            await post.save();
            const postLikes= await post.populate('comments.user', ['name', 'avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate();
            return res.json(postLikes.comments);
        }
        post.comments[commentIndex].likes.unshift({
            user: req.user.id,
        });
        await post.save();
        const postLikes= await post.populate('comments.user', ['name', 'avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate();
        res.json(postLikes.comments);

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        console.error(err.message);
        return res.status(500).json('Server error')
    }
});
// update like to reply
router.put('/:id/comment/:comment_id/reply/:reply_id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        const comment = post.comments.find(comment=> comment.id === req.params.comment_id);
        if(!comment){
           return res.status(404).json({msg: 'Comment does not exist'});
        };
        const commentIndex = post.comments.map(comment => String(comment._id)).indexOf(req.params.comment_id);
        //check if it has been liked
        const replyIndex = post.comments[commentIndex].replies.findIndex(comment => String(comment._id) === req.params.reply_id) ;
        if(replyIndex === -1){
            return res.json({msg:"Reply doesn't exists"})
        }
        
        if (post.comments[commentIndex].replies[replyIndex].likes.filter(like => String(like.user) === req.user.id).length > 0) {
            const removeIndex = post.comments[commentIndex].replies[replyIndex].likes.map(like => String(like.user)).indexOf(req.user.id);
            post.comments[commentIndex].replies[replyIndex].likes.splice(removeIndex, 1)
            await post.save();
            const postLikes= await post.populate('comments.user', ['name', 'avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate();
            return res.json(postLikes.comments);

        }
        post.comments[commentIndex].replies[replyIndex].likes.unshift({
            user: req.user.id,
        });
        await post.save();
        const postLikes= await post.populate('comments.user', ['name', 'avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate();
        res.json(postLikes.comments);

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({
                msg: 'Post not found'
            })
        };
        console.error(err.message);
        return res.status(500).json('Server error')
    }
});
//delete comment
router.delete('/comment/:id/:comment_id', auth, async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment=> comment.id === req.params.comment_id);
        if(!comment){
           return res.status(404).json({msg: 'Comment does not exist'});
        };
        if(String(comment.user) !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        };
        const removeIndex = post.comments.map(comment => String(comment._id)).indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1)
        await post.save();
        const allComments = await post.populate('comments.user', ['name','avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate();
        res.json(allComments.comments);
    }catch(err){
        console.error(err.message);
        return res.json('Server error');
    }
});
//add reply to comment
router.put('/:id/comment/:comment_id/reply', [auth, [
    check('text', 'Text is required').not().isEmpty(),
]], async(req, res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try{
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment=> comment.id === req.params.comment_id);
        if(!comment){
           return res.status(404).json({msg: 'Comment does not exist'});
        };
        const commentIndex = post.comments.map(comment => String(comment._id)).indexOf(req.params.comment_id);
        const newComment = {
            user: req.user.id,
            text: req.body.text,
        };
        post.comments[commentIndex].replies.unshift(newComment)
        await post.save();
        const allComments = await post.populate('comments.user', ['name','avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate();
        res.json(allComments.comments);
    }catch(err){
        console.error(err.message);
        return res.json('Server error');
    }
});
//delete reply to comment
router.delete('/:id/comment/:comment_id/reply/:reply_id', auth, async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment=> String(comment._id) === req.params.comment_id);
        if(!comment){
           return res.status(404).json({msg: 'Comment does not exist'});
        };
        
        const commentIndex = post.comments.map(comment => String(comment._id)).indexOf(req.params.comment_id);
        
        const removeIndex = post.comments[commentIndex].replies.findIndex(comment => String(comment._id) === req.params.reply_id) ;
        if(removeIndex === -1){
            return res.json({msg:"Reply doesn't exists"})
        }
        if(String(post.comments[commentIndex].replies[removeIndex].user) !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        };
       

        post.comments[commentIndex].replies.splice(removeIndex, 1)
        await post.save();
        const allComments = await post.populate('comments.user', ['name','avatar']).populate('comments.replies.user', ['name', 'avatar']).execPopulate();
        res.json(allComments.comments);
    }catch(err){
        console.error(err.message);
        return res.json('Server error');
    }
});



module.exports = router;
