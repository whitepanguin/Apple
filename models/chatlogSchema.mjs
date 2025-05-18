import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.mjs";

const chatlogSchema = new Schema(
  {
    postId: { type: String },
    owner: { type: String },
    createdAt: { type: String, default: getCurrentTime },
    text: [
      {
        userid: { type: String },
        chat: { type: String },
        createdAt: { type: String, default: getCurrentTime },
        edited: { type: Boolean, default: false },
      },
      { _id: true },
    ],
  },
  { timestamps: true }
);

export default model("Chat", chatlogSchema, "chats");
