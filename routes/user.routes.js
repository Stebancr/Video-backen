import express from 'express';
import { logIn, viewUser, signUp } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', logIn);
router.get('/view/:userId?', viewUser);
router.post('/signup', signUp);

export default router;
