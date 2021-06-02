const production = false;
module.exports = {
    secretKey: "kkkeje8vpawh57ttrcuwqwww.amalitechlkjeieije3u88jdggh./?",
    createSuperUser: false,
    createBatch: false,
    createRole: false,
    admin: {
        email: 'admin@amalitech.org',
        password: 'administrator',
        firstname: 'Salami',
        lastname: 'Suleiman',
        role_type: 'admin'
    },
    batch: {
        batch_name: "batch2"
    },
    role:{
        role_type: "user"
    },
    mongoUri: production ? "mongodb+srv://jefferson:8vpawh75ttrcu2@amalitech.0czuq.mongodb.net/transcript?retryWrites=true&w=majority" : "mongodb://localhost:27017/transcript"
}