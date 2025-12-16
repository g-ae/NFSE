import pool from '../config/db.js'

const SELECT_QUERY = 'SELECT "bundleId", "sellerId", "buyerId", "paymentMethodId", content, "pickupStartTime", "pickupEndTime", "reservedTime", confirmed, price, "pickupRealTime" FROM bundle'

const getBundles = async (req, res) => {
  pool.query(SELECT_QUERY + ' WHERE "reservedTime" is NULL', (error, results) => {
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

// /bundles/new
const newBundle = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  if (token[0] != "s") return res.status(401).json({message: "this action cannot be performed by the specified account"})
  
  const id = token.split('/')[1]

  const {content, pickupStartTime, pickupEndTime, price} = req.body
  
  let pricef
  try {
    pricef = parseFloat(price)
    Date.parse(pickupStartTime)
    Date.parse(pickupEndTime)
  } catch(e) {
    return res.status(400).json({message: "arg type is wrong"})
  }
  console.log(typeof pricef, pricef)
  
  if (!content || !pickupStartTime || !pickupEndTime || !price) return res.status(400).json({message: "missing data"})
  
  pool.query("INSERT INTO bundle(\"sellerId\", \"content\", \"pickupStartTime\", \"pickupEndTime\", price) VALUES($1, $2, $3, $4, $5)", [id, content, pickupStartTime, pickupEndTime, pricef], (error, results) => {
    if (error) {
      if (error.code == '23503') return res.status(401).json({message: "authorization is required"})
      console.log(error)
      return res.status(502).json({message: "db error"})
    }
    
    return res.status(200).json()
  })
}

// /bundles/reserved/
const getReservedBundle = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  if (token[0] != "b") return res.status(401).json({message: "this action cannot be performed by the specified account"})
  
  const id = token.split('/')[1]

  pool.query(SELECT_QUERY + ' WHERE "sellerId" = $1 AND "reservedTime" is not NULL AND "confirmed" = FALSE', [id], (error, results) => {
    if (error) {
      console.log("Bundle ID error => ", error)
      return res.status(502).json({message: "Database error"})
    }
    if (results.rows.length === 0) return res.status(204).json({message: "No bundle found"})
    else return res.status(200).json(results.rows[0])
  })
}

// /bundles/confirmed/
const getConfirmedBundle = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  if (token[0] != "b") return res.status(401).json({message: "this action cannot be performed by the specified account"})
  
  const id = token.split('/')[1]

  pool.query(SELECT_QUERY + ' WHERE "sellerId" = $1 AND "confirmed" = TRUE', [id], (error, results) => {
    if (error) {
      console.log("Bundle ID error => ", error)
      return res.status(502).json({message: "Database error"})
    }
    if (results.rows.length === 0) return res.status(204).json({message: "No bundle found"})
    else return res.status(200).json(results.rows[0])
  })
}

// TODO:
// /bundles/reserve
const patchReserveBundle = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  if (token[0] != "b") return res.status(401).json({message: "this action cannot be performed by the specified account"})
  
  const id = token.split('/')[1]

  pool.query(SELECT_QUERY + ' WHERE "sellerId" = $1 AND "reservedTime" is not NULL AND "confirmed" = FALSE', [id], (error, results) => {
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
  getBundle,
  newBundle,
  getReservedBundle,
  getConfirmedBundle
}