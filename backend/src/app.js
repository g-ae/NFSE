import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.on("error", (error) => {
  console.log("Erreur => ", error)
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

// route implementation
import sellerRoute from './routes/sellers.route.js'
import bundleRoute from './routes/bundles.route.js'
import accountRoute from './routes/account.route.js'

// routes
app.use("/sellers", sellerRoute)
app.use("/bundles", bundleRoute)
app.use("/account", accountRoute)

export default app;