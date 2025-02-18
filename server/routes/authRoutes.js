import express from 'express'
import { register, login } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/keepalive', (req, res) => {
    res.send('Server is live');
});


export default router;
