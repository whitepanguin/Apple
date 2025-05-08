import mysql from "mysql2";
// mysql2 nodejs사이의 번역기 같은 역활을 하는 것이다. 중간다리 역활하는 모듈이다.
import { config } from "../config.mjs";

// 미리 연결해두는 것이 pool이다. 사용자가 접속할 것을
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export const db = pool.promise();
