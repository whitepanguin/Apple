import * as postRepository from "../repositories/postRepository.js";

// 모든 포스트를 / 해당 아이디에 대한 포스트를 가져오는 함수
export async function getPosts(req, res, next) {
  const userid = req.query.userid;
  const data = await (userid
    ? postRepository.getAllByUserid(userid)
    : postRepository.getAll());
  res.status(200).json(data);
}

// id를 받아 하나의 포스트를 가져오는 함수
export async function getPostId(req, res, next) {
  const id = req.params.id;
  const data = await postRepository.getById(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: `${id}의 포스트가 없습니다.` });
  }
}

// 포스트 생성하는 함수

// export async function createPost(req, res, next) {
//   const { text } = req.body;
//   console.log("req.useridx: ", req.useridx);
//   const posts = await postRepository.create(text, req.useridx);
//   res.status(201).json(posts);
// }

export async function createPost(req, res, next) {
  const { text, tittle, img, category, price } = req.body;
  const post = await postRepository.createPost({
    text,
    userid: req.userid,
    tittle,
    img,
    category,
    price,
  });
  res.status(201).json(post);
}

// 포스트 수정하는 함수
// export async function updatePost(req, res, next) {
//   const id = req.params.id;
//   const text = req.body.text;
//   const post = await postRepository.update(id, text);
//   if (post) {
//     res.status(201).json(post);
//   } else {
//     res.status(404).json({ message: `${id}의 포스트가 없습니다.` });
//   }
//   next();
// }

// 포스트 수정 (Mongo DB)
// export async function updatePost(req, res, next) {
//   const id = req.params.id;
//   const updateFields = req.body;

//   try {
//     const post = await postRepository.update(id, updateFields);

//     if (!post) {
//       return res.status(404).json({ message: `${id}의 포스트가 없습니다.` });
//     }

//     return res.status(200).json(post); // 수정 후 결과 반환
//   } catch (error) {
//     console.error("업데이트 중 에러:", error);
//     return res.status(500).json({ message: "서버 오류" });
//   }
// }

// 포스트 수정 userid 비교
export async function updatePost(req, res, next) {
  const id = req.params.id;
  const updateFields = req.body;

  try {
    const post = await postRepository.getById(id);
    if (!post) {
      return res.status(404).json({ message: `${id}의 포스트가 없습니다.` });
    }
    if (post.userid !== req.userid) {
      return res.sendStatus(403); // 본인 글이 아니면 수정 불가
    }
    const updated = await postRepository.update(id, updateFields);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("업데이트 중 에러:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
}

// 포스트 삭제하는 함수
export async function deletePost(req, res, next) {
  const id = req.params.id;
  // const data = await postRepository.remove(id);
  // res.status(201).json(data);
  const post = await postRepository.getById(id);
  if (!post) {
    return res.status(404).json({ message: `${id}의 포스트가 없습니다` });
  }

  if (post.userid.toString() !== req.userid.toString()) {
    return res.sendStatus(403);
  }
  await postRepository.remove(id);
  res.sendStatus(204);
}
