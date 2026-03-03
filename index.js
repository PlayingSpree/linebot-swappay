import https from "https"
import express from "express"
import { readAmount, addAmount } from "./db.js"

const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.sendStatus(200)
})

/**
 * A safe evaluator for simple arithmetic expressions.
 * Only allows digits, basic operators (+, -, *, /), parentheses, and decimals.
 */
export function safeCalculate(expression) {
    const sanitized = expression.replace(/[^0-9+\-*/.()]/g, '');
    if (!sanitized) return NaN;
    try {
        // Use Function() instead of eval() but only with a strictly sanitized input.
        const result = new Function(`"use strict"; return (${sanitized})`)();
        if (typeof result !== 'number' || !Number.isFinite(result)) return NaN;
        return result;
    } catch (e) {
        return NaN;
    }
}

/**
 * Processes multiple lines of text and returns the total calculated amount.
 * Returns NaN if no valid amounts are found.
 */
export function calculateTotal(text) {
    const lines = text.split(/\r?\n/);
    let totalAmount = 0;
    let validLineFound = false;

    for (const line of lines) {
        const amount = safeCalculate(line);
        if (!Number.isNaN(amount)) {
            totalAmount += amount;
            validLineFound = true;
        }
    }
    return validLineFound ? totalAmount : NaN;
}

app.post("/webhook", async function (req, res) {
    res.send("HTTP POST request sent to the webhook URL!")
    if (req.body.events && req.body.events.length > 0 && req.body.events[0].type === "message" && req.body.events[0].message.type === "text") {
        const input = req.body.events[0].message.text
        const totalAmount = calculateTotal(input);

        if (Number.isNaN(totalAmount)) {
            console.log("No valid amounts parsed from text: " + input);
            return
        }

        console.log("Source: " + JSON.stringify(req.body.events[0].source))
        console.log("Text: " + input)
        console.log("Total Amount (decimal): " + totalAmount)

        await processAndSendMessage(req, res, totalAmount)
    }
})

async function processAndSendMessage(req, res, amount) {
    // Convert to cents to maintain precision
    const deltaInCents = Math.round(amount * 100);
    
    // Add to database atomically
    const newTotalInCents = await addAmount(deltaInCents);
    
    const message = amount.toFixed(2) + "\n= " + (newTotalInCents / 100).toFixed(2)

    // Message data, must be stringified
    const dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
            {
                "type": "text",
                "text": message
            }
        ]
    })

    // Request header
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + TOKEN
    }

    // Options to pass into the request
    const webhookOptions = {
        "hostname": "api.line.me",
        "path": "/v2/bot/message/reply",
        "method": "POST",
        "headers": headers
    }

    // Define request
    const request = https.request(webhookOptions, (res) => {
        res.on("data", (d) => {
            process.stdout.write(d)
        })
    })

    // Handle error
    request.on("error", (err) => {
        console.error(err)
    })

    // Send data
    request.write(dataString)
    request.end()
}

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
