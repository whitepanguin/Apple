import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.mjs";

const chatlogSchema = new Schema(
  {
    postId: { type: Number },
    createdAt: { type: String, default: getCurrentTime },
    text: [
      new Schema(
        {
          userid: { type: String },
          chat: { type: String },
          createdAt: { type: String, default: getCurrentTime },
        },
        { _id: true }
      ),
    ],
  },
  { timestamps: true }
);

export default model("Chat", chatlogSchema, "chats");
