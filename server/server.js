const express = require('express');
const cors = require('cors');
const mongoUri = require('./creds');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');

const app = express();

if(!mongoUri) {
    throw new Error('You must provide a Mongo Db Uri')
}

const connectDB = async () => {
    try {
        await mongoose.connect(
            mongoUri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log('MongoDB is Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// const errorFn = (error) => {
//     console.log(error.GraphQLError);
//     return {
//         ...error,
//         path: error.path,
//         locations: error.locations,
//         message: error.message
//     }
// }

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));

app.use(bodyParser.json());

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true,
    // customFormatErrorFn: errorFn 
}));

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;