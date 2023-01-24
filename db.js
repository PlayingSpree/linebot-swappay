const Enmap = require("enmap");
const map = new Enmap({ name: "amount" });

async function readAmount() {
    try {
        let amount = map.get("amount")
        if (Number.isNaN(amount) || amount == undefined) {
            console.log(`Data is ${amount}. Default to 0`);
            amount = 0
        }
        console.log("Read amount from db: " + amount);
        return amount
    }
    catch (err) {
        console.log(err)
    }
}

async function setAmount(amount) {
    try {
        map.set("amount", amount)
        console.log("Db amount update: " + amount);
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    readAmount,
    setAmount
}