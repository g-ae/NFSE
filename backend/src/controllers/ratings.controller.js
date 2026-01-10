import pool from '../config/db.js'

// /ratings/hasRated
export const getHasRated = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  // authorization
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  const currUserId = token.split('/')[1]
  
  
  // body
  if (!req.query) return res.status(400).json({message: "missing params"})
  const { id } = req.query
  if (!id) return res.status(400).json({message: "missing userId in body"})
  
  pool.query(`SELECT "sellerId", "buyerId", stars FROM ${token[0] == "b" ? "buyer_feedback" : "seller_feedback"} WHERE "buyerId" = $1 AND "sellerId" = $2;`, [token[0] == "b" ? currUserId : id, token[0] == "s" ? currUserId : id], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "Database error"})
    }
    if (results.rows.length == 0) return res.status(200).json([])
    else return res.status(200).json(results.rows)
  })
}

// /ratings/rate
export const postRate = async (req, res) => {
  if (!req.headers.authorization) return res.status(403).json({message: "authorization is required"})
  // authorization
  const bearer = req.headers.authorization
  
  const token = bearer.split(' ')[1]
  const currUserId = token.split('/')[1]
  
  // body
  if (!req.body) return res.status(400).json({message: "missing body"})
  const { userId, stars } = req.body
  if (!userId) return res.status(400).json({message: "missing userId in body"})
  if (!stars) return res.status(400).json({message: "missing star rating in body"})
  
  pool.query(`INSERT INTO ${token[0] == "b" ? "buyer_feedback" : "seller_feedback"}("sellerId", "buyerId", stars) VALUES($1, $2, $3);`, [token[0] == "s" ? currUserId : userId, token[0] == "b" ? currUserId : userId, stars], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "Database error"})
    }
    if (results.rows.length == 0) return res.status(204).json([])
    else return res.status(200).json(results.rows)
  })
}

const getRating = async (req, res, type) => {
  if (!req.params) return res.status(400).json({message: "missing params"})
  const { id } = req.params
  if (!id) return res.status(400).json({message: "missing userId in body"})
  
  pool.query(`SELECT AVG(stars) FROM ${type == "buyer" ? "seller" : "buyer"}_feedback WHERE "${type}Id" = $1 GROUP BY "${type}Id";`, [id], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "Database error"})
    }
    if (results.rows.length == 0) return res.status(200).json({ rating: 0 })
    else return res.status(200).json({ rating: results.rows[0].avg })
  })
}

export const getBuyerRating = async (req, res) => {
  return await getRating(req, res, "buyer")
}

export const getSellerRating = async (req, res) => {
  return await getRating(req, res, "seller")
}