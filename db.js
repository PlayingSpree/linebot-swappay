const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

async function readAmount() {
    try {
        let res = await client.query('SELECT amount FROM amount WHERE id = 1')
        console.log("Read amount from db: " + res.rows[0].amount);
        res.rows[0].amount
    }
    catch (err) {
        console.log(err)
    }
}

async function setAmount(amount) {
    try {
        let res = await client.query(`UPDATE amount SET amount = ${amount} WHERE id = 1`)
        console.log(JSON.stringify(res));
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    readAmount,
    setAmount
}