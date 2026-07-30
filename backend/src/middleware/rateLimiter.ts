import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // limit auth attempts to 20 per 15 minutes
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
});
