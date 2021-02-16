const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {UserInputError} = require("apollo-server")

const User = require("../../models/user")

module.exports = {
    Mutation: {
        async register(_, {registerInput: {username, email, password, confirmPassword}}){
            //TODO: Validate user data
            //Make sure user doesnt already exist
            const user = await User.findOne({username})
            if(user){
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "username is already taken"
                    }
                })
            }
            //hash password and create auth token
            password = await bcrypt.hash(password, 10)

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })
            const res = await newUser.save()

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, process.env.SECRET_KEY, {expiresIn: "1h"})

            return {
                ...res._doc,
                id: res._id,
                token

            }
        }
    }
}