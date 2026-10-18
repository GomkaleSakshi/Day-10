import express from 'express';
import { getHealth } from '../controllers/healthController.js';
import { getDashboard } from '../controllers/dashboardController.js';
import facilityRoutes from './facilityRoutes.js';
import inspectionRoutes from './inspectionRoutes.js';
import complaintRoutes from './complaintRoutes.js';

const router = express.Router();

router.get('/health', getHealth);
router.get('/dashboard', getDashboard);
router.use('/facilities', facilityRoutes);
router.use('/inspections', inspectionRoutes);
router.use('/complaints', complaintRoutes);

export default router;
