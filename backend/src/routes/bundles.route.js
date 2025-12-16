import { Router } from 'express'
import { getBundles, getBundle, newBundle } from '../controllers/bundles.controller.js'

const router = Router()

router.route("/").get(getBundles)
router.route("/new").post(newBundle)
router.route("/:id").get(getBundle)

export default router;