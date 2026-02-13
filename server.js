const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // บอกให้ Server รู้ว่าไฟล์หน้าเว็บอยู่ที่โฟลเดอร์ public

// ข้อมูลจำลอง (ในระบบจริงต้องเชื่อมต่อ Database เพื่อไม่ให้ข้อมูลหาย)
let userWallet = {
    balance: 500.00
};

// 1. API สำหรับดึงยอดเงินปัจจุบันไปแสดงที่หน้าเว็บ
app.get('/api/balance', (req, res) => {
    res.json({ balance: userWallet.balance });
});

// 2. API สำหรับสร้างรายการเติมเงิน (จำลองการสร้าง QR Code)
app.post('/api/topup', (req, res) => {
    const { amount } = req.body;
    const refNo = 'MB' + Math.floor(Math.random() * 1000000); // เลขอ้างอิง MillionBear
    
    // สร้างลิงก์ QR Code จำลอง (PromptPay)
    const mockQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PROMPTPAY_ANY_${amount}_${refNo}`;
    
    res.json({
        qrCode: mockQR,
        refNo: refNo,
        amount: amount
    });
});

// 3. API จำลองสถานะจ่ายเงินสำเร็จ (เพื่อทดสอบหน้าเว็บ)
app.post('/api/simulate-payment', (req, res) => {
    const { amount } = req.body;
    userWallet.balance += parseFloat(amount);
    res.json({ success: true, newBalance: userWallet.balance });
});

// ตั้งค่า Port สำหรับ Render.com
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MillionBear Server is running on port ${PORT}`);
});