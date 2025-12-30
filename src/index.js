const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');
const apiRoutes = require('./routes/index');

// const UserRepository = require('./repository/user-repository');
const UserService = require('./services/user-service');

const app = express();

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded ({extended : true}));

    app.use('/api', apiRoutes);

    app.listen(PORT,async () => {
        console.log(`Server started at PORT : ${PORT}`);
        // 1. getById logic

        // const repo = new UserRepository();
        // const response = await repo.getById(7);
        // console.log(response);

        // 2. createToken logic

        // const service = new UserService();
        // const newToken = service.createToken({email : 'jd@admin.com', id : 9});
        // console.log("New token is: ", newToken);

        // 3. verifyToken logic
        
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpkQGFkbWluLmNvbSIsImlkIjo5LCJpYXQiOjE3NjcxMDkxMDMsImV4cCI6MTc2NzE5NTUwM30.nBoMRWXK8JYKd5zMT5pCyVQ15o0DOvYRcRdrTVPmlgY';
        // const response = service.verifyToken(token);
        // console.log(response);
        
    });
}

prepareAndStartServer();
