const {ApolloServer, PubSub} = require('apollo-server')
const mongoose = require("mongoose")
require("dotenv").config()

const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")
const pubsub = new PubSub()

const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({req}) => ({req, pubsub})
})

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDb Connected")
        return server.listen({port: PORT}) 
        .then(res => console.log(`server running at ${res.url}`))
    })
    .catch(err => {
        console.error(err)
    }) 


