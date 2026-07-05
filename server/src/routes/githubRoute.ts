import express from 'express'
import { Router } from 'express'    
import {getRepositories,connectRepository, connectedRepo} from '../controllers/githubController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getRepositories)
router.post('/connect', protect, connectRepository)
router.get('/connected', protect, connectedRepo)

export default router;