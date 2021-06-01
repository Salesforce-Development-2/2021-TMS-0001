const production = true;
module.exports = {
    secretKey: "kkkeje8vpawh57ttrcuwqwww.amalitechlkjeieije3u88jdggh./?",
    createSuperUser: false,
    admin: {
        email: 'admin@amalitech.org',
        password: 'administrator',
        firstname: 'Salami',
        lastname: 'Suleiman',
        role_type: 'admin'
    },
    mongoUri: production ? "mongodb+srv://jefferson:8vpawh75ttrcu2@amalitech.0czuq.mongodb.net/transcript?retryWrites=true&w=majority" : "mongodb://localhost:27017/transcript"
}