import BiomassRecord from '../models/biomassRecord.model.js';

export const getBiomassRecords = async (req, res) => {
    try {
        const { ownerId } = req.query;
        let query = {};

        if (ownerId) {
            query.ownerId = ownerId;
        }

        const records = await BiomassRecord.find(query);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching biomass records', error: error.message });
    }
};

export const getLatestBiomassRecord = async (req, res) => {
    try {
        const { ownerId } = req.query;
        let query = {};

        if (ownerId) {
            query.ownerId = ownerId;
        }

        const latest = await BiomassRecord.find(query).sort({ dateTime: -1 }).limit(1);
        res.json(latest[0] || {});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching latest biomass record', error: error.message });
    }
};

export const deleteBiomassRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecord = await BiomassRecord.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Biomass record not found' });
        }
        res.json({ message: 'Biomass record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting biomass record' });
    }
};
