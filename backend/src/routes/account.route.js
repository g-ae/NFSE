import e, { Router } from 'express'
import { buyerLogin, buyerRegister } from '../controllers/account_buyer.controller.js'
import { sellerLogin, sellerRegister } from '../controllers/account_seller.controller.js'

const router = Router()

router.route("/buyer/register").post(buyerRegister)
router.route("/buyer/").post(buyerLogin)

router.route("/seller/register").post(sellerRegister)
router.route("/seller/").post(sellerLogin)

export default router