import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

const API_KEY = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID

app.post("/payhip-webhook", async (req, res) => {
	try {
		console.log("🔥 WEBHOOK RECEBIDO:")
		console.log(JSON.stringify(req.body, null, 2))

		const body = req.body

		// ✔ pega o Roblox UserID do checkout_questions
		const robloxId = body?.checkout_questions?.find(
			q => q.question && q.question.toLowerCase().includes("roblox")
		)?.response

		if (!robloxId) {
			console.log("❌ ROBLOX ID NÃO ENCONTRADO")
			return res.sendStatus(400)
		}

		console.log("✔ USER ID ENCONTRADO:", robloxId)

		// ✔ Open Cloud DataStore
		const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`

		const result = await fetch(url, {
			method: "POST",
			headers: {
				"x-api-key": API_KEY,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				key: `whitelist_${robloxId}`,
				value: "eterno"
			})
		})

		if (!result.ok) {
			const text = await result.text()
			console.log("❌ ERRO OPEN CLOUD:", text)
			return res.sendStatus(500)
		}

		console.log("✔ WHITELIST ADICIONADA:", robloxId)

		res.sendStatus(200)

	} catch (err) {
		console.log("❌ ERRO GERAL:", err)
		res.sendStatus(500)
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log("🚀 Servidor rodando na porta", PORT)
})
