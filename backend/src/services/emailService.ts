import nodemailer from 'nodemailer';

// Email configuration
const ADMIN_EMAIL = 'chinnukrishna45@gmail.com';
const EMAIL_USER = process.env.EMAIL_USER || 'chinnukrishna45@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'gcmt aloa sepp kwmx';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS.replace(/\s/g, '') // Remove spaces from app password
    }
});

export interface ReviewEmailData {
    authorName: string;
    content: string;
    type: 'review' | 'idea';
    submittedAt: string;
}

export async function sendReviewNotification(data: ReviewEmailData): Promise<boolean> {
    const typeLabel = data.type === 'idea' ? '💡 New Idea' : '📝 New Review';
    const typeColor = data.type === 'idea' ? '#6366f1' : '#10b981';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header .logo { font-size: 32px; margin-bottom: 10px; }
        .badge { display: inline-block; background: ${typeColor}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-top: 15px; }
        .content { padding: 30px; }
        .meta { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .meta-item { display: flex; margin-bottom: 8px; }
        .meta-label { font-weight: 600; color: #6b7280; width: 100px; }
        .meta-value { color: #1f2937; }
        .message-box { background: #fefce8; border-left: 4px solid #eab308; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
        .message-box h3 { margin: 0 0 10px 0; color: #854d0e; font-size: 14px; text-transform: uppercase; }
        .message-box p { margin: 0; color: #1f2937; font-size: 16px; line-height: 1.6; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        .footer a { color: #3b82f6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📖 ✝️ 🧠</div>
            <h1>Bible Mind Community</h1>
            <div class="badge">${typeLabel}</div>
        </div>
        <div class="content">
            <div class="meta">
                <div class="meta-item">
                    <span class="meta-label">From:</span>
                    <span class="meta-value">${data.authorName}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Type:</span>
                    <span class="meta-value">${data.type === 'idea' ? 'Feature Idea / Suggestion' : 'Review / Feedback'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Submitted:</span>
                    <span class="meta-value">${new Date(data.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>
            </div>
            
            <div class="message-box">
                <h3>Message Content</h3>
                <p>${data.content.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
        <div class="footer">
            <p>This notification was sent automatically from <a href="https://bible-mind.vercel.app">Bible Mind</a></p>
            <p>© ${new Date().getFullYear()} Bible Mind Community</p>
        </div>
    </div>
</body>
</html>
    `;

    try {
        await transporter.sendMail({
            from: `"Bible Mind" <${EMAIL_USER}>`,
            to: ADMIN_EMAIL,
            subject: `${typeLabel} from ${data.authorName} - Bible Mind`,
            html: htmlContent
        });
        console.log('Email notification sent successfully');
        return true;
    } catch (error) {
        console.error('Failed to send email notification:', error);
        return false;
    }
}
