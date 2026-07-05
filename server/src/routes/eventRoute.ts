import express from 'express'
import { protect } from '../middleware/auth.js'
import { getEvents } from '../controllers/eventController.js'

const router = express.Router()

router.get('/', protect ,getEvents)


export default router;