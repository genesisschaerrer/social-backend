const {ApolloServer} = require('apollo-server')
const mongoose = require("mongoose")
require("dotenv").config()


// const Post = require("./models/post")
// const User = require("./models/user")

const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")

// const resolvers = {
//     Query: {
//       async getPosts(){
//           try{
//               const posts = await Post.find()
//               return posts
//           } catch (err){
//                 throw new Error(err)
//             }
//         }
//     }
// }

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


