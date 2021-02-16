const {ApolloServer} = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require("mongoose")
require("dotenv").config()



const typeDefs = gql`
    type Query{
       sayHi: String!  
    }
`

const resolvers = {
    Query: {
        sayHi: () => "hello world!!!!"
    }
}

const server = new ApolloServer({
    typeDefs, 
    resolvers
})

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDb Connected")
        return server.listen({port: 5000}) 
        .then(res => console.log(`server running at ${res.url}`))
    })

// server.listen({port: 5000}) 
//     .then(res => console.log(`server running at ${res.url}`))

