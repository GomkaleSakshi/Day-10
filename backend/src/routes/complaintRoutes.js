import express from 'express';
import {
  listComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { ensurePositiveId, validateComplaint } from '../middleware/validators.js';

const router = express.Router();

router.get('/', listComplaints);
router.get('/:id', ensurePositiveId, getComplaintById);
router.post('/', validateComplaint, createComplaint);
router.put('/:id', ensurePositiveId, validateComplaint, updateComplaint);
router.patch('/:id', ensurePositiveId, validateComplaint, updateComplaint);
router.delete('/:id', ensurePositiveId, deleteComplaint);

export default router;
