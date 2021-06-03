const Batch = require('../models/batch');
class BatchManager{
    async enrollUser(batchName, userId) {

        // Find the batch with the batch name if it was provided
        const batch = await Batch.findOne({ batch_name: batchName });
        if (!batch) return null;
        batch.users.push({
            enrollment_date: Date.now(),
            user_id: userId
        });
        const savedBatch = await batch.save()
        if(savedBatch) return true;
        return false;
    }
}

module.exports = new BatchManager();