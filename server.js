import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

const SECRET = "r1chy0-secret"

// 🔐 Roblox Open Cloud
const UNIVERSE_ID = "SEU_UNIVERSE_ID"
const DATASTORE_NAME = "WhitelistData"
const API_KEY = "SUA_API_KEY"

app.post("/payhip-webhook", async (req, res) => {
	try {
		const body = req.body

		const userId = body?.custom_fields?.robloxId
		const secret = body?.secret

		if (secret !== SECRET) return res.sendStatus(403)
		if (!userId) return res.sendStatus(400)

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
		console.log(err)
		res.sendStatus(500)
	}
})

app.listen(3000, () => {
	console.log("Webhook rodando")
})
