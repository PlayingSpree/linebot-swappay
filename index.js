const https = require("https")
const express = require("express")
const { readAmount, setAmount } = require("./db")
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

app.post("/webhook", function (req, res) {
    res.send("HTTP POST request sent to the webhook URL!")
    console.log("Webhook GET:")
    console.log(JSON.stringify(req.body))
    // If the user sends a message to your bot, send a reply message
    if (req.body.events[0].type === "message" && req.body.events[0].message.type === "text") {
        // Read message
        const input = req.body.events[0].message.text
        const amount = eval(input.replace(/[^0-9\+\-\*\/\.]/g, ''));
        console.log("Source: " + JSON.stringify(req.body.events[0].source))
        console.log("Text: " + req.body.events[0].message.text)
        console.log("amount: " + amount)

        if (Number.isNaN(amount) || amount == undefined) {
            return
        } else {
            sendMessage(req, res, amount)
        }
    }
})

async function sendMessage(req, res, amount) {
    let money = await readAmount()
    money += amount
    setAmount(money)
    message = amount.toFixed(2) + "\n= " + money.toFixed(2)

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
        "headers": headers,
        "body": dataString
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