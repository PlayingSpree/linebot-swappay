import Enmap from "enmap";
const map = new Enmap({ name: "amount" });

/**
 * Reads the total balance in cents.
 * @returns {Promise<number>}
 */
export async function readAmount() {
    try {
        let amount = map.get("amount")
        if (!Number.isSafeInteger(amount)) {
            console.log(`Data is ${amount}. Default to 0`);
            amount = 0
            map.set("amount", 0)
        }
        console.log("Read amount from db (cents): " + amount);
        return amount
    }
    catch (err) {
        console.error("Error reading amount:", err)
        return 0
    }
}

/**
 * Atomically adds a delta (in cents) to the total balance.
 * @param {number} deltaInCents 
 * @returns {Promise<number>} The new balance in cents.
 */
export async function addAmount(deltaInCents) {
    try {
        // Enmap.inc returns the new value
        const newTotal = map.inc("amount", deltaInCents)
        console.log("Db amount incremented by: " + deltaInCents + ". New total (cents): " + newTotal);
        return newTotal
    }
    catch (err) {
        console.error("Error updating amount:", err)
        throw err
    }
}
