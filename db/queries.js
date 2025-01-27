const pool = require('./pool');

async function verifyUser(username) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  const [user] = rows;
  return user;
}

async function verifyMail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  const [user] = rows;
  return user;
}

async function insertNewUser(dataNewUser) {
  const user = dataNewUser;
  const id_membership_status = Number(user.id_membership_status);
  if (user.username === '') {
    user.username = user.email;
  }
  await pool.query(
    'INSERT INTO users (firstname, lastname, email, username, user_password, id_membership_status) VALUES ($1, $2, $3, $4, $5, $6)',
    [
      user.firstname,
      user.lastname,
      user.email,
      user.username,
      user.user_password,
      id_membership_status,
    ]
  );
}

async function updateStatus(arg) {
  const id = Number(arg);
  await pool.query(
    `UPDATE users SET id_membership_status = 2 WHERE id = ${id}`
  );
}

async function updateToAdministrator(arg) {
  const id = Number(arg);
  await pool.query(
    `UPDATE users SET id_membership_status = 1 WHERE id = ${id}`
  );
}

// this function is called from passport.use()
async function getUserData(username) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  let [user] = rows;
  return user;
}
// this function is called from passport.deserializeUser()
async function getUserFromId(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  const [user] = rows;
  return user;
}

async function getAllMessages() {
  const { rows } = await pool.query(
    `SELECT messages.id, messages.textm, messages.id_author, messages.added, users.firstname, users.lastname,
     users.username FROM messages JOIN users ON (messages.id_author=users.id)
    `
  );
  return rows;
}

async function insertMessage(messageToAdd) {
  await pool.query(
    `INSERT INTO messages(textm, id_author, added) VALUES ('${messageToAdd.textm}','${messageToAdd.id_author}','${messageToAdd.added}')`
  );
}

async function deleteMessage(id) {
  await pool.query(`DELETE FROM messages WHERE id=${id}`);
}

module.exports = {
  verifyUser,
  verifyMail,
  insertNewUser,
  updateStatus,
  updateToAdministrator,
  getUserData,
  getUserFromId,
  getAllMessages,
  insertMessage,
  deleteMessage,
};
