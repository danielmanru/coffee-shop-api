import express from 'express';
import userRouter from "./user-api.js";
import publicRouter from "./public-api.js";
import menuRouter from "./menu-api.js";
import outletRouter from "./outlet-api.js";
import imageRouter from "./image-api.js";

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    return res.json({
      success: true,
      message: 'Welcome to coffee shop API'
    });
  } catch (error) {
    next(error)
  }
});
router.use('/', publicRouter)
router.use('/users', userRouter);
router.use('/menus', menuRouter);
router.use('/outlets', outletRouter);
router.use('/images', imageRouter);


export default router;