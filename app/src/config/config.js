const production = true;
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
<<<<<<< HEAD
        role_type: 'admin'
    },
    batch: {
        batch_name: "batch2"
    },
    role:{
        role_type: "user"
    },
    mongoUri: production ? "mongodb+srv://jefferson:8vpawh75ttrcu2@amalitech.0czuq.mongodb.net/transcript?retryWrites=true&w=majority" : "mongodb://localhost:27017/transcript"
=======
        role_type: '60a2a5de7b8e7558492fcc5a'
    }
>>>>>>> f247b0f1aa3b5c1d7676eebb5372722c9ff1152f
}