import pool from '../config/db.js'
import bcrypt from 'bcrypt'

// /account/buyer/
const buyerLogin = (req, res) => {
  // check si email + mdp (hashé en SHA256) correspondent à qqn dedans
  // si oui, retourner userId de l'utilisateur qui agit comme token
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({message:"Missing email or password"})
  }
  
  pool.query('SELECT "buyerId", email, password from buyer WHERE email = $1', [email], (error, results) => {
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
      return res.status(200).json({"token": results.rows[0].buyerId})
    } else {
      // Compte refusé
      return res.status(401).json()
    }
  })
}

const buyerRegister = (req, res) => {
  // prendre toutes les infos qu'on me donne dans le body et créer un compte
  // pas de vérification par mail/téléphone pour l'instant car trop compliqué pour ce mini-projet
  // retour d'un web token aussi
  
  const rounds = 10 // this number can be changed later as the number of rounds is available in the hash
  
  const {email, password, name, telephone} = req.body
  // TODO: add verification that email is only used once
  
  if (!email || !password || !name || !telephone) {
    return res.status(400).json({message: "missing arguments"})
  }
  
  const hashPw = bcrypt.hashSync(password, rounds)
  
  pool.query("INSERT INTO buyer(email, password, name, telephone) VALUES ($1, $2, $3, $4)", [email, hashPw, name, telephone], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(502).json({message: "db error"})
    }
    
    return res.status(200).json()
  })
}

export {
  buyerLogin,
  buyerRegister
}