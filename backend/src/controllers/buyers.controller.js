import pool from '../config/db.js'

// /buyers/:id
const getBuyer = async (req, res) => {
  const id = parseInt(req.params.id)

  if (!id) {
    return res.status(404).json({})
  }
  
  pool.query('SELECT "buyerId", name, email, telephone FROM buyer WHERE "buyerId" = $1 ORDER BY "buyerId" ;', [id], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "Database error"})
    }
    if (results.rows.length == 0) return res.status(204).json({message: "No seller found"})
    else return res.status(200).json(results.rows[0])
  })
}

export {
  getBuyer
}