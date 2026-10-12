import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { name, email, telephone, message } = await req.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create transporter with Zoho configuration
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: true, // true for port 465
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            }
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
                            background-color: #FDF7F5;
                        }
                        .email-container {
                            padding: 30px;
                            background-color: #ffffff;
                            border-radius: 12px;
                            box-shadow: 0 2px 4px rgba(89, 60, 45, 0.1);
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
                            color: #593C2D;
                            margin-bottom: 10px;
                        }
                        .subtitle {
                            color: #8B7B73;
                            font-size: 16px;
                        }
                        .content {
                            background: #FDF7F5;
                            padding: 25px;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .field {
                            margin-bottom: 20px;
                            border-bottom: 1px solid rgba(89, 60, 45, 0.1);
                            padding-bottom: 15px;
                        }
                        .field:last-child {
                            border-bottom: none;
                        }
                        .label {
                            font-weight: bold;
                            color: #593C2D;
                            margin-bottom: 5px;
                        }
                        .value {
                            color: #462901;
                        }
                        .footer {
                            text-align: center;
                            padding-top: 20px;
                            border-top: 2px solid #593C2D;
                            margin-top: 30px;
                        }
                        .links {
                            margin: 20px 0;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #593C2D;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            margin: 0 10px;
                        }
                        .contact-info {
                            color: #8B7B73;
                            font-size: 14px;
                            margin-top: 20px;
                        }
                        .timestamp {
                            color: #8B7B73;
                            font-size: 12px;
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <div class="logo">STREET COMFORT</div>
                            <div class="subtitle">New Contact Form Submission</div>
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
                                <div class="value">${telephone || 'Not provided'}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Message:</div>
                                <div class="value">${message}</div>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <div class="links">
                                <a href="https://www.streetcomfortx.com" class="button">Visit Website</a>
                                <a href="https://www.streetcomfortx.com/shop" class="button">Shop Now</a>
                            </div>
                            
                            <div class="contact-info">
                                <p>Street Comfort Nigeria</p>
                                <p>Jl. Wilis no.13, Lagos</p>
                                <p>Tel: +234 806 028 3727</p>
                                <p>Email: hello@pascal-azubike.dev</p>
                            </div>
                            
                            <div class="timestamp">
                                Submitted on ${new Date().toLocaleString('en-NG', { 
                                    timeZone: 'Africa/Lagos',
                                    dateStyle: 'full',
                                    timeStyle: 'long'
                                })}
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;

        const mailOptions = {
            from: {
                name: 'Street Comfort',
                address: process.env.EMAIL_FROM!
            },
            to: process.env.EMAIL_FROM,
            subject: `New Contact Form Submission from ${name}`,
            html: emailTemplate,
            replyTo: email
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to send email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
} 
