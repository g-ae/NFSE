import pool from '../config/db.js'

// /sellers
const getSellers = async (req, res) => {
    pool.query('SELECT "sellerId", name, telephone, street || \' \' || street_no as "address", state, country FROM seller ORDER BY "sellerId";', (error, results) => {
        if (error) {
            console.log("Erreur =>", error)
            res.status(502).json({message: "Database error"})
            return
        }
        res.status(200).json(results.rows)
    })
}

// /sellers/:id
const getSeller = async (req, res) => {
    const id = parseInt(req.params.id)

    if (!id) {
        return res.status(404).json({})
    }
    
    pool.query('SELECT "sellerId", name, telephone, street || \' \' || street_no as "address", state, country FROM seller WHERE "sellerId" = $1 ORDER BY "sellerId" ;', [id], (error, results) => {
        if (error) {
            console.log("Erreur =>", error)
            return res.status(502).json({message: "Database error"})
        }
        if (results.rows.length == 0) return res.status(204).json({message: "No seller found"})
        else return res.status(200).json(results.rows[0])
    })
}

export {
    getSellers, getSeller
}