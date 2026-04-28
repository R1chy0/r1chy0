const express = require("express")
const bodyParser = require("body-parser")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const app = express()
app.use(bodyParser.json())

app.post("/payhip", async (req, res) => {
    try {

        console.log("WEBHOOK RECEBIDO:", JSON.stringify(req.body, null, 2))

        const userId =
            req.body?.checkout_questions?.find(q => q.question.includes("Roblox"))?.response

        if (!userId) {
            console.log("❌ userId não encontrado")
            return res.sendStatus(400)
        }

        // 🔥 TROCA AQUI PELO LINK REAL DO SEU ROBLOX SERVER
        const response = await fetch("https://SEU-LINK-REAL-AQUI/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Number(userId),
                secret: "12345"
            })
        })

        console.log("✔ Enviado pro Roblox:", userId)
        console.log("Status Roblox:", response.status)

        res.sendStatus(200)

    } catch (err) {
        console.log("❌ ERRO:", err)
        res.sendStatus(500)
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server online")
})
