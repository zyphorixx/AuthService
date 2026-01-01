const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserRepository = require('../repository/user-repository');

const { JWT_KEY } = require('../config/serverConfig');
const { ValidationError } = require('sequelize');

const AppErrors = require('../utils/error-handler');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {

           
            if (error instanceof ValidationError) {
                throw error;
            }

            console.log("Something went wrong at service layer");
            throw new AppErrors(
                'ServerError',
                'Something went wrong in service',
                'Logical Issue',
                500
            );
        }
    }

    async destroy(userId) {
        try {
            const user = await this.userRepository.destroy(userId);
            return user;
        } catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    createToken(user) {
        try {
            const result = jwt.sign(user, JWT_KEY, { expiresIn: '24h' });
            return result;
        } catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const result = jwt.verify(token, JWT_KEY);
            return result;
        } catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.log("Something went wrong at service layer");
            throw error;
        }
    }

    async signIn(email, plainPassword) {
        try {
            const user = await this.userRepository.getByEmail(email);

            // user may be null
            if (!user) {
                throw new Error("User not found");
            }

            const passwordMatch = this.checkPassword(plainPassword, user.password);

            if (!passwordMatch) {
                console.log("Password doesn't match");   
                throw new Error("Invalid password");
            }

            const newJWT = this.createToken({ email: user.email, id: user.id });
            return newJWT;
        } catch (error) {
            console.log("Something went wrong in the sign in process");
            throw error;
        }
    }

    async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);
            if (!response) {
                throw new Error('Invalid token');
            }

            const user = await this.userRepository.getById(response.id);

            if (!user) {
                throw new Error('No user with the corresponding token exists');
            }

            return user;
        } catch (error) {
            console.log("Something went wrong in auth process");
            throw error;
        }
    }

    async isAdmin(userId) {
        try {
            return await this.userRepository.isAdmin(userId);
        } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
        }
    }
}

module.exports = UserService;