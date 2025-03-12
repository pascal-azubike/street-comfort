import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { name, email, telephone, message } = await req.json();

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        const emailTemplate = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #462901;
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        .email-container {
                            padding: 20px;
                            background-color: #FDF7F5;
                            border-radius: 8px;
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            border-bottom: 2px solid #B68C66;
                            margin-bottom: 20px;
                        }
                        .logo {
                            font-size: 24px;
                            font-weight: bold;
                            color: #462901;
                        }
                        .content {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .field {
                            margin-bottom: 15px;
                        }
                        .label {
                            font-weight: bold;
                            color: #B68C66;
                        }
                        .value {
                            color: #462901;
                        }
                        .footer {
                            text-align: center;
                            padding-top: 20px;
                            border-top: 2px solid #B68C66;
                            color: #8B7B73;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <div class="logo">SHIMMER</div>
                            <div style="color: #8B7B73;">New Contact Form Submission</div>
                        </div>
                        
                        <div class="content">
                            <div class="field">
                                <div class="label">Name:</div>
                                <div class="value">${name}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Email:</div>
                                <div class="value">${email}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Telephone:</div>
                                <div class="value">${telephone}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Message:</div>
                                <div class="value">${message}</div>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>This message was sent from the contact form at Shimmer.com</p>
                            <p>© ${new Date().getFullYear()} Shimmer. All rights reserved.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_FROM,
            subject: `New Contact Form Submission from ${name}`,
            html: emailTemplate,
        });

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to send email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
} 