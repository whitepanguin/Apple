import * as chatRepository from "../repositories/chatRepository.mjs";

// 채팅 목록 조회
export async function getChats(req, res, next) {
  const userid = req.query.userid;
  const data = await (userid
    ? chatRepository.getAllByUserid(userid) // 사용자가 있을 경우
    : chatRepository.getAll()); // 모두 조회
  res.status(200).json(data);
}

// 채팅 ID로 특정 채팅 조회
export async function getChatId(req, res, next) {
  const id = req.params.id;
  const data = await chatRepository.findChatid(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: `${id}의 포스트가 없습니다.` });
  }
}

// 채팅 생성
// {
//     "chat": "이 상품 구매하고 싶어요!",
//     "postId": 101
// }
export async function createChat(req, res, next) {
  const { chat, postId } = req.body;

  // 새로운 채팅 메시지 객체 생성
  const newChat = await chatRepository.createChat({
    userid: req.userid,
    postId,
    text: [
      {
        // text는 배열이므로 하나의 채팅을 배열에 추가
        userid: req.userid,
        chat,
      },
    ],
  });

  res.status(201).json(newChat);
}

// 채팅 수정
// {
//     "chat": "채팅 내용을 수정했습니다!"
// }
export async function updateChat(req, res, next) {
  try {
    const { id } = req.params; // Chat 문서의 _id
    const { chat } = req.body; // 수정할 채팅 내용

    // 채팅 메시지 수정
    const updatedChat = await chatRepository.updateChat(id, chat);

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(updatedChat);
  } catch (err) {
    next(err);
  }
}

// 채팅 삭제
export async function deleteChat(req, res, next) {
  try {
    const { chatLogId, chatId } = req.params; // Chat 문서의 _id와 삭제할 채팅 메시지 _id

    // 특정 채팅 메시지 삭제
    const deleted = await chatRepository.deleteChat(chatLogId, chatId);

    if (!deleted) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    next(error);
  }
}
