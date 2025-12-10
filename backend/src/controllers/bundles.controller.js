import pool from '../config/db.js'

const SELECT_QUERY = 'SELECT "bundleId", "buyerId", "paymentMethodId", content, "pickupStartTime", reserved, confirmed, price, "pickupRealTime" FROM bundle'

const getBundles = async (req, res) => {
  pool.query(SELECT_QUERY, (error, results) => {
    if (error) {
      console.log("Bundle error =>", error)
      return res.status(502).json({message: "Database error"})
    }
    res.status(200).json(results.rows)
  })
}

const getBundle = async (req, res) => {
  const id = parseInt(req.params.id)

  if (!id) return res.status(404).json({})

  pool.query(SELECT_QUERY + ' WHERE "sellerId" = $1', [id], (error, results) => {
    if (error) {
      console.log("Bundle ID error => ", error)
      return res.status(502).json({message: "Database error"})
    }
    if (results.rows.length === 0) return res.status(204).json({message: "No bundle found"})
    else return res.status(200).json(results.rows[0])
  })
}

export {
  getBundles,
  getBundle
}