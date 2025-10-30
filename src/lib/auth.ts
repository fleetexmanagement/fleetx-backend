import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
	admin,
	emailOTP,
	magicLink,
	organization,
	twoFactor,
	username,
} from "better-auth/plugins";
import { config } from "@/core/config";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
	appName: config.appName,
	baseURL: config.betterAuthUrl,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
		debugLogs: config.isDevelopment,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }, _request) => {
			// AUTH_TODO: send email to user
			console.log("[AUTH] Sending verification email to user", {
				user,
				url,
				token,
			});
		},
	},
	plugins: [
		admin(),
		organization(),
		username(),
		emailOTP({
			allowedAttempts: 5,
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "sign-in") {
					// AUTH_TODO: Send the OTP for sign in
					console.log("[AUTH] Sending OTP for sign in to user", {
						email,
						otp,
						type,
					});
				} else if (type === "email-verification") {
					// AUTH_TODO: Send the OTP for email verification
					console.log("[AUTH] Sending OTP for email verification to user", {
						email,
						otp,
						type,
					});
				} else {
					// AUTH_TODO: Send the OTP for password reset
					console.log("[AUTH] Sending OTP for password reset to user", {
						email,
						otp,
						type,
					});
				}
			},
		}),
		magicLink({
			sendMagicLink: async ({ email, token, url }, _request) => {
				// AUTH_TODO: send email to user
				console.log("[AUTH] Sending magic link to user", { email, token, url });
			},
		}),
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }, _request) {
					// AUTH_TODO: send email to user
					console.log("[AUTH] Sending OTP to user", { user, otp });
				},
			},
		}),
	],
});
