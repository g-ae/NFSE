import { Router } from 'express'
import { getBuyer, getAllBuyers } from '../controllers/buyers.controller.js'

const router = Router()

router.route("/:id").get(getBuyer)

router.route("/").get(getAllBuyers)

export default router;