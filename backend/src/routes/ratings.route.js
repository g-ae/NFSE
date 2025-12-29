import { Router } from 'express'
import { getHasRated, postRate, getSellerRating, getBuyerRating } from '../controllers/ratings.controller.js'

const router = Router()

router.route("/hasRated").get(getHasRated)
router.route("/rate").post(postRate)

router.route("/buyer/:id").get(getBuyerRating)
router.route("/seller/:id").get(getSellerRating)

export default router;