import { connect } from 'mongoose'

export const MongoDb = (urlMongoDb) => connect(urlMongoDb)
        .then(() => { console.log('✅ Connection to DB Established') })
        .catch(err => { console.error(err) })