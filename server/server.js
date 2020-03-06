const express = require('express');
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
                useNewUrlparser: true
            }
        );

        console.log('MongoDB is Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

app.use(bodyParser.json());

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;