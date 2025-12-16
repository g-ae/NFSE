import { Router } from 'express'
import { getBundles, getBundle, newBundle, getReservedBundle, getConfirmedBundle } from '../controllers/bundles.controller.js'

const router = Router()

router.route("/").get(getBundles)
router.route("/new").post(newBundle)
router.route("/:id").get(getBundle)

router.route("/reserved").get(getReservedBundle)
router.route("/confirmed").get(getConfirmedBundle)

export default router;