import express from 'express';
import { getBiomassRecords, deleteBiomassRecord } from '../controllers/biomassRecord.controller.js';

const router = express.Router();

router.get('/', getBiomassRecords);
router.delete('/:id', deleteBiomassRecord);

export default router;
