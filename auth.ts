import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Nodemailer from "next-auth/providers/nodemailer"
import Google from "next-auth/providers/google"
import clientPromise from "./lib/mongodb"
import { ObjectId } from "mongodb"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async session({ session, user }) {
            if (session?.user) {
                // Get additional user data from database
                const client = await clientPromise
                const db = client.db()
                
                const dbUser = await db.collection('users').findOne({
                    _id: new ObjectId(user.id)
                })

                // Add role to session
                session.user = {
                    ...session.user,
                    id: user.id,
                    role: dbUser?.role || 'user' // Default to 'user' if no role is set
                }
            }
            return session
        }
    },
    providers: [
        Google, 
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        })
    ],
})




