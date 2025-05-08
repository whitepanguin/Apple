/*
let posts = [
  {
    id: "1",
    name: "김사과",
    userid: "apple",
    text: "Node.js 배우는 중인데 Express 진짜 편하다! :로켓:",
    createdAt: Date.now().toString(),
    url: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: "2",
    name: "반하나",
    userid: "banana",
    text: "오늘의 커피 :커피:️ + 코딩 = 최고의 조합!",
    createdAt: Date.now().toString(),
    url: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    name: "오렌지",
    userid: "orange",
    text: "Elasticsearch 연동 완료! 실시간 검색 API 짜릿해 :돋보기:",
    createdAt: Date.now().toString(),
    url: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "4",
    name: "배애리",
    userid: "berry",
    text: "JavaScript 비동기 너무 어렵다... Promises, async/await, 뭐가 뭔지 :울음:",
    createdAt: Date.now().toString(),
    url: "https://randomuser.me/api/portraits/women/52.jpg",
  },
  {
    id: "5",
    name: "이메론",
    userid: "melon",
    text: "새 프로젝트 시작! Express + MongoDB + EJS 조합 좋아요 :전구:",
    createdAt: Date.now().toString(),
    url: "https://randomuser.me/api/portraits/men/29.jpg",
  },
];
*/
const SELECT_JOIN =
  "select u.userid, u.name, u.url, p.idx, p.useridx, p.text, p.createAt from users as u join posts as p on u.idx = p.useridx";
const ORDER_DESC = "order by p.createAt desc";
/*
// 모든 포스트를 비동기 리턴
export async function getAll() {
  return posts;
}
*/
export async function getAll() {
  return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`).then((result) => result[0]);
}
/*
// 사용자 아이디(userid)에 대한 포스트를 리턴
// 조건을 만족하는 모든 요소를 배열로 리턴
export async function getAllByUserid(userid) {
  return posts.filter((post) => post.userid === userid);
}
  */
export async function getAllByUserid(userid) {
  return db
    .execute(`${SELECT_JOIN} where u.userid=? ${ORDER_DESC}`, [userid])
    .then((result) => result[0]);
}

/*
// filter 같은게 복수일수도 있음으로 배열로 리턴, find 조건에 맞는 1개 아님 없다
// 글 번호(id)에 대한 포스트를 리턴
// 조건을 만족하는 첫 번째 요소 하나를 리턴
export async function getById(id) {
  return posts.find((post) => post.id === id);
}
*/
export async function getById(idx) {
  return db
    .execute(`${SELECT_JOIN} where p.idx=?`, [idx])
    .then((result) => result[0][0]);
}
/*
//포스트 작성
// 키값이 같으면 생략이 가능
export async function create(userid, name, text) {
  const post = {
    id: Date.now().toString(),
    userid,
    name,
    text,
    createdAt: Date.now().toString(),
  };
  posts = [post, ...posts];
  return posts;
}
*/
import { db } from "../db/database.mjs";

export async function create(text, useridx) {
  return db
    .execute("insert into posts (useridx, text) values (?, ?)", [useridx, text])
    .then((result) => result[0].insertId);
}
/*
// 포스트 변경
export async function update(id, text) {
  const post = posts.find((post) => post.id === id);
  if (post) {
    post.text = text;
  }
  return post;
}
  */
export async function update(idx, text) {
  return db
    .execute("update posts set text=? where idx=?", [text, idx])
    .then(() => getById(idx));
}

/*
// 포스트 삭제
export async function remove(id) {
  posts = posts.filter((post) => post.id !== id);
  return posts;
}
*/
export async function remove(idx) {
  return db.execute("delete from posts where idx=?", [idx]);
}
