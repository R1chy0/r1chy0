import express from "express"
import bodyParser from "body-parser"
import fetch from "node-fetch"

const app = express()
app.use(bodyParser.json())

const API_KEY = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.UNIVERSE_ID

app.post("/payhip", async (req, res) => {
    try {
        const userId = req.body.custom_fields?.robloxUserId

        if (!userId) return res.sendStatus(400)

        await fetch(
            `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/WhitelistPlayers/entries/entry`,
            {
                method: "POST",
                headers: {
                    "x-api-key": API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    key: userId.toString(),
                    value: true
                })
            }
        )

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.listen(3000, () => console.log("Server online"))
