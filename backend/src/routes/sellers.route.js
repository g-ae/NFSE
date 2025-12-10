import { Router } from 'express'
import { getSellers, getSeller } from '../controllers/sellers.controller.js'

const router = Router()

router.route("/").get(getSellers)
router.route("/new").get((req, res) => {res.status(501).json({})})
router.route("/:id").get(getSeller)

export default router;