const { sign } = require('jsonwebtoken');
const UserService = require('../services/user-service');  // 👈 FIXED!

const userService = new UserService();

const create = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);
        const user = await userService.create({
            email: req.body.email,
            password: req.body.password
        });

        return res.status(201).json({
            data: user,
            success: true,
            message: 'Successfully created a user',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: 'Unable to create a user',
            success: false,
            err: error
        });
    }
}

const destroy = async (req, res) => {
    try {
        const response = await userService.destroy(req.params.id);
        return res.status(200).json({
            data: response,
            success: true,
            message: 'Successfully deleted the user',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: 'Unable to delete the user',
            success: false,
            err: error
        });
    }
}

const signIn = async (req, res) => {
    try {
        const response = await userService.signIn(req.body.email, req.body.password);
        return res.status(201).json({
            data : response,
            success : true,
            message : 'Succesfully signed in',
            err : {}
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: 'Something went wrong',
            success: false,
            err: error
        });
    }
}

const isAuthenticated =async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthenticated(token);
        return res.status(201).json({
            data : response,
            success : true,
            message : 'User is authenticated and token is valid',
            err : {}
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: 'Something went wrong',
            success: false,
            err: error
        });
    }
}

module.exports = {
    create,
    destroy,
    signIn,
    isAuthenticated
}
