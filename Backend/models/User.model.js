import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Not required for Google-authenticated users
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    profilePicURL: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp&s=128",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;