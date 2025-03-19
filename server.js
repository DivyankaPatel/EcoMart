require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    resetToken: String,
});
const User = mongoose.model("User", UserSchema);

// ✅ Product Schema (With Admin Approval)
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    approved: { type: Boolean, default: false },
});
const Product = mongoose.model("Product", ProductSchema);

// ✅ Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Signup API
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.json({ message: "✅ Signup Successful!" });
    } catch (error) {
        res.status(500).json({ error: "Signup Failed" });
    }
});

// ✅ Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect Password!" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "✅ Login Successful!", token, user });
    } catch (error) {
        res.status(500).json({ error: "Login Failed" });
    }
});

// ✅ Forgot Password - Generate Reset Token
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found!" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        await user.save();

        const resetLink = `http://127.0.0.1:5000/reset-password/${resetToken}`;
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset - EcoMart",
            html: `<p>Click below to reset your password:</p>
                   <a href="${resetLink}">Reset Password</a>`,
        });

        res.json({ message: "✅ Reset link sent to your email." });
    } catch (error) {
        res.status(500).json({ error: "Failed to send reset email" });
    }
});

// ✅ Reset Password - Update Password
app.post("/reset-password/:token", async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findOne({ resetToken: req.params.token });
        if (!user) return res.status(400).json({ error: "Invalid or expired token!" });

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        await user.save();

        res.json({ message: "✅ Password Reset Successful! You can now login." });
    } catch (error) {
        res.status(500).json({ error: "Reset Failed" });
    }
});

// ✅ Fetch Only Approved Products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find({ approved: true });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// ✅ User Uploads a Product (Requires Admin Approval)
app.post("/products", async (req, res) => {
    const { name, price, image, description } = req.body;
    if (!name || !price || !image || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Restrict inappropriate image formats
    if (!image.match(/\.(jpeg|jpg|png)$/)) {
        return res.status(400).json({ error: "Invalid image format. Only JPEG, JPG, or PNG allowed." });
    }

    const newProduct = new Product({ name, price, image, description, approved: false });
    await newProduct.save();
    res.json({ message: "✅ Product submitted for approval. Waiting for admin approval." });
});

// ✅ Admin Approves a Product
app.put("/products/approve/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.approved = true;
        await product.save();
        res.json({ message: "✅ Product approved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to approve product" });
    }
});

// add QRcode
app.post("/generate-payment-qr", async (req, res) => {
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
    }

    // Replace this with your UPI ID or payment link
    const upiID = "your-upi-id@bank"; // Example: "user@upi"

    const paymentData = `upi://pay?pa=${upiID}&pn=EcoMart&mc=1234&tid=TXN123456&tr=TXN123456&tn=Payment&am=${amount}&cu=INR`;

    try {
        const qrImage = await QRCode.toDataURL(paymentData);
        res.json({ qrCode: qrImage });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate QR code" });
    }
});


// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
});

// ✅ Basic Express Server Setup (Merged)
const app2 = express();
app2.use(express.json());
app2.use(cors());

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

app2.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});

const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

