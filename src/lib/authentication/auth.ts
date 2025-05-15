/**
 * Authentication configuration using Better Auth with Next.js 15.
 * This module integrates Prisma, Redis, and email services for a robust authentication system.
 */
import { sendMail } from '@/lib/mail/mail';
import { Redis } from '@upstash/redis';

import { prismaServerless } from '../databases/serverless';
import { Get2FAEmailTemplate } from '../mail/templates/2fa-otp';
import { GetResetPasswordEmailTemplate } from '../mail/templates/send-reset-password';
import { GetVerificationEmailTemplate } from '../mail/templates/send-verification-email';
import { siteConfig } from '../site/site-config';
import { betterAuth } from 'better-auth';
import { emailHarmony } from 'better-auth-harmony';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { captcha, customSession, haveIBeenPwned, openAPI, twoFactor } from 'better-auth/plugins';

const SENT_FROM = process.env.SMTP_FROM || 'no-reply.mocktrackr@lethargic.online';
const db = process.env.NODE_ENV === 'development' ? prisma : prismaEdge;
/**
 * Authentication configuration object.
 */
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
});
const VERCEL_PROD = !!process.env.VERCEL_URL!;
export const auth = betterAuth({
    appName: siteConfig.name,
    database: prismaAdapter(db, {
        provider: 'sqlite'
    }),
    trustedOrigins: [VERCEL_PROD ? process.env.VERCEL_URL! : process.env.NEXT_PUBLIC_APP_URL!],
    account: {
        accountLinking: {
            trustedProviders: ['google', 'mocktrackr']
        }
    },
    user: {
        deleteUser: {
            enabled: true
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600 * 24,
        /**
         * Send a verification email to the user.
         * @param {Object} params - Parameters for the email.
         * @param {Object} params.user - The user object.
         * @param {string} params.token - The verification token.
         * @param {string} params.url - The verification URL.
         */
        sendVerificationEmail: async ({ user, token }) => {
            const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&callbackURL=/verify-email`;
            const emailHtml = GetVerificationEmailTemplate(user, verificationUrl);
            await sendMail({
                from: `"${siteConfig.name} Team" <${SENT_FROM}>`,
                to: user.email,
                subject: `Confirm Your Email for Secure Access to ${siteConfig.name}`,
                html: emailHtml
            });
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        autoSignIn: true,
        minPasswordLength: 8,
        maxPasswordLength: 16,
        resetPasswordTokenExpiresIn: 3600,
        /**
         * Send a password reset email to the user.
         * @param {Object} params - Parameters for the email.
         * @param {Object} params.user - The user object.
         * @param {string} params.url - The reset password URL.
         */
        sendResetPassword: async ({ user, token }) => {
            const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&callbackURL=/login`;
            const emailHtml = GetResetPasswordEmailTemplate(user, verificationUrl);
            await sendMail({
                from: `"${siteConfig.name} Team" <${SENT_FROM}>`,
                to: user.email,
                subject: `Password Reset Request for Your ${siteConfig.name} Account`,
                html: emailHtml
            });
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
        }
    },
    SecondaryStorage: {
        get: async (key: string): Promise<string | null> => {
            const value = await redis.get(key);

            return value?.toString() ?? null;
        },
        set: async (key: string, value: string, ttl?: number): Promise<void> => {
            if (ttl) await redis.set(key, value, { ex: ttl });
            else await redis.set(key, value);
        },
        delete: async (key: string): Promise<void> => {
            await redis.del(key);
        }
    },
    session: {
        enabled: true,
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
        freshAge: 60 * 60 * 24
    },
    rateLimit: {
        enabled: true,
        window: 60, // 1 minute window
        max: 40, // max 10 requests per window per user/IP
        secondaryStorage: redis
    },

    plugins: [
        haveIBeenPwned({
            customPasswordCompromisedMessage:
                'This password has been compromised. Please choose a more secured password.'
        }),
        emailHarmony(),
        captcha({
            provider: 'cloudflare-turnstile', // or google-recaptcha, hcaptcha
            secretKey: process.env.TURNSTILE_SECRET_KEY!
        }),
        twoFactor({
            otpOptions: {
                /**
                 * Send a 2FA OTP to the user.
                 * @param {Object} params - Parameters for the OTP.
                 * @param {Object} params.user - The user object.
                 * @param {string} params.otp - The OTP code.
                 */
                sendOTP: async ({ user, otp }) => {
                    const emailHtml = Get2FAEmailTemplate(user, otp);
                    await sendMail({
                        from: `"${siteConfig.name} Team" <${SENT_FROM}>`,
                        to: user.email,
                        subject: `Your 2FA Code for Secure Login to ${siteConfig.name}`,
                        html: emailHtml
                    });
                }
            }
        }),
        customSession(async ({ user, session }) => {
            const dbUser = await db.user.findUnique({
                where: {
                    id: user.id
                }
            });

            return {
                user: {
                    ...user,
                    twoFactorEnabled: dbUser?.twoFactorEnabled || null,
                    role: dbUser?.role || 'USER'
                },
                session
            };
        }),
        openAPI()
    ]
});
