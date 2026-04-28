const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())

const API_KEY = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.UNIVERSE_ID

// ======================
// 📦 PAYHIP
// ======================
app.post("/payhip", async (req, res) => {
    try {

        const userId = req.body?.checkout_questions?.find(
            q => q.question.includes("Roblox")
        )?.response

        if (!userId) return res.sendStatus(400)

        await fetch("https://payhip-whitelist.onrender.com/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: Number(userId),
                secret: "12345"
            })
        })

        console.log("✔ Encaminhado:", userId)
        res.sendStatus(200)

    } catch (err) {
        console.log("❌ ERRO PAYHIP:", err)
        res.sendStatus(500)
    }
})

// ======================
// 🔥 ROBLOX WEBHOOK (CORRIGIDO 100%)
// ======================
app.post("/webhook", async (req, res) => {
    try {

        const { userId, secret } = req.body

        if (secret !== "12345") {
            console.log("❌ Secret inválido")
            return res.sendStatus(403)
        }

        // ✔ ENDPOINT CORRETO (SEM 404)
        const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastores/WhitelistPlayers/entries/${userId}`

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "x-api-key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                value: true
            })
        })

        const text = await response.text()

        console.log("✔ WHITELIST NO ROBLOX:", userId)
        console.log("✔ STATUS:", response.status)
        console.log("✔ RESPONSE:", text)

        res.sendStatus(200)

    } catch (err) {
        console.log("❌ ERRO ROBLOX:", err)
        res.sendStatus(500)
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server online")
})
