const {AuthenticationError} = require("apollo-server")
const { argsToArgsConfig } = require("graphql/type/definition")
var moment = require("moment")

const Post = require("../../models/post")
const checkAuth = require("../../utils/check-auth")

module.exports = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts
            } catch (err){
                  throw new Error(err)
              }
        },
        async getPost(_, {postId}) {
            try {
                const post = await Post.findById(postId)
                if(post){
                    return post
                } else {
                    throw new Error("Post not found")
                }
            } catch(error){
                throw new Error(error)
            }
        }
    },

    Mutation: {
        async createPost(_, {body, lotName, status, image}, context){
            const user = checkAuth(context)
            
            if(body.trim() === ""){
                throw new Error("Post body must not be empty")
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                lotName,
                status,
                image,
                createdAt: moment().format('MMMM Do YYYY, h:mm a')
            })

            const post = await newPost.save()
            context.pubsub.publish('NEW_POST', {
                newPost: post
              })
            return post
        }, 
        async deletePost(_, {postId}, context){
            const user = checkAuth(context)

            try{
                const post = await Post.findById(postId)
                if(user.username === post.username){
                    await post.delete()
                    return "Post deleted"
                } else {
                    throw new AuthenticationError("action not allowed")
                }
            } catch(error){
                throw new Error(error)
            }
        }
    },
    Subscription: {
        newPost: {
          subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}