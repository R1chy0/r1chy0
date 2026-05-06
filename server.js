import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

const SECRET = process.env.PAYHIP_WEBHOOK_SECRET
const API_KEY = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID

// ✔ DEBUG TOTAL (ver tudo que chega)
app.post("/payhip-webhook", async (req, res) => {
	try {
		console.log("🔥 WEBHOOK RECEBIDO:")
		console.log(JSON.stringify(req.body, null, 2))

		const body = req.body

		const userId =
			body?.custom_fields?.robloxId ||
			body?.robloxId ||
			body?.data?.robloxId

		const secret = body?.secret

		if (secret !== SECRET) {
			console.log("❌ SECRET INVÁLIDO")
			return res.sendStatus(403)
		}

		if (!userId) {
			console.log("❌ SEM ROBLOX ID NO PAYLOAD")
			return res.sendStatus(400)
		}

		const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`

		const result = await fetch(url, {
			method: "POST",
			headers: {
				"x-api-key": API_KEY,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				key: `whitelist_${userId}`,
				value: "eterno"
			})
		})

		if (!result.ok) {
			console.log("❌ ERRO OPEN CLOUD:", await result.text())
			return res.sendStatus(500)
		}

		console.log("✔ WHITELIST ADICIONADA:", userId)

		res.sendStatus(200)

	} catch (err) {
		console.log("❌ ERRO GERAL:", err)
		res.sendStatus(500)
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log("🚀 Rodando na porta", PORT)
})
