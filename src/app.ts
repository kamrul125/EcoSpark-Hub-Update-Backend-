import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import globalErrorHandler from './errors/globalErrorHandler';

const app: Application = express();

// ✅ পরিষ্কার এবং নিরাপদ CORS কনফিগারেশন
// CORS configuration
// - Add your deployed frontend host to `allowedOrigins` below
// - For quick testing set env `ALLOW_ALL_ORIGINS=true` to allow any origin
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === 'true';
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://project-update-frontend.vercel.app',
  'https://eco-spark-hub-update-frontend.vercel.app',
];

app.use(
  cors({
    origin: ALLOW_ALL_ORIGINS
      ? true
      : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
          // allow non-browser requests like curl/postman
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error('Not allowed by CORS'));
        },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Routes মাউন্ট করা হচ্ছে
app.use('/api/v1', router);

// সার্ভার স্ট্যাটাস চেক
app.get('/', (req: Request, res: Response) => {
  res.send('Eco Spark Hub Server Running 🚀');
});

// ✅ ৪-০৪ হ্যান্ডলার (ওয়াইল্ডকার্ড এরর এড়াতে শুধু app.use ব্যবহার করুন)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// গ্লোবাল এরর হ্যান্ডলার
app.use(globalErrorHandler);

export default app;