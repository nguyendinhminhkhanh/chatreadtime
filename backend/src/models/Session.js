const e = require("express");
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      inbdex: true,
    },
    refreshToken: { type: String, required: true, unique: true },
    expiryAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

//tự động xoá session khi hết hạn   
sessionSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", sessionSchema);
