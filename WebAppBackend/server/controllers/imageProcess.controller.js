import axios from 'axios';
import fs from 'fs';
import multer from 'multer';
import FormData from 'form-data';
import BiomassRecord from '../models/biomassRecord.model.js';

const upload = multer({ dest: 'uploads/' });

/**
 * Controller to handle image upload, send to object detection model, and return count.
 */
export const processImage = async (req, res) => {
    let filePath = null; // <-- Declare outside try
    try {
        // Check if file is present
        filePath = req.file ? req.file.path : null; 
        if (!req.file) {
            console.log('No file uploaded!');
            return res.status(400).json({ message: 'No image file uploaded.' });
        }

        // Read the entire file into a buffer
        const fileBuffer = fs.readFileSync(filePath);

        const formData = new FormData();
        formData.append('image', fileBuffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Send image to object detection model server (adjust URL as needed)
        // The FastAPI model_server.py is configured to run on port 8000 in this repo
        /*
        const response = await axios.post(
            'http://localhost:8000/predict', 
            formData,
            */
        const modelServerUrl = process.env.MODEL_SERVER_URL || 'http://localhost:8000';
        const response = await axios.post(
            `${modelServerUrl}/predict`, 
            formData,
            {
                headers: formData.getHeaders(),
                timeout: 120000 // increase timeout for model inference
            }
        );
        
        // Remove uploaded file after processing
        fs.unlinkSync(req.file.path);

        const {count, calculatedBiomassGrams, recommendedFeedGrams, processedImageBase64} = response.data;
        
        // Save biomass record to database (include generated recordId and ownerId)
        const biomassRecord = new BiomassRecord({
            dateTime: new Date(),
            shrimpCount: count,
            biomass: calculatedBiomassGrams,
            feedMeasurement: recommendedFeedGrams,
            ownerId: req.body.ownerId // Assuming user ID is passed in the request body
        });
        const savedRecord = await biomassRecord.save();

        // Return saved record id so frontend can reference it
        return res.status(200).json({
            status: 'success',
            count: count,
            biomass: calculatedBiomassGrams,
            feed: recommendedFeedGrams,
            processedImage: processedImageBase64, // base64 string
            record: {
                id: savedRecord._id,
                shrimpCount: savedRecord.shrimpCount,
                biomass: savedRecord.biomass,
                feedMeasurement: savedRecord.feedMeasurement,
                dateTime: savedRecord.dateTime
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error processing image', error: error.message });
    } finally {
        // Ensure file is cleaned up on success OR failure
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`Cleaned up temporary file: ${filePath}`);
            } catch (cleanupError) {
                console.error('Failed to clean up file:', cleanupError);
            }
        }
    }
};

// Export multer upload middleware for use in route
export { upload };
