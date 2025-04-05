const db = require('./database');
const API_KEY = 'cbfd47f45f5c90c3375631e2bdc142c5';
const BASE_URL = 'https://api.themoviedb.org/3';
const axios = require("axios");

class AdminModel {
  // Hàm lấy dữ liệu phim từ TMDb
  static async fetchMovies() {
    try {
      const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
        params: {
          api_key: API_KEY,
          language: 'vi-VN',
          page: 2,
        },
      });

      const movies = response.data.results;
      for (const movie of movies) {
        const {
          id,
          title,
          overview,
          genre_ids,
          release_date,
          runtime,
          poster_path
        } = movie;

        // Lấy trailer từ API TMDb
        const trailerResponse = await axios.get(`${BASE_URL}/movie/${id}/videos`, {
          params: {
            api_key: API_KEY,
            language: 'vi-VN',
          },
        });
        const trailer = trailerResponse.data.results.length > 0 ? trailerResponse.data.results[0].key : null;

        // Lấy danh sách thể loại (genre) từ TMDb (nếu cần thiết)
        const genres = genre_ids.join(', ');

        const query = `
          INSERT INTO movies (movie_id, movie_name, movie_description, movie_trailer, movie_genres, movie_release, movie_length, movie_poster)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          movie_name = VALUES(movie_name),
          movie_description = VALUES(movie_description),
          movie_trailer = VALUES(movie_trailer),
          movie_genres = VALUES(movie_genres),
          movie_release = VALUES(movie_release),
          movie_length = VALUES(movie_length),
          movie_poster = VALUES(movie_poster)
        `;

        const values = [
          id,
          title,
          overview,
          trailer, // Thêm trailer nếu có
          genres,
          release_date,
          runtime ? `${Math.floor(runtime / 60)}:${runtime % 60}` : null,
          `https://image.tmdb.org/t/p/w500${poster_path}`,
        ];

        await db.query(query, values);
      }

      return { status: 200, message: "Add_success!" }
    } catch (error) {
      return { status: 500, message: "Can't fetch: " + error.message }
    }
  }


  // ve rap chieu phim
  static async GetCinemas(cinema_name) {
    const [cinemas] = await db.query("select * from cinemas where cinema_name like ? ",
      [`%${cinema_name}%`]);
    if (cinemas.length === 0) return { status: 404, message: "Not Found Cinema!" }

    return { status: 200, message: cinemas }
  }

  static async GetCinemasbydistrict(cinema_name, district) {
    const [cinemas] = await db.query("select * from cinemas where cinema_name like ? and district like ? ",
      [`%${cinema_name}%`, `%${district}`]);
    if (cinemas.length === 0) return { status: 404, message: "Not Found Cinema!" }

    return { status: 200, message: cinemas }
  }



  // services
  static async Add_one_service(name, price, description) {
    const [service] = await db.query("insert into services (name,price,description) values (?,?,?)", [name, price, description]);
    return { status: 200, message: "add service success!" }
  }

  static async Add_many_services(services) {
    try {
      const query = services.map(service => {
        const { name, price, description } = service;
        return db.query("insert into services (name,price,description) values (?,?,?)", [name, price, description]);
      })

      await Promise.all(query);
      return {
        status: 200,
        message: "add services successful!"
      }

    } catch (E) {
      return { status: 500, message: " Loi he thong " + E };
    }
  }


  //  schedule lich chieu phim
  static async Add_schedule(schedule) {
    const { movie_id, room_id, schedule_date, schedule_start, schedule_end } = schedule;

    try {
      const [schedule] = await db.query("insert into schedule (movie_id, room_id, schedule_date, schedule_start, schedule_end) values(?,?,?,?,?)",
        [movie_id, room_id, schedule_date, schedule_start, schedule_end]
      );

      return { status: 200, message: "add schedule Success!" }
    } catch (e) {
      return {
        status: 500,
        message: "Error : " + e
      };
    }

  }

  static async Delete_schedule(schedule_id) {
    try {
      const [schedule] = await db.query("select * from schedule where schedule_id=?", [schedule_id])
      if (schedule.length === 0) return { status: 404, message: "not found schedule" }
      await db.query("delete from schedule where schedule_id=?", [schedule_id]);
    } catch (e) {
      return {
        status: 500,
        message: "Error : " + e
      };
    }
  }


  // booking

  // xem tinh trang ve cua rap 
  static async Checking_seats_room(schedule_id, room_id) {
    try {
      const [checking] = await db.query("select  schedule_id, room_id from schedule where schedule_id=? and room_id=? ", [schedule_id, room_id]);
      if (checking.length === 0) return { status: 404, message: " not found schedule" };
      const [seats] = await db.query(`
          SELECT s.seat_id, 
          CONCAT(s.seat_row, s.number) AS seat, 
          IF (b.booking_id IS NOT NULL, 'yes', 'no') AS seat_status 
          FROM seats AS s 
          JOIN room AS r ON s.room_id = r.room_id 
          LEFT JOIN schedule AS sch ON sch.room_id = r.room_id AND sch.schedule_id = ? 
          LEFT JOIN booking AS b ON b.seat_id = s.seat_id AND b.schedule_id = sch.schedule_id 
          WHERE r.room_id = ?;
          `, [schedule_id, room_id]);

      return { status: 200, message: seats };
    } catch (e) {
      return {
        status: 500,
        message: "Error : " + e
      };
    }
  }


  // dat ve xem phim (seat_status : 1 la dat 0 la chua dat)
  static async booking_sticket(info) {
    const { user_id, schedule_id, seat_id, price, seat_status, room_id, services } = info;

    if (!user_id || !schedule_id || !seat_id || !price || !seat_status || !room_id) {
      return { status: 400, message: "All fields must be filled out." };
    }

    // Kiểm tra người dùng
    const [user] = await db.query("SELECT * FROM users WHERE user_id=?", [user_id]);
    if (user.length === 0) return { status: 404, message: "User not found!" };

    // Kiểm tra lịch chiếu
    const [schedule] = await db.query("SELECT * FROM schedule WHERE schedule_id=?", [schedule_id]);
    if (schedule.length === 0) return { status: 404, message: "Schedule not found!" };

    // Kiểm tra tình trạng ghế
    const [checking_seat] = await db.query(`
      SELECT IF (b.booking_id IS NOT NULL, 1, 0) AS seat_status
      FROM seats AS s
      JOIN room AS r ON s.room_id = r.room_id
      LEFT JOIN schedule AS sch ON sch.room_id = r.room_id AND sch.schedule_id = ?
      LEFT JOIN booking AS b ON b.seat_id = s.seat_id AND b.schedule_id = sch.schedule_id
      WHERE r.room_id = ? AND s.seat_id = ?`, [schedule_id, room_id, seat_id]);

    if (checking_seat[0].seat_status === 1) {
      const [waiting_list] = await db.query(`
            SELECT * FROM booking_waiting_list
            WHERE schedule_id = ? AND seat_id = ? AND status = 'waiting'
            ORDER BY created_at ASC`, [schedule_id, seat_id]);

      if (waiting_list.length > 0) {
        return { status: 400, message: "Seat is currently in the waiting list." };
      }

      await db.query(`
            INSERT INTO booking_waiting_list (user_id, schedule_id, seat_id, status)
            VALUES (?, ?, ?, 'waiting')`, [user_id, schedule_id, seat_id]);

      return { status: 200, message: "You have been added to the waiting list." };
    }

    try {
      // Thêm vào bảng booking
      const [book] = await db.query(`
            INSERT INTO booking (user_id, schedule_id, seat_id, price, seat_status)
            VALUES (?, ?, ?, ?, ?)`, [user_id, schedule_id, seat_id, price, seat_status]);

      const booking_id = book.insertId;  // Lấy booking_id vừa thêm vào

      // Thêm các dịch vụ vào bảng booking_services
      if (services && services.length > 0) {
        const serviceQueries = services.map(service => {
          return db.query(`
                    INSERT INTO booking_services (booking_id, service_id, quantity)
                    VALUES (?, ?, ?)`, [booking_id, service.service_id, service.quantity]);
        });

        // Thực thi tất cả các câu lệnh thêm dịch vụ cùng một lúc
        await Promise.all(serviceQueries);
      }

      // Thêm vào danh sách chờ nếu ghế đã có người đặt
      await db.query(`
            INSERT INTO booking_waiting_list (user_id, schedule_id, seat_id, status)
            VALUES (?, ?, ?, 'waiting')`, [user_id, schedule_id, seat_id]);

      return { status: 200, message: "Ticket booked successfully!" };

    } catch (error) {
      return { status: 500, message: "Error booking ticket: " + error.message };
    }
  }





  // xem thong tin ve xem phim sau khi dat 
  static async Check_booking(booking_id, user_id) {
    try {
      const [booking] = await db.query("select * from booking where booking_id", [booking_id]);
      if (booking.length === 0) return { status: 404, message: "Not found sticket!" };
      const [user] = await db.query("select * from users where user_id=?", [user_id]);
      if (user.length === 0) return { status: 404, message: "not found user!" };
      const [sticket] = await db.query(`
        select u.username,CONCAT(s.seat_row, s.number) AS seat,m.movie_name,b.price as sticket_price,(bs.quantity*ser.price) as price_food, 
        (b.price + (bs.quantity*ser.price) ) as totally 
        from booking as b
        JOIN
          users as u on b.user_id=u.user_id
        JOIN
          seats as s on b.seat_id=s.seat_id
        JOIN
          booking_services as bs on bs.booking_id=b.booking_id
        left join
          services as ser on bs.service_id= ser.service_id 
        join 
          schedule as sch on b.schedule_id=sch.schedule_id
        LEFT join 
          movies as m on sch.movie_id = m.movie_id
        where 
          b.booking_id=?  and u.user_id=?
        `, [booking_id, user_id]);

      return { status: 200, message: sticket }



    } catch (e) {
      return {
        status: 500,
        message: "Error check: " + e
      };
    }
  }





}

module.exports = AdminModel;
