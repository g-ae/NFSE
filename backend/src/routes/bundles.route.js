import { Router } from 'express'
import { getBundles, getBundle, newBundle, getReservedBundles, getConfirmedBundles, patchReserveBundle, patchUnreserveBundle, patchConfirmBundle, getOldBundles, patchConfirmBundlePickup } from '../controllers/bundles.controller.js'

const router = Router()

router.route("/").get(getBundles)

router.route("/reserved").get(getReservedBundles)
router.route("/confirmed").get(getConfirmedBundles)
router.route("/history").get(getOldBundles)

// add
router.route("/new").post(newBundle)

// actions
router.route("/reserve").patch(patchReserveBundle)
router.route("/unreserve").patch(patchUnreserveBundle)
router.route("/confirm").patch(patchConfirmBundle)
router.route("/confirmPickup").patch(patchConfirmBundlePickup)

router.route("/:id").get(getBundle)


export default router;