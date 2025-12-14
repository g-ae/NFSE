import e, { Router } from 'express'
import { buyerLogin, buyerRegister } from '../controllers/account_buyer.controller.js'

const router = Router()

router.route("/buyer/register").post(buyerRegister)
router.route("/buyer/").post(buyerLogin)

export default router