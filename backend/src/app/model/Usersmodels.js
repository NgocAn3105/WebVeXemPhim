const e = require('express');
const db = require('./database')

class UsersModel {
    static async SiginModel(username, password, birthday, email) {
        const [user] = await db.query("select email from users where email=?", [email]);
        if (user.length > 0)
            return { status: 400, message: "Email was used!" };

        await db.query("INSERT into users (username,password,birthday,email) VALUES (?,?,?,?) ", [username, password, birthday, email]);
        return { status: 200, message: "Signin Success!" }
    }

    static async LoginModel(email, password) {
        const [user] = await db.query("select email from users where email=? and password=?", [email, password]);
        if (user.length > 0)
            return { status: 200, message: "Login success" };
        return { status: 404, message: "Not Found Users!" };
    }

    static async UpdateUserModel(username, fullname, birthday, gender, city, phone, email) {
        const [user] = await db.query("select email from users where email=?", [email]);
        if (user.length === 0)
            return { status: 404, message: "Not Found Users!" };

        await db.query("update users set username=?,fullname=?,birthday=?,gender=?,city=?,phone=? where email=?",
            [username || null, fullname || null, birthday, gender || null, city || null, phone || null, email]
        );
        return { status: 200, message: "Update Successful!" };
    }


    static async UpdatePasswordUserModel(email, password) {
        const [user] = await db.query("select email from users where email=?", [email]);
        if (user.length === 0)
            return { status: 404, message: "Not Found Users!" };
        await db.query("update users set password=? where email=?", [password, email]);

        return { status: 200, message: "Update Successful!" };
    }

    static async InfoUser(email) {
        try {
            const [user] = await db.query("select * from users where email = ? ", [email]);
            return { status: 200, message: user }
        } catch (E) {
            return { status: 500, message: "Error db " + E };
        }
    }

}
module.exports = UsersModel