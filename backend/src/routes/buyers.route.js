import { Router } from 'express'
import { getBuyer } from '../controllers/buyers.controller.js'

const router = Router()

router.route("/:id").get(getBuyer)

export default router;