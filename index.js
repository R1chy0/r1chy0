const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())

const API_KEY = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.UNIVERSE_ID

app.post("/payhip", async (req, res) => {
    try {

        console.log("WEBHOOK RECEBIDO:", JSON.stringify(req.body, null, 2))

        const userId =
            req.body?.checkout_questions?.find(q => q.question.includes("Roblox"))?.response

        if (!userId) {
            console.log("❌ robloxUserId não encontrado")
            return res.sendStatus(400)
        }

        const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/WhitelistPlayers/entries/entry`

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "x-api-key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                key: userId.toString(),
                value: true
            })
        })

        console.log("✔ Whitelist liberada:", userId)
        console.log("Roblox status:", response.status)

        res.sendStatus(200)

    } catch (err) {
        console.log("❌ ERRO:", err)
        res.sendStatus(500)
    }
})

app.listen(3000, () => console.log("Server online"))
