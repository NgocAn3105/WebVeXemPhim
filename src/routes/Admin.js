const express = require('express');
const router = express.Router();

const Admincontrolers = require('../app/Controllers/AdminControllers');

router.get("/add_movies", Admincontrolers.Add_Movie);
router.post("/search/cinemas", Admincontrolers.SearchCinemas);
router.post("/search/cinemas-district", Admincontrolers.SearchCinemasBydistrict);

router.post("/checking-seats", Admincontrolers.Checking_seats);
router.post("/info-seats", Admincontrolers.Checking_info_sticket);
router.post("/booking_seat", Admincontrolers.booking_seat);

router.post("/add/service_one", Admincontrolers.addOneService);
router.post("/add/service_many", Admincontrolers.addManyServices);
router.post('/add/schedule', Admincontrolers.addSchedule);
router.delete('/delete/schedule', Admincontrolers.deleteSchedule);

module.exports = router;