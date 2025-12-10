import { Router } from 'express'
import { getBundles, getBundle } from '../controllers/bundles.controller.js'

const router = Router()

router.route("/").get(getBundles)
router.route("/new").get((req, res) => {res.status(501).json({})})
router.route("/:id").get(getBundle)

export default router;