import express from 'express'
import verifyToken from '../middlewares/auth.js'
import { getUser, searchUsers, getUserFriends, addRemoveFriend, editProfile, deleteProfile } from '../controllers/usersControllers.js';

const router = express.Router();

router.get('/search', verifyToken, searchUsers);
router.get('/:userId', verifyToken, getUser);
router.get('/:userId/friends', verifyToken, getUserFriends);
router.patch('/:userId/:friendId', verifyToken, addRemoveFriend);

router.put('edit/:userId', verifyToken, editProfile);
router.delete('/delete/:userId', verifyToken, deleteProfile);


export default router;
