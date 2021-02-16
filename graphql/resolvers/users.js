const Users = require("../../models/user")

module.exports = {
    Mutation: {
        register(_, args, context, info){
            //TODO: Validate user data
            //Make sure user doent already exist
            //hash password and create auth token
            
        }
    }
}