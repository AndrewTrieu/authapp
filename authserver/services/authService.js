import { sql } from "../database/database.js";

const findUser = async (username) => {
  return await sql`SELECT * FROM users WHERE username = ${username}`;
};

const createUser = async (username, password) => {
  return await sql`INSERT INTO users (username, password) VALUES (${username}, ${password})`;
};

export { findUser, createUser };
