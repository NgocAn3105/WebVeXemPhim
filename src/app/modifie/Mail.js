const nodemailer = require("nodemailer");

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "croissantzd16@gmail.com",  // Thay bằng email của bạn
                pass: "xwrgqygatzjmbygh",       // Thay bằng App Password
            },
        });
    }

    // Hàm gửi email xác nhận đặt vé
    async sendMail(userEmail, schedule_id, seat_id) {
        try {
            // Tạo nội dung email
            const emailContent = `
                <h1>Xác Nhận Đặt Vé</h1>
                <p>Chào bạn,</p>
                <p>Chúng tôi vui mừng thông báo rằng vé của bạn đã được đặt thành công!</p>
                <p><strong>Lịch chiếu:</strong> ${schedule_id}</p>
                <p><strong>Số ghế:</strong> ${seat_id}</p>
                <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi. Chúng tôi hy vọng bạn sẽ có một trải nghiệm tuyệt vời!</p>
                <p>Trân trọng,</p>
                <p><strong>Đội ngũ dịch vụ</strong></p>
            `;

            // Gửi email
            const info = await this.transporter.sendMail({
                from: '"Đặt vé" <croissantzd16@gmail.com>',
                to: userEmail,
                subject: "Xác Nhận Đặt Vé",
                text: `Chào bạn, vé của bạn đã được đặt thành công với lịch chiếu ${schedule_id}, ghế ${seat_id}`,
                html: emailContent,  // Nội dung email dạng HTML
            });

            console.log("Email đã gửi: " + info.messageId);
        } catch (error) {
            console.error("Lỗi gửi email:", error);
        }
    }
}

module.exports = new MailService();
