import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "./dbConnect";
import { signIn } from "next-auth/react";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            async authorize(credentials, req) {
                dbConnect();
                const { email, password } = credentials;
                const user = await User.findOne({email});
                if (!user){
                    throw new Error('Invalid username or password');
                }
                if (user && user.type !== "platform" && user.password === ""){
                    throw new Error('You have register as a social or google account, please login through this method or set a new password');
                }
                const isPasswordMatched = await bcrypt.compare(password, user.password);
                if (!isPasswordMatched){
                    throw new Error('Invalid username or password');
                }
                return user;
            },
        }),
    ],
    callbacks: {
        async signIn({user,account}){
            if (account.provider === "google"){
                const {email,name,image} = user;
                await dbConnect();
                const dbUser = await User.findOne({email});
                if (!dbUser){
                    await User.create({
                        email,
                        name,
                        image,
                        type: "google"
                    });
                }

            }
            return true;
        },
        jwt: async ({token, user}) => {
            const userByEmail = await User.findOne({email: token.email});
            userByEmail.password = undefined;
            userByEmail.resetCode = undefined;
            token.user = userByEmail;
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user;
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    }
};