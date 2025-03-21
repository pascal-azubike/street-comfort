import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import EmailProvider from "next-auth/providers/nodemailer"
import Google from "next-auth/providers/google"
import clientPromise from "./lib/mongodb"
import { ObjectId } from "mongodb"
import nodemailer from 'nodemailer'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),

    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                const client = await clientPromise;
                const db = client.db();
                
                // Check if user exists with this email
                const existingUser = await db.collection('users').findOne({
                    email: user.email
                });

                if (existingUser) {
                    // Link the Google account to the existing user
                    await db.collection('accounts').updateOne(
                        { userId: existingUser._id },
                        { 
                            $set: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                access_token: account.access_token,
                                id_token: account.id_token,
                                scope: account.scope,
                                token_type: account.token_type,
                                expires_at: account.expires_at
                            }
                        },
                        { upsert: true }
                    );
                } else {
                    // For new users, ensure createdAt is set
                    await db.collection('users').updateOne(
                        { email: user.email },
                        { 
                            $setOnInsert: { 
                                createdAt: new Date().toISOString(),
                                role: 'user',
                                status: 'active'
                            }
                        },
                        { upsert: true }
                    );
                }
            } else {
                // For email/password sign in, ensure createdAt is set for new users
                const client = await clientPromise;
                const db = client.db();
                await db.collection('users').updateOne(
                    { email: user.email },
                    { 
                        $setOnInsert: { 
                            createdAt: new Date().toISOString(),
                            role: 'user',
                            status: 'active'
                        }
                    },
                    { upsert: true }
                );
            }
            return true;
        },
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
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                secure: true,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest({
                identifier: email,
                url,
                provider: { server, from },
            }) {
                const serverConfig = typeof server === 'string' ? server : server as any;
                if (!serverConfig?.host || !serverConfig?.port) {
                    throw new Error('Server configuration is missing');
                }
                console.log(serverConfig)
                const transport = nodemailer.createTransport(typeof server === 'string' ? server : {
                    host: serverConfig.host,
                    port: serverConfig.port,
                    secure: serverConfig.port === 465, // true for 465, false for other ports
                    auth: {
                        user: serverConfig.auth.user,
                        pass: serverConfig.auth.pass,
                    },
                   
                });

                const { host } = new URL(url)

                const emailTemplate = `
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                    color: #E6DDD6;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background-color: #1A1A1A;
                                }
                                .email-container {
                                    padding: 30px;
                                    background-color: #2A2A2A;
                                    border-radius: 12px;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                                    margin: 20px;
                                }
                                .header {
                                    text-align: center;
                                    padding: 20px 0;
                                    border-bottom: 2px solid #593C2D;
                                    margin-bottom: 30px;
                                }
                                .logo {
                                    font-size: 28px;
                                    font-weight: bold;
                                    color: #E6DDD6;
                                    margin-bottom: 10px;
                                }
                                .content {
                                    background: #333333;
                                    padding: 25px;
                                    border-radius: 8px;
                                    margin: 20px 0;
                                    text-align: center;
                                }
                                .button {
                                    display: inline-block;
                                    padding: 12px 24px;
                                    background-color: #593C2D;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 6px;
                                    margin: 20px 0;
                                    box-shadow: 0 0 10px #593C2D,
                                              0 0 20px #593C2D,
                                              0 0 30px #593C2D;
                                }
                                .neon-text {
                                    text-shadow: 0 0 5px #fff,
                                               0 0 10px #fff,
                                               0 0 15px #593C2D,
                                               0 0 20px #593C2D;
                                }
                                .neon-border {
                                    border: 1px solid #593C2D;
                                    box-shadow: 0 0 5px #593C2D,
                                              inset 0 0 5px #593C2D;
                                    padding: 15px;
                                    border-radius: 8px;
                                }
                                .footer-button {
                                    display: inline-block;
                                    padding: 8px 16px;
                                    background-color: #593C2D;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 4px;
                                    margin: 0 5px;
                                    box-shadow: 0 0 5px #593C2D;
                                }
                                .footer {
                                    text-align: center;
                                    color: #8B7B73;
                                    font-size: 14px;
                                    margin-top: 20px;
                                }
                                .footer-links a {
                                    color: #E6DDD6;
                                    text-decoration: none;
                                    margin: 0 10px;
                                }
                                .footer-links a:hover {
                                    text-decoration: underline;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="header">
                                    <div class="logo">STREET COMFORT</div>
                                </div>
                                
                                <div class="content neon-border">
                                    <h2 style="color: #E6DDD6;" class="neon-text">Sign in to Street Comfort</h2>
                                    <p>Click the button below to sign in to your account.</p>
                                    <p>If you didn't request this email, you can safely ignore it.</p>
                                    <a href="${url}" class="button">Sign in to Street Comfort</a>
                                    <p style="margin-top: 20px; font-size: 14px; color: #8B7B73;">
                                        This link will expire in 24 hours.
                                    </p>
                                </div>
                                
                                <div class="footer">
                                    <p>Street Comfort Nigeria</p>
                                    <div class="footer-links">
                                        <a href="https://www.streetcomfortwear.com" class="footer-button">Home</a>
                                        <a href="https://www.streetcomfortwear.com/shop" class="footer-button">Shop</a>
                                    </div>
                                    <p>This email was sent to ${email}</p>
                                </div>
                            </div>
                        </body>
                    </html>
                `

                await transport.sendMail({
                    to: email,
                    from: {
                        name: "Street Comfort",
                        address: from!,
                    },
                    subject: `Sign in to Street Comfort`,
                    html: emailTemplate,
                })
            },
        })
    ],
})