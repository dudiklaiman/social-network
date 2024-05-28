import express from 'express'
import verifyToken from '../middlewares/auth.js';
import { createPost, getPostsFeed, getUserPosts, likePost, deletePost } from '../controllers/postsControllers.js';
import { addComment, likeComment, deleteComment } from '../controllers/commentControllers.js'

const router = express.Router();

router.post('/', verifyToken, createPost);
router.get('/', verifyToken, getPostsFeed);
router.get('/:userId', verifyToken, getUserPosts);
router.patch('/like/:postId', verifyToken, likePost);
router.delete('/delete/:postId', verifyToken, deletePost);

router.post('/comments/:postId', verifyToken, addComment);
router.patch('/comments/like/:commentId', verifyToken, likeComment);
router.delete('/comments/delete/:commentId', verifyToken, deleteComment);


export default router;
