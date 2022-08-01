const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

client.connect();
readAmount();

async function readAmount() {
    try {
        let res = await client.query('SELECT amount FROM amount WHERE id = 1')
        console.log(JSON.stringify(res));
        res.rows[0].amount
    }
    catch (err) {
        console.log(err)
    }
}

async function setAmount(amount) {
    try {
        let res = await client.query(`UPDATE amount SET amount = ${amount} WHERE id = 1`)
        console.log(res);
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    readAmount,
    setAmount
}