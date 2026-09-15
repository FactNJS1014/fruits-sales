import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendBookingCreatedEmail(
  to: string,
  bookingNumber: string,
  total: number,
) {
  if (!process.env.SMTP_USER) {
    console.log(
      `[SMTP Disabled] Booking Email sent to ${to} for ${bookingNumber}`,
    );
    return;
  }
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #2563eb;">การสั่งจองผลไม้ของคุณสำเร็จแล้ว</h2>
      <p>ขอบคุณที่สั่งจองผลไม้สดจาก Fruit Garden Market</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>หมายเลขการสั่งจอง:</strong> ${bookingNumber}</p>
        <p style="margin: 5px 0;"><strong>ยอดรวมทั้งสิ้น:</strong> ฿${total.toLocaleString("th-TH")}</p>
        <p style="margin: 5px 0;"><strong>สถานะปัจจุบัน:</strong> รอดำเนินการ (PENDING)</p>
      </div>
      <p>เราจะแจ้งให้ทราบอีกครั้งเมื่อมีการอัปเดตสถานะการจัดส่ง</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Fruit Garden" <no-reply@fruitgarden.com>',
    to,
    subject: `ยืนยันการสั่งจองผลไม้ #${bookingNumber}`,
    html,
  });
}

export async function sendBookingStatusChangedEmail(
  to: string,
  bookingNumber: string,
  oldStatus: string,
  newStatus: string,
  note?: string,
) {
  if (!process.env.SMTP_USER) {
    console.log(
      `[SMTP Disabled] Status Changed to ${newStatus} for ${bookingNumber}`,
    );
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #2563eb;">อัปเดตสถานะรายการสั่งจองผลไม้</h2>
      <p>การสั่งจองหมายเลข <strong>#${bookingNumber}</strong> มีการเปลี่ยนแปลงสถานะ</p>
      <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>สถานะเดิม:</strong> ${oldStatus}</p>
        <p style="margin: 5px 0; font-size: 1.1em; color: #1e40af;"><strong>สถานะใหม่:</strong> ${newStatus}</p>
        ${note ? `<p style="margin: 5px 0; font-style: italic; color: #4b5563;">หมายเหตุจากสวน: ${note}</p>` : ""}
      </div>
      <p>คุณสามารถตรวจสอบรายละเอียดได้ที่เมนู "การสั่งจองของฉัน"</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Fruit Garden" <no-reply@fruitgarden.com>',
    to,
    subject: `อัปเดตสถานะการสั่งจอง #${bookingNumber} -> ${newStatus}`,
    html,
  });
}
