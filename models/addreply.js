// import mongoose from "mongoose";
// import connect from "../connect/connect.js";  // MongoDB 연결
// import ReplyComment from "./replyCommentScehema.js";  // 대댓글 모델

// // 대댓글 데이터 삽입 함수
// const insertReplyComments = async () => {
//   const replyComments = [
//     {
//       content: "정말 도움이 많이 되었어요! 덕분에 더 이해가 잘 되었습니다.",
//       email: "user1@example.com",
//       nickname: "John Doe",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-07-03"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c892"),  // 부모 댓글의 ObjectId
//       likeCount: 5,
//     },
//     {
//       content: "이 영상 정말 유익했고, 설명이 매우 자세해서 좋았습니다.",
//       email: "user2@example.com",
//       nickname: "Jane Smith",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-06-15"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c893"),  // 부모 댓글의 ObjectId
//       likeCount: 10,
//     },
//     {
//       content: "CSS Flexbox를 이해하는데 큰 도움이 되었어요.",
//       email: "user3@example.com",
//       nickname: "Alice Johnson",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-05-22"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c894"),  // 부모 댓글의 ObjectId
//       likeCount: 8,
//     },
//     {
//       content: "이 영상 덕분에 Node.js에 대해 잘 이해하게 되었습니다.",
//       email: "user4@example.com",
//       nickname: "Bob Brown",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-08-10"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c895"),  // 부모 댓글의 ObjectId
//       likeCount: 6,
//     },
//     {
//       content: "MongoDB 쿼리 문법을 쉽게 설명해 주셔서 감사합니다!",
//       email: "user5@example.com",
//       nickname: "Charlie Black",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-07-30"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c896"),  // 부모 댓글의 ObjectId
//       likeCount: 7,
//     },
//     {
//       content: "리액트의 상태 관리 부분이 잘 설명되어 있어서 이해하기 쉬웠습니다.",
//       email: "user6@example.com",
//       nickname: "David Lee",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-06-19"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c897"),  // 부모 댓글의 ObjectId
//       likeCount: 5,
//     },
//     {
//       content: "자바스크립트 비동기 처리에 대한 설명이 명확해서 정말 유익했습니다.",
//       email: "user7@example.com",
//       nickname: "Eve White",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-05-13"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c898"),  // 부모 댓글의 ObjectId
//       likeCount: 4,
//     },
//     {
//       content: "이 영상은 너무 유익했고 재미있게 봤습니다!",
//       email: "user8@example.com",
//       nickname: "Frank Harris",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-05-01"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c899"),  // 부모 댓글의 ObjectId
//       likeCount: 9,
//     },
//     {
//       content: "오늘 MongoDB에 대해 더 잘 이해할 수 있었습니다, 감사합니다!",
//       email: "user9@example.com",
//       nickname: "Grace Kim",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-03-22"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c89a"),  // 부모 댓글의 ObjectId
//       likeCount: 3,
//     },
//     {
//       content: "강의를 통해 React와 Redux를 쉽게 배울 수 있었습니다!",
//       email: "user10@example.com",
//       nickname: "Olivia Scott",
//       userProfile: "http://localhost:8000/uploads/images/defaultProfile.jpg",
//       uploadDate: new Date("2024-02-11"),
//       parentCommentId: new mongoose.Types.ObjectId("677caec13e13d4daaa81c89b"),  // 부모 댓글의 ObjectId
//       likeCount: 2,
//     },
//   ];

//   try {
//     // 대댓글 삽입
//     await ReplyComment.insertMany(replyComments);
//     console.log("대댓글이 성공적으로 삽입되었습니다.");
//   } catch (err) {
//     console.error("대댓글 삽입 중 오류 발생:", err);
//   }
// };

// // MongoDB 연결 후 대댓글 삽입 실행
// connect();
// insertReplyComments();