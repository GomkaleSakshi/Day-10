import express from 'express';
import {
  listFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} from '../controllers/facilityController.js';
import { ensurePositiveId, validateFacility } from '../middleware/validators.js';

const router = express.Router();

router.get('/', listFacilities);
router.get('/:id', ensurePositiveId, getFacilityById);
router.post('/', validateFacility, createFacility);
router.put('/:id', ensurePositiveId, validateFacility, updateFacility);
router.patch('/:id', ensurePositiveId, validateFacility, updateFacility);
router.delete('/:id', ensurePositiveId, deleteFacility);

export default router;
