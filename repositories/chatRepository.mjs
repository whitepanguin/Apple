import Chat from "../models/chatlogSchema.mjs";

export async function findChatByPostId(postId) {
  return Chat.findOne({ postId });
}

export async function createChat(data) {
  const chat = new Chat(data);
  return chat.save();
}

export async function findChatid(id) {
  return Chat.findById(id);
}

export async function updateChat(chatLogId, chatId, newChatContent) {
  return await Chat.findOneAndUpdate(
    { _id: chatLogId, "text._id": chatId },
    { $set: { "text.$.chat": newChatContent } },
    { new: true }
  );
}

export async function getAllByUserid(userid) {
  return Chat.find({ userid });
}

// 전체 장소 조회
export async function getAll() {
  return Chat.find();
}

export async function deleteChat(chatLogId, chatId) {
  return await Chat.findByIdAndUpdate(
    chatLogId,
    { $pull: { text: { _id: chatId } } },
    { new: true }
  );
}

export async function appendChat(chatLogId, chatData) {
  return await Chat.findByIdAndUpdate(
    chatLogId,
    { $push: { text: chatData } },
    { new: true }
  );
}
