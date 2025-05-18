import Chat from "../models/chatlogSchema.mjs";

export async function getAllChats() {
  return await Chat.find();
}

export async function getChatById(chatLogId) {
  return await Chat.findById(chatLogId);
}

export async function getChatsByPostid(postid) {
  return await Chat.find({ postId: postid });
}

export async function createChatRoomByPostId(postId, owner) {
  const chat = new Chat({ postId, owner });
  return await chat.save();
}

export async function appendChatMessage(chatLogId, chatData) {
  return await Chat.findByIdAndUpdate(
    chatLogId,
    { $push: { text: chatData } },
    { new: true }
  );
}

export async function updateChatMessage(chatLogId, chatId, newChatContent) {
  return await Chat.findOneAndUpdate(
    { _id: chatLogId, "text._id": chatId },
    { $set: { "text.$.chat": newChatContent } },
    { new: true }
  );
}

export async function deleteChatMessage(chatId) {
  // 채팅 메시지를 포함한 채팅룸을 먼저 찾고 삭제
  return await Chat.findOneAndUpdate(
    { "text._id": chatId },
    { $pull: { text: { _id: chatId } } },
    { new: true }
  );
}
