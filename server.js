import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

// 🔐 variáveis vêm do Render (NUNCA do GitHub)
const SECRET = process.env.PAYHIP_WEBHOOK_SECRET
const API_KEY = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID

app.post("/payhip-webhook", async (req, res) => {
	try {
		const body = req.body

		const userId = body?.custom_fields?.robloxId
		const secret = body?.secret

		// validação de segurança
		if (secret !== SECRET) return res.sendStatus(403)
		if (!userId) return res.sendStatus(400)

		// ✔ Open Cloud (Roblox DataStore)
		const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`

		await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": API_KEY
			},
			body: JSON.stringify({
				key: `whitelist_${userId}`,
				value: "eterno"
			})
		})

		console.log("Whitelist adicionada:", userId)

		res.sendStatus(200)

	} catch (err) {
		console.log("Erro:", err)
		res.sendStatus(500)
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log("Servidor rodando na porta", PORT)
})
