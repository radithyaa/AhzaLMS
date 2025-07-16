import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";
import { emailVerification } from "@/app/(auth)/login/_components/EmailVerification";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({email, otp}){
                await resend.emails.send({
                    from: `verification@${env.RESEND_EMAIL_ADDRESS}`,
                    to: [email],
                    subject: `${env.NEXT_PUBLIC_APP_NAME} - Verify your email`,
                    react: emailVerification({email, otp})
                });
            }
        })
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache duration in seconds
        },

    },
})