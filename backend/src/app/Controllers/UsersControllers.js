const { response } = require('express');
const usersModel = require('../model/Usersmodels');
const sendMail = require("../modifie/Mail");
const e = require('express');
const UsersModel = require('../model/Usersmodels');
class UsersControllers {
    async Signin(req, res) {
        const { username, password, birthday, email } = req.body;
        if (!username || !password || !email || !birthday)
            return res.json({ status: 400, message: "Missing require!" });

        const user = await usersModel.SiginModel(username, password, birthday, email);
        return res.json({ user });
    }

    async Login(req, res) {
        const { email, password } = req.body;
        if (!email || !password)
            return res.json({ status: 400, message: "Missing require!" });
        const user = await usersModel.LoginModel(email, password);
        return res.json({ user });
    }

    async Update_user(req, res) {
        const { username, fullname, birthday, gender, city, phone } = req.body;
        const { email } = req.params;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = await usersModel.UpdateUserModel(username, fullname, birthday, gender, city, phone, email);
        return res.json({ user });
    }

    async Update_password_user(req, res) {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email is required" });
        const user = await usersModel.UpdatePasswordUserModel(email, password);
        return res.json({ user });
    }


    async Info_user(req, res) {
        const { email } = req.body;
        if (!email) return res.json({ status: 400, message: "Missing require !" });

        const user = await UsersModel.InfoUser(email);
        return res.json({ user });
    }


}

module.exports = new UsersControllers