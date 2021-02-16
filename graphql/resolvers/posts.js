const Post = require("../../models/post")
const checkAuth = require("../../utils/check-auth")

module.exports = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find()
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
        async createPost(_, {body}, context){
            const user = checkAuth(context)
            console.log(user)

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString 
            })

            const post = await newPost
            return post
        }
    }
}