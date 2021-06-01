const Batch = require('../../models/batch');
class BatchHandler{
    async enrollUser(batchName, userId) {

        // Find the batch with the batch name if it was provided
        const batch = await Batch.findOne({ batch_name: batchName });
        if (!batch) return null;
        batch.users.push({
            enrollment_date: Date.now(),
            user_id: userId
        });
        batch.users.enrollment_date = Date.now();
        return batch.save()
    }
}

module.exports = new BatchHandler();