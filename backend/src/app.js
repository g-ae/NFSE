import express from 'express'
import pool from './config/db.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 4000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.on("error", (error) => {
  console.log("Erreur => ", error)
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

// route implementation
import buyerRoute from './routes/buyers.route.js'
import sellerRoute from './routes/sellers.route.js'
import bundleRoute from './routes/bundles.route.js'
import accountRoute from './routes/account.route.js'
import ratingsRoute from './routes/ratings.route.js'

// routes
app.use("/buyers", buyerRoute)
app.use("/sellers", sellerRoute)
app.use("/bundles", bundleRoute)
app.use("/account", accountRoute)
app.use("/ratings", ratingsRoute)

// Cleanup task: Unreserve bundles held for > 15 mins without confirmation
setInterval(async () => {
  try {
    await pool.query("UPDATE \"bundle\" SET \"reservedTime\" = NULL, \"buyerId\" = NULL WHERE \"reservedTime\" < NOW() - INTERVAL '15 minutes' AND \"confirmedTime\" IS NULL;");
  } catch (err) {
    console.error("Error cleaning up expired bundles:", err);
  }
}, 60 * 1000);

export default app;