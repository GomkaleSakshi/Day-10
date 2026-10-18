import express from 'express';
import {
  listInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  deleteInspection,
} from '../controllers/inspectionController.js';
import { ensurePositiveId, validateInspection } from '../middleware/validators.js';

const router = express.Router();

router.get('/', listInspections);
router.get('/:id', ensurePositiveId, getInspectionById);
router.post('/', validateInspection, createInspection);
router.put('/:id', ensurePositiveId, validateInspection, updateInspection);
router.patch('/:id', ensurePositiveId, validateInspection, updateInspection);
router.delete('/:id', ensurePositiveId, deleteInspection);

export default router;
