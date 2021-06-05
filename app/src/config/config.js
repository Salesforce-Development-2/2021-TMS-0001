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
        role_type: 'admin'
    },
    batch: {
        batch_name: "batch2"
    },
    role:{
        role_type: "user"
    },
    mongoUri: production ? process.env.MONGO_URL : process.env.LOCAL_MONGO
}