/*
let users = [
  {
    id: "1",
    userid: "apple",
    password: "1111",
    name: "김사과",
    email: "apple@apple.com",
    url: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: "2",
    userid: "banana",
    password: "2222",
    name: "반하나",
    email: "banana@banana.com",
    url: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    userid: "orange",
    password: "3333",
    name: "오렌지",
    email: "orange@orange.com",
    url: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "4",
    userid: "berry",
    password: "4444",
    name: "배애리",
    email: "orange@orange.com",
    url: "https://randomuser.me/api/portraits/women/52.jpg",
  },
  {
    id: "5",
    userid: "melon",
    password: "5555",
    name: "이메론",
    email: "orange@orange.com",
    url: "https://randomuser.me/api/portraits/men/29.jpg",
  },
];
*/
/*
export async function createUser(userid,password,name,email){
  const user = {
    id:Date.now().toString(),
      userid,
      password,
      name,
      email,
    };
    users = [user,...users]
    return users;
}

export async function login(userid, password){
  const user = users.find((user)=> user.userid == userid && user.password == password)
  return user;
}
*/
/*
// 회원가입 put create
export async function createUser(userid, password, name, email) {
  const finduser = users.find((user) => user.userid === userid);
  if (!finduser) {
    const user = {
      id: Date.now().toString(),
      userid,
      password,
      name,
      email,
    };
    users = [user, ...users];
    return user;
  } else {
    return { message: "이미 있는 계정입니다" };
  }
}
*/
import { db } from "../db/database.mjs";
/*
// sql 내 코드
export async function createUser(userid, password, name, email, url) {
  const [rows] = await db.query("SELECT * FROM users WHERE userid = ?", [
    userid,
  ]);
  if (rows.length > 0) {
    return rows[0];
  } else {
    await db.query(
      "INSERT INTO users (userid, password, name, email) VALUES (?, ?, ?, ?)",
      [userid, password, name, email]
    );
    const [rows] = await db.query(
      "SELECT * FROM users WHERE userid = ? ORDER BY userid DESC",
      [userid]
    );
    return rows[0];
  }
}
*/
export async function createUser(user) {
  const { userid, password, name, email, url } = user;
  return db
    .execute(
      "INSERT INTO users (userid, password, name, email, url) VALUES (?, ?, ?, ?, ?)",
      [userid, password, name, email, url]
    )
    .then((result) => result[0].insertId);
}
/*
// 로그인 get
export async function login(userid, password) {
  const founduser = users.find((user) => user.userid === userid);
  if (founduser) {
    if (founduser.password == password) {
      return founduser;
    } else {
      return { message: "Password Incorrect" };
    }
  } else {
    return { message: "UserId Incorrect" };
  }
}
*/
// sql 내 코드
export async function login(userid, password) {
  const [rows] = await db.query("SELECT * FROM users WHERE userid = ?", [
    userid,
  ]);
  if (rows.length > 0) {
    if (rows.password == password) {
      return rows[0];
    }
  }
}
/*
export async function findByUserid(userid) {
  return users.find((user) => user.userid === userid);
}

// sql 내 코드
export async function findByUserid(userid) {
  const [rows] = await db.query("SELECT * FROM users WHERE userid = ?", [
    userid,
  ]);
  return rows[0];
}
*/

export async function findByUserid(userid) {
  return db
    .execute("SELECT * FROM users WHERE userid = ?", [userid])
    .then((result) => result[0][0]);
}

/*
export async function findByid(id) {
  return users.find((user) => user.id === id);
}

// sql 내 코드
export async function findByid(id) {
  const [rows] = await db.query("SELECT * FROM users WHERE idx = ?", [id]);
  return rows[0];
}
*/
export async function findByid(idx) {
  return db
    .execute("SELECT * FROM users WHERE idx = ?", [idx])
    .then((result) => result[0][0]);
}
