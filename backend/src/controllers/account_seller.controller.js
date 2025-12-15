import pool from '../config/db.js'
import bcrypt from 'bcrypt'

// /account/seller/
const sellerLogin = (req, res) => {
  // check si email + mdp (hashé en SHA256) correspondent à qqn dedans
  // si oui, retourner userId de l'utilisateur qui agit comme token
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({message:"Missing email or password"})
  }
  
  pool.query('SELECT "sellerId", email, password from seller WHERE email = $1', [email], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "db error"})
    }
    
    if (results.rows.length == 0) {
      return res.status(401).json()
    }
    const account = results.rows[0]
    
    console.log(account)
    
    if (bcrypt.compareSync(password, account.password)) {
      // Compte accepté
      return res.status(200).json({"token": "s/" + results.rows[0].sellerId})
    } else {
      // Compte refusé
      return res.status(401).json()
    }
  })
}

// /account/seller/register
const sellerRegister = async (req, res) => {
  // infos obligatoires:
  // name, email, password
  // country, state, npa
  // street, street_no, telephone
  
  const rounds = 10 // this number can be changed later as the number of rounds is available in the hash
  
  const {email, password, name, telephone, country, state, npa, street, street_no} = req.body
  // TODO: add verification that email is only used once
  var query
  try {
    query = await pool.query("SELECT \"sellerId\" from seller WHERE email = $1", [email])
  } catch(e) {
    console.log(e)
    return res.status(502).json()
  }
  
  if (query.rowCount > 0) {
    return res.status(400).json({message: "email already in use"})
  }
  
  if (!email || !password || !name || !telephone ||
    !country || !state || !npa || !street || !street_no) {
    return res.status(400).json({message: "missing arguments"})
  }
  
  const hashPw = bcrypt.hashSync(password, rounds)
  
  pool.query("INSERT INTO seller(email, password, name, telephone, country, state, npa, street, street_no) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [email, hashPw, name, telephone, country, state, npa, street, street_no], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "db error"})
    }
    
    return res.status(200).json()
  })
}

export {
  sellerLogin,
  sellerRegister
}