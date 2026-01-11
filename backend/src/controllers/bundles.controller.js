import pool from '../config/db.js'

const SELECT_QUERY = 'SELECT "bundleId", b."sellerId", "buyerId", "paymentMethodId", content, "pickupStartTime", "pickupEndTime", "reservedTime", "confirmedTime", price, "pickupRealTime", image_url, s.latitude, s.longitude FROM bundle b JOIN seller s ON b."sellerId" = s."sellerId"'

const getBundles = async (req, res) => {
  pool.query(SELECT_QUERY + ' WHERE "reservedTime" is NULL', (error, results) => {
    if (error) {
      console.log("getBundles error =>", error)
      return res.status(502).json({message: "Database error"})
    }
    res.status(200).json(results.rows)
  })
}

const getBundle = async (req, res) => {
  const id = parseInt(req.params.id)

  if (!id) return res.status(404).json({})

  pool.query(SELECT_QUERY + ' WHERE "bundleId" = $1', [id], (error, results) => {
    if (error) {
      console.log("getBundle error => ", error)
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

  const {content, pickupStartTime, pickupEndTime, price, image_url} = req.body
  
  if (Date.parse(pickupEndTime) - Date.parse(pickupStartTime) < 30*1000*60) {
    // if less than 30 mins in pickup time, error
    return res.status(400).json({message: "the client must have at least 30 mins to pick up the bundle"})
  }
  
  let pricef
  try {
    pricef = parseFloat(price)
    Date.parse(pickupStartTime)
    Date.parse(pickupEndTime)
  } catch(e) {
    return res.status(400).json({message: "arg type is wrong"})
  }
  
  if (!content || !pickupStartTime || !pickupEndTime || !price) return res.status(400).json({message: "missing data"})
  
  pool.query("INSERT INTO bundle(\"sellerId\", \"content\", \"pickupStartTime\", \"pickupEndTime\", price, image_url) VALUES($1, $2, $3, $4, $5, $6)", [id, content, pickupStartTime, pickupEndTime, pricef, image_url], (error, results) => {
    if (error) {
      if (error.code == '23503') return res.status(401).json({message: "authorization is required"})
      console.log(error)
      return res.status(502).json({message: "db error"})
    }
    
    return res.status(200).json()
  })
}

// /bundles/reserved/
const getReservedBundles = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  const type = token.split('/')[0]
  const id = token.split('/')[1]

  pool.query(SELECT_QUERY + ` WHERE b."${type == "b" ? "buyerId" : "sellerId"}" = $1 AND "reservedTime" IS NOT NULL AND "confirmedTime" IS NULL`, [id], (error, results) => {
    if (error) {
      console.log("getReservedBundles error => ", error)
      return res.status(502).json({message: "Database error"})
    }
    return res.status(200).json(results.rows)
  })
}

// /bundles/confirmed/
const getConfirmedBundles = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  const type = token.split('/')[0]
  const id = token.split('/')[1]

  pool.query(SELECT_QUERY + ` WHERE b."${type == "b" ? "buyerId" : "sellerId"}" = $1 AND "confirmedTime" IS NOT NULL AND "pickupRealTime" IS NULL`, [id], (error, results) => {
    if (error) {
      console.log("getConfirmedBundle error => ", error)
      return res.status(502).json({message: "Database error"})
    }
    return res.status(200).json(results.rows)
  })
}

// /bundles/history/
const getOldBundles = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  const type = token.split('/')[0]
  const id = token.split('/')[1]

  pool.query(SELECT_QUERY + ` WHERE b."${type == "b" ? "buyerId" : "sellerId"}" = $1 AND "pickupRealTime" IS NOT NULL`, [id], (error, results) => {
    if (error) {
      console.log("getOldBundles error => ", error)
      return res.status(502).json({message: "Database error"})
    }
    return res.status(200).json(results.rows)
  })
}

// /bundles/reserve
const patchReserveBundle = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  // authorization
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  if (token[0] != "b") return res.status(401).json({message: "this action cannot be performed by the specified account"})
  
  const buyerid = token.split('/')[1]

  // body
  if (!req.body) return res.status(400).json()
  const { bundleId } = req.body
  if (!bundleId) return res.status(400).json()

  pool.query('UPDATE bundle SET "reservedTime" = $1, "buyerId" = $2 WHERE "bundleId" = $3', [new Date(Date.now()).toJSON(), buyerid, bundleId], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "Database error"})
    }
    return res.status(200).json(results.rows)
  })
}

// /bundles/unreserve
const patchUnreserveBundle = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  // authorization
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  if (token[0] != "b") return res.status(401).json({message: "this action cannot be performed by the specified account"})
  
  const buyerid = token.split('/')[1]

  // body
  if (!req.body) return res.status(400).json()
  const { bundleId } = req.body
  if (!bundleId) return res.status(400).json()

  pool.query('UPDATE bundle SET "reservedTime" = NULL, "buyerId" = NULL WHERE "buyerId" = $1 AND "bundleId" = $2 AND "confirmedTime" IS NULL', [buyerid, bundleId], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "Database error"})
    }
    return res.status(200).json(results.rows)
  })
}

// /bundles/confirm
const patchConfirmBundle = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  // authorization
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  if (token[0] != "b") return res.status(401).json({message: "this action cannot be performed by the specified account"})
  
  const buyerid = token.split('/')[1]
  
  // body
  if (!req.body) return res.status(400).json()
  const { bundleId } = req.body
  if (!bundleId) return res.status(400).json()
  
  pool.query('UPDATE bundle SET "confirmedTime" = $1 WHERE "buyerId" = $2 AND "bundleId" = $3', [new Date(Date.now()).toJSON(), buyerid, bundleId], (error, results) => {
    if (error) {
      console.log("patchConfirmBundle error,",error)
      return res.status(502).json({message: "Database error"})
    }
    return res.status(200).json(results.rows)
  })
}

// /bundles/confirmPickup
const patchConfirmBundlePickup = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  // authorization
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  if (token[0] != "s") return res.status(401).json({message: "this action cannot be performed by the specified account"})
  
  const sellerId = token.split('/')[1]
  
  // body
  if (!req.body) return res.status(400).json({message: "missing body"})
  const { bundleId } = req.body
  if (!bundleId) return res.status(400).json({message: "missing bundleId in body"})
  
  pool.query('UPDATE bundle SET "pickupRealTime" = $1 WHERE "sellerId" = $2 AND "bundleId" = $3', [new Date(Date.now()).toJSON(), sellerId, bundleId], (error, results) => {
    if (error) {
      console.log("patchConfirmBundlePickup error,",error)
      return res.status(502).json({message: "Database error"})
    }
    return res.status(200).json(results.rows)
  })
}

export {
  getBundles,
  getBundle,
  newBundle,
  getReservedBundles,
  getConfirmedBundles,
  patchReserveBundle,
  patchUnreserveBundle,
  patchConfirmBundle,
  getOldBundles,
  patchConfirmBundlePickup
}