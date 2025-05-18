import * as chatRepository from "../repositories/chatRepository.mjs";
import * as postRepository from "../repositories/postRepository.mjs";

// 모든 채팅룸 조회
export async function getChats(req, res) {
  try {
    const chats = await chatRepository.getAllChats();
    res.status(200).json(chats);
  } catch (err) {
    res
      .status(500)
      .json({ message: "채팅 목록 조회 실패", error: err.message });
  }
}

// 특정 채팅룸 조회
export async function getChatId(req, res) {
  const { chatLogId } = req.params;
  try {
    const chat = await chatRepository.getChatById(chatLogId);
    if (!chat)
      return res.status(404).json({ message: "채팅룸을 찾을 수 없습니다." });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "채팅룸 조회 실패", error: err.message });
  }
}
// postid 채팅룸 찾기
export async function getChatByPostid(req, res) {
  const { postid } = req.params;

  try {
    let chat = await chatRepository.getChatsByPostid(postid);

    if (!chat || chat.length === 0) {
      // 글 정보 가져오기
      const post = await postRepository.getById(postid);
      if (!post) {
        return res.status(404).json({ message: "해당 글을 찾을 수 없습니다." });
      }

      const owner = post.userid; // 글 작성자의 userid

      // 채팅방 생성
      chat = await chatRepository.createChatRoomByPostId(postid, owner);
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "채팅룸 처리 실패", error: err.message });
  }
}

// 채팅룸 생성
export async function createChat(req, res) {
  const { postid } = req.params;
  const owner = req.body.userid; // isAuth 미들웨어가 설정한 사용자 ID

  if (!postid || !owner) {
    return res
      .status(400)
      .json({ message: "postid 또는 owner 정보가 누락되었습니다." });
  }

  try {
    const newChat = await chatRepository.createChatRoomByPostId(postid, owner);
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ message: "채팅룸 생성 실패", error: err.message });
  }
}

// 채팅 메시지 추가
export async function Chat(req, res) {
  const { chatLogId, userid } = req.params;
  const { chat } = req.body;

  if (!chat) {
    return res.status(400).json({ message: "chat 내용이 누락되었습니다." });
  }

  const chatData = {
    userid,
    chat,
  };

  try {
    const updatedChatLog = await chatRepository.appendChatMessage(
      chatLogId,
      chatData
    );
    if (!updatedChatLog) {
      return res.status(404).json({ message: "채팅 로그를 찾을 수 없습니다." });
    }
    res.status(200).json(updatedChatLog);
  } catch (err) {
    res.status(500).json({ message: "채팅 추가 실패", error: err.message });
  }
}

// 채팅 메시지 수정
export async function updateChat(req, res) {
  const { chatLogId, chatId } = req.params;
  const { chat: newChatContent } = req.body;

  try {
    const chatLog = await chatRepository.getChatById(chatLogId);
    if (!chatLog) {
      return res.status(404).json({ message: "채팅 로그를 찾을 수 없습니다." });
    }

    const chatMsg = chatLog.text.find((msg) => msg._id.toString() === chatId);
    if (!chatMsg) {
      return res
        .status(404)
        .json({ message: "채팅 메시지를 찾을 수 없습니다." });
    }

    chatMsg.chat = newChatContent;
    chatMsg.edited = true;
    await chatLog.save();

    res.status(200).json({
      chat: chatMsg.chat,
      edited: chatMsg.edited,
    });
  } catch (err) {
    res.status(500).json({ message: "채팅 수정 실패", error: err.message });
  }
}

// 채팅 메시지 삭제
export async function deleteChat(req, res) {
  const { chatId } = req.params;
  try {
    const updated = await chatRepository.deleteChatMessage(chatId);
    if (!updated)
      return res
        .status(404)
        .json({ message: "채팅 메시지를 찾을 수 없습니다." });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "채팅 삭제 실패", error: err.message });
  }
}
