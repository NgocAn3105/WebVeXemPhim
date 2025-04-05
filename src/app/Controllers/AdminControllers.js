const e = require('express');
const AdminModel = require('../model/Adminmodels'); // Kiểm tra lại đường dẫn file model
const mail = require('../modifie/Mail');
class AdminControllers {

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
            const result = await ServiceModel.Add_one_service(name, price, description);
            return res.status(result.status).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ message: "Error: " + error });
        }
    };

    // Controller - Add many services
    async addManyServices(req, res) {
        const services = req.body.services;

        try {
            const result = await ServiceModel.Add_many_services(services);
            return res.status(result.status).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ message: "Error: " + error });
        }
    };


    // lich chieu phim
    // Controller - Add schedule
    async addSchedule(req, res) {
        const { movie_id, room_id, schedule_date, schedule_start, schedule_end } = req.body;

        try {
            const result = await ScheduleModel.Add_schedule({ movie_id, room_id, schedule_date, schedule_start, schedule_end });
            return res.status(result.status).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ message: "Error: " + error });
        }
    };

    // Controller - Delete schedule
    async deleteSchedule(req, res) {
        const { schedule_id } = req.body;

        try {
            const result = await ScheduleModel.Delete_schedule(schedule_id);
            return res.status(result.status).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ message: "Error: " + error });
        }
    };





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

        if (sticket.status == 200) {
            const user_email = info.email;
            const schedule_id = info.schedule_id;
            const seat_id = info.seat_id;
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
