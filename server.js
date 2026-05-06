import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

// 🔐 ENV (Render)
const API_KEY = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID

//--------------------------------------------------
// ✔ WEBHOOK PAYHIP
//--------------------------------------------------
app.post("/payhip-webhook", async (req, res) => {
	try {
		console.log("🔥 WEBHOOK RECEBIDO:")
		console.log(JSON.stringify(req.body, null, 2))

		// ✔ transforma perguntas em objeto
		const questions = Object.fromEntries(
			req.body?.checkout_questions?.map(q => [
				q.question?.trim(),
				q.response
			]) || []
		)

		// ✔ pega Roblox ID
		const robloxId =
			questions["Enter your Roblox UserID"] ||
			questions["Roblox UserID"] ||
			questions["UserID"]

		if (!robloxId) {
			console.log("❌ ROBLOX ID NÃO ENCONTRADO")
			return res.sendStatus(400)
		}

		console.log("✔ ROBLOX ID:", robloxId)

		// ✔ Open Cloud URL CORRETA (sem datastore no path)
		const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`

		// ✔ salvando no Open Cloud (datastoreName no BODY)
		const result = await fetch(url, {
			method: "POST",
			headers: {
				"x-api-key": API_KEY,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				datastoreName: "PayhipWhitelistServer",
				key: `whitelist_${robloxId}`,
				value: "eterno"
			})
		})

		if (!result.ok) {
			const errText = await result.text()
			console.log("❌ ERRO OPEN CLOUD:", errText)
			return res.sendStatus(500)
		}

		console.log("✔ WHITELIST ADICIONADA:", robloxId)
		console.log("📦 EXTRAS:", questions)

		res.sendStatus(200)

	} catch (err) {
		console.log("❌ ERRO GERAL:", err)
		res.sendStatus(500)
	}
})

//--------------------------------------------------
// ✔ SERVER START
//--------------------------------------------------
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log("🚀 Servidor rodando na porta", PORT)
})
