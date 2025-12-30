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
}

module.exports = UserService;  
