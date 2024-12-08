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
                dbConnect();
                const dbUser = User.findOne({email});
                if (!dbUser){
                    await User.create({
                        email,
                        name,
                        image,
                        password: "google-pass"
                    }).save();
                }

            }
            return true;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    }
};