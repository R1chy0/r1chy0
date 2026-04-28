const express = require("express")
const bodyParser = require("body-parser")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const app = express()
app.use(bodyParser.json())

// ======================
// 📦 PAYHIP WEBHOOK
// ======================
app.post("/payhip", async (req, res) => {
    try {

        console.log("WEBHOOK PAYHIP:", JSON.stringify(req.body, null, 2))

        const userId =
            req.body?.checkout_questions?.find(q => q.question.includes("Roblox"))?.response

        if (!userId) {
            console.log("❌ userId não encontrado")
            return res.sendStatus(400)
        }

        // envia para rota interna /webhook
        await fetch("https://payhip-whitelist.onrender.com/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Number(userId),
                secret: "12345"
            })
        })

        console.log("✔ Encaminhado para webhook:", userId)

        res.sendStatus(200)

    } catch (err) {
        console.log("❌ ERRO PAYHIP:", err)
        res.sendStatus(500)
    }
})

// ======================
// 🔥 WEBHOOK INTERNO (ROBLOX)
// ======================
app.post("/webhook", async (req, res) => {
    try {

        console.log("WEBHOOK INTERNO:", req.body)

        const { userId, secret } = req.body

        if (secret !== "12345") {
            console.log("❌ Secret inválido")
            return res.sendStatus(403)
        }

        // 🔥 AQUI ENTRA SUA LÓGICA DE WHITELIST (DataStore / Roblox script)
        console.log("✔ WHITELIST LIBERADA:", userId)

        res.sendStatus(200)

    } catch (err) {
        console.log("❌ ERRO WEBHOOK:", err)
        res.sendStatus(500)
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server online")
})
