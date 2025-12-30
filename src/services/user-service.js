const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserRepository = require('../repository/user-repository');
const { JWT_KEY } = require('../config/serverConfig');

class UserService {
    constructor(){
        this.userRepository = new UserRepository();
    }

    async create(data){
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    async destroy(userId){
        try {
            const user = await this.userRepository.destroy(userId);
            return user;
        } catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    createToken(user){
        try {
            const result = jwt.sign(user, JWT_KEY, {expiresIn : '24h'});
            return result;
        } 
        catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    verifyToken(token){
        try {
            const result = jwt.verify(token, JWT_KEY);
            return result;
        } 
        catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword){
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword); 
        } 
        catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    async signIn(email, plainPassword){
        try {
            // step 1 -> get the user using the email
            const user = await this.userRepository.getByEmail(email);
            // step 2 -> compare incoming plain password with stored encrypted password
            const passwordMatch = await this.checkPassword(plainPassword, user.password);

            if(!passwordMatch){
                comsole.log("Password doesn't match");
                throw {error : "Invalid password"};
            }
            // step 3 -> if passwords match then create a token and send it to the user
            const newJWT = this.createToken({email : user.email, id : user.id});
            return newJWT;
        } 
        catch (error) {
            console.log("Something went wrong in the sign in process");
            throw error;
        }
    }

    async isAuthenticated(token){
        try {
            const response = this.verifyToken(token);
            if(!response){
                throw {error : 'Invalid token'};
            }
            const user = this.userRepository.getById(response.id);
            if(!user){
                throw {error : 'No user with the corresponding token exists'};
            }
        } 
        catch (error) {
            console.log("Something went wrong in auth process");
            throw error;
        }
    }
}

module.exports = UserService;  
