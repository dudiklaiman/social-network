import express from 'express'
import verifyToken from '../middlewares/auth.js';
import { createPost, getPostsFeed, getUserPosts, likePost } from '../controllers/postsControllers.js';

const router = express.Router();

router.post('/', verifyToken, createPost);
router.get('/', verifyToken, getPostsFeed);
router.get('/:userId', verifyToken, getUserPosts);
router.patch('/:id/like', verifyToken, likePost);


export default router;
