const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check Email
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save new user
    const userId = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "Registrasi berhasil!", userId });
  } catch (error) {
    console.error("ERROR SAAT REGISTRASI:", error);

    res
      .status(500)
      .json({
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User Based on email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // JSON Web Token (JWT)
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: 'Login berhasil!', token: token, role: user.role });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userEmail = req.userData.email;

    const user = await User.findByEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }
    
    res.status(200).json({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
  }
};
