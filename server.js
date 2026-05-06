import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

// 🔐 opcional: segurança simples
const SECRET = "r1chy0-secret"

// ✔ Payhip webhook
app.post("/payhip-webhook", async (req, res) => {
	try {
		const data = req.body

		// ajuste conforme Payhip enviar
		const userId = data?.custom_fields?.robloxId
		const secret = data?.secret

		if (secret !== SECRET) {
			return res.sendStatus(403)
		}

		if (!userId) return res.sendStatus(400)

		// ✔ envia pro Roblox (seu jogo)
		await fetch("https://YOUR_ROBLOX_ENDPOINT", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				userId: userId
			})
		})

		res.sendStatus(200)

	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

app.listen(3000, () => {
	console.log("Webhook rodando")
})
