const express = require('express');
const newAdmin = require('./Admin');
const newUser = require('./user');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/xemphim.yaml');
function route(app) {
    app.use('/user', newUser);
    app.use('/Admin', newAdmin);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.get('/', (req, res) => res.send("hello"));


}
module.exports = route;