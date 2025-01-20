const pool = require('./pool');

async function getNameCategory(id) {
  const { rows } = await pool.query(`SELECT * FROM categories WHERE id=${id}`);
  const [row] = rows;
  const { category } = row;
  return category;
}

module.exports = {
    getNameCategory,
   
  };