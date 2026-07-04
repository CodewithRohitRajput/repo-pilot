import {Router} from 'express'
import { protect } from '../middleware/auth.js'
import { githubWebhook } from '../controllers/webhookController.js'

const router = Router()

router.post('/github', protect ,githubWebhook)

export default router;