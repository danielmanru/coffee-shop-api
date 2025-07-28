import express from 'express';
import userRouter from "./user-api.js";
import publicRouter from "./public-api.js";
import menuRouter from "./menu-api.js";
import outletRouter from "./outlet-api.js";
import imageRouter from "./image-api.js";
import cartRouter from "./cart-api.js";
import orderRouter from "./order-api.js";
import paymentRouter from "./payment-api.js";
import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const swaggerPath = path.join(__dirname, '../../docs/api-docs.yaml');
const swaggerDocument = path.join(__dirname, '../../docs/api-docs.json');
// const swaggerDocument = YAML.load(swaggerPath)
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
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/', publicRouter)
router.use('/users', userRouter);
router.use('/menus', menuRouter);
router.use('/outlets', outletRouter);
router.use('/images', imageRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/payments', paymentRouter);


export default router;