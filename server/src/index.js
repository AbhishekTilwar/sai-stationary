import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import paymentsRouter from './routes/payments.js';
import ordersRouter from './routes/orders.js';
import productsRouter from './routes/products.js';
import notificationsRouter from './routes/notifications.js';
import seoRouter from './routes/seo.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
    credentials: true,
  })
);
app.use(morgan('dev'));

// Razorpay webhook needs the raw body for signature verification, so mount it
// BEFORE the JSON body parser.
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '1mb' }));

app.use(
  '/api',
  rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false })
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/payments', paymentsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/', seoRouter); // /sitemap.xml, /robots.txt

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🛍️  Sai Stationary API running on http://localhost:${PORT}`);
});
