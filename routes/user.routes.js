import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.js';
import {
  getMe,
  getUser,
  login,
  register,
  updateUser,
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.route('/register').post(upload.single('profilePicture'), register);

router.route('/login').post(login);

router.route('/me').get(verifyJWT, getMe);
router
  .route('/:userId')
  .get(verifyJWT, getUser)
  .patch(verifyJWT, upload.single('profilePicture'), updateUser);

export default router;
