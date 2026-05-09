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

		//--------------------------------------------------
		// ✔ ENVIO PARA ROBLOX (MessagingService)
		//--------------------------------------------------
		const result = await fetch(
			`https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/WhitelistUpdate`,
			{
				method: "POST",
				headers: {
					"x-api-key": API_KEY,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					message: JSON.stringify({
						action: "add",
						id: Number(robloxId)
					})
				})
			}
		)

		if (!result.ok) {
			const errText = await result.text()
			console.log("❌ ERRO ROBLOX:", errText)
			return res.sendStatus(500)
		}

		console.log("✔ WHITELIST ENVIADA:", robloxId)

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
