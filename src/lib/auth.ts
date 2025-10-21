import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, twoFactor, username } from "better-auth/plugins";
import { config } from "@/core/config";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
	appName: config.appName,
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
		username(),
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
