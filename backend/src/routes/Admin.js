const express = require('express');
const router = express.Router();

const Admincontrolers = require('../app/Controllers/AdminControllers');

router.get("/add_movies", Admincontrolers.Add_Movie);
router.post("/search/cinemas", Admincontrolers.SearchCinemas);
router.post("/search/cinemas-district", Admincontrolers.SearchCinemasBydistrict);

//phan dat ve
//chon rap sau khi chon phim
router.post("/cinemas-movies", Admincontrolers.List_cinemas_by_movie);
//chon thoi gian muon xem phim 
router.post("/Room-showtime", Admincontrolers.Room_showtime);
// chon thoi gian muon xem theo rap mong muon
router.post("/Room-showtime-bycinema", Admincontrolers.Room_showtime_by_cinema);

router.post("/checking-seats", Admincontrolers.Checking_seats);
router.post("/info-seats", Admincontrolers.Checking_info_sticket);
router.post("/booking_seat", Admincontrolers.booking_seat);

router.post("/add/service_one", Admincontrolers.addOneService);
router.post("/add/service_many", Admincontrolers.addManyServices);
router.get("/list-services/combo", Admincontrolers.List_services_combo);
router.get("/list-services", Admincontrolers.List_services);


router.post('/list-schedule', Admincontrolers.list_schedule);
router.post('/add/schedule', Admincontrolers.addSchedule);
router.delete('/delete/schedule', Admincontrolers.deleteSchedule);


router.post("/list-movies", Admincontrolers.ListMovies);
module.exports = router;