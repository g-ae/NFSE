import { Router } from 'express'
import { getBundles, getBundle, newBundle, getReservedBundles, getConfirmedBundle, patchReserveBundle, patchUnreserveBundle } from '../controllers/bundles.controller.js'

const router = Router()

router.route("/").get(getBundles)

router.route("/reserved").get(getReservedBundles)
router.route("/confirmed").get(getConfirmedBundle)

// add
router.route("/new").post(newBundle)

// actions
router.route("/reserve").patch(patchReserveBundle)
router.route("/unreserve").patch(patchUnreserveBundle)

router.route("/:id").get(getBundle)


export default router;