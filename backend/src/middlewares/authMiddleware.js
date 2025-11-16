const jwt = require("jsonwebtoken");
const User = require("../models/User");

//authorization - xác minh user là ai
const protectedRoute = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    //xác nhận token HỢP LỆ
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodeUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "Access token hết hạn hoặc không đúng " });
        }

        //tìm user
        const user = await User.findById(decodeUser.userId).select(
          "-hashedPassword"
        );

        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại " });
        }

        //trả user vào req.user
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("Lỗi xác thực người dùng", error);
    return res.status(500).json({ message: "Xác thực không thành công" });
  }
};

module.exports = {
  protectedRoute,
};
