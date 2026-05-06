import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

const SECRET = process.env.PAYHIP_WEBHOOK_SECRET
const API_KEY = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID

app.post("/payhip-webhook", async (req, res) => {
	try {
		const body = req.body

		const userId = body?.custom_fields?.robloxId
		const secret = body?.secret

		if (!userId) return res.sendStatus(400)
		if (secret !== SECRET) return res.sendStatus(403)

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
			console.log(await result.text())
			return res.sendStatus(500)
		}

		console.log("Whitelist adicionada:", userId)

		res.sendStatus(200)

	} catch (e) {
		console.log(e)
		res.sendStatus(500)
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log("Rodando na porta", PORT)
})
