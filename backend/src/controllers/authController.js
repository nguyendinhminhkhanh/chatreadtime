const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Session = require("../models/Session");

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14 ngày
const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Tất cả các thông tin không được để trống!" });
    }

    //Kiểm tra username đã tồn tại chưa

    const duplicate = await User.findOne({ username });
    if (duplicate)
      return res.status(409).json({ message: "Username đã tồn tại!" });

    //mã  hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    //tạo người dùng mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi không thể goi SignUp", error);
    res.status(500).json({ message: "Lỗi hệ thống " });
  }
};

const signIn = async (req, res) => {
  // Chức năng đăng nhập sẽ được triển khai ở đây
  try {
    //lấy input từ req.body
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username và password không được để trống!" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Sai username hoặc password!" });
    }

    //kiêm tra pasword
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Sai username hoặc password!" });
    }

    //nếu khớp tạo accessToken và refreshToken
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    //Tạo refresh token
    const refeshToken = crypto.randomBytes(64).toString("hex");

    //tạo session mới để lưu refesh token
    await Session.create({
      userId: user._id,
      refreshToken: refeshToken,
      expiryAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    //trả refesh token về trong cookie
    res.cookie("refreshToken", refeshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict", //backend  ,fontend deploy riêng
      maxAge: REFRESH_TOKEN_TTL,
    });

    //trả access token vể trong res
    return res.status(200).json({
      message: `User ${user.displayName} đăng nhập thành công`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi không thể gọi SignIn", error);
    res.status(500).json({ message: "Lỗi hệ thống " });
  }
};

const signOut = async (req, res) => {
  try {
    //lấy refresh token từ cookie
    const token = req.cookies?.refeshToken;
    if (token) {
      //xoá refesh token trong Session
      await Session.deleteOne({ resfreshToken: token });
      //xoá cookie
      res.clearCookie("refreshToken");
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi không thể gọi SignOut", error);
    res.status(500).json({ message: "Lỗi hệ thống " });
  }
};
module.exports = { signUp, signIn, signOut };
