const e = require('express');
const AdminModel = require('../model/Adminmodels'); // Kiểm tra lại đường dẫn file model
const mail = require('../modifie/Mail');
class AdminControllers {
    // danh sach phim dua vao limit mac dinh la 5
    async ListMovies(req, res) {
        const { limit } = req.body;
        const movies = await AdminModel.GetListMovies(limit);
        return res.json({ movies });
    }
    // rap chieu phim
    async Add_Movie(req, res) {
        const movie = await AdminModel.fetchMovies();
        return res.json({ movie })
    }

    // rap chieu phim
    async SearchCinemas(req, res) {
        const { cinema_name } = req.body;
        if (!cinema_name) return res.json({ status: 400, message: " missing require" });
        const cinemas = await AdminModel.GetCinemas(cinema_name);
        return res.json({ cinemas });

    }

    async SearchCinemasBydistrict(req, res) {
        const { cinema_name, district } = req.body;
        if (!cinema_name || !district) return res.json({ status: 400, message: " missing require" });
        const cinemas = await AdminModel.GetCinemasbydistrict(cinema_name, district);
        return res.json({ cinemas });

    }
    // dich vu
    // Controller - Add one service
    async addOneService(req, res) {
        const { name, price, description } = req.body;

        try {
            const result = await AdminModel.Add_one_service(name, price, description);
            return res.json({ result });
        } catch (error) {
            return res.status(500).json({ message: "Error: " + error });
        }
    };

    // Controller - Add many services
    async addManyServices(req, res) {
        const { services } = req.body;

        try {
            const result = await AdminModel.Add_many_services(services);
            return res.json({ result });
        } catch (error) {
            return res.status(500).json({ message: "Error: " + error });
        }
    };

    async List_services_combo(req, res) {
        try {
            const services = await AdminModel.List_services_combo();
            return res.json({ services });
        } catch (e) {
            return res.json({ status: 500, message: "error db " + e });
        }
    }
    async List_services(req, res) {
        try {
            const services = await AdminModel.List_services();
            return res.json({ services });
        } catch (e) {
            return res.json({ status: 500, message: "error db " + e });
        }
    }
    // lich chieu phim
    // Controller - Add schedule
    async addSchedule(req, res) {
        const { movie_id, room_id, schedule_date, schedule_start, schedule_end } = req.body;

        try {
            const result = await AdminModel.Add_schedule({ movie_id, room_id, schedule_date, schedule_start, schedule_end });
            return res.json({ result });
        } catch (error) {
            return res.status(500).json({ message: "Error la: " + error });
        }
    };

    // Controller - Delete schedule
    async deleteSchedule(req, res) {
        const { schedule_id } = req.body;

        try {
            const result = await AdminModel.Delete_schedule(schedule_id);
            return res.json({ result });
        } catch (error) {
            return res.status(500).json({ message: "Error: " + error });
        }
    };

    // lich chieu phim
    async list_schedule(req, res) {
        const { schedule_date } = req.body;
        if (!schedule_date) return res.json({ status: 400, message: "Missing require!" });
        const schedules = await AdminModel.List_schedule(schedule_date);
        return res.json({ schedules });
    }




    // booking
    // kiem tra ghe
    async Checking_seats(req, res) {
        const { schedule_id, room_id } = req.body;
        if (!schedule_id || !room_id) return res.json({ status: 400, message: "missing require!" });

        const schedule = await AdminModel.Checking_seats_room(schedule_id, room_id);
        return res.json({ schedule });
    }

    // xem thon tin ve ! phai co thong tin user truoc moi tra ra ve !!!
    async Checking_info_sticket(req, res) {
        const { booking_id, user_id } = req.body;
        if (!booking_id || !user_id) return res.json({ status: 400, message: "missing required!" });

        const sticket = await AdminModel.Check_booking(booking_id, user_id);

        return res.json({ sticket })
    }
    // dat ve
    async booking_seat(req, res) {
        const { info } = req.body;

        const sticket = await AdminModel.booking_sticket(info);

        const seat_ids = await AdminModel.get_name_seat(info.seat_id);

        if (sticket.status == 200) {
            const user_email = info.email;
            const schedule_id = info.schedule_id;
            const seat_id = seat_ids;
            try {
                await mail.sendMail(user_email, schedule_id, seat_id);
                console.log('Email đã gửi thành công');
            } catch (error) {
                console.error('Lỗi gửi email:', error);
            }
        }

        return res.json({ sticket });
    }

}

module.exports = new AdminControllers();
