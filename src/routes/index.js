const express = require('express');
const newAdmin = require('./Admin');
const newUser = require('./user');
const newEmployee = require('./Employee');
function route(app) {
    app.use('/user', newUser);
    app.use('/Admin', newAdmin);
    app.use('/Admin/employee', newEmployee);
    app.get('/', (req, res) => res.send("hello"));


}
module.exports = route;