import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.on("error", (error) => {
  console.log("Erreur => ", error)
})

app.get('/status', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

// route implementation
import sellerRoute from './routes/sellers.route.js'

// routes
app.use("/sellers", sellerRoute)

export default app;