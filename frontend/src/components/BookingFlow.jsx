import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/Admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

const BookingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinemaBrand, setSelectedCinemaBrand] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [email, setEmail] = useState('');
  
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [seats, setSeats] = useState([]);
  const [services, setServices] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Dữ liệu cố định
  const timeSlots = [
    { start: '08:00', end: '10:00' },
    { start: '10:30', end: '12:30' },
    { start: '13:00', end: '15:00' },
    { start: '15:30', end: '17:30' },
    { start: '18:00', end: '20:00' },
    { start: '20:30', end: '22:30' },
  ];

  const cinemaBrands = [
    { id: 'cgv', name: 'CGV' },
    { id: 'lotte', name: 'Lotte Cinema' },
    { id: 'bhd', name: 'BHD Star Cineplex' },
  ];

  const districts = ['Quận 1', 'Quận 3', 'Quận 7', 'Quận 10'];

  // Lấy danh sách phim
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/list-movies', { limit: 30 });
        if (response.data.movies?.status === 200) {
          setMovies(response.data.movies.message);
        } else {
          throw new Error(response.data.movies?.message || 'Không thể lấy danh sách phim');
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách phim:', err);
        setError(err.message || 'Không thể tải danh sách phim. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Tính giá ghế theo loại
  const calculateSeatPrice = (seatType) => {
    switch(seatType) {
      case 2: return 120000; // VIP
      case 3: return 150000; // Đôi
      default: return 85000; // Thường
    }
  };

  // Chuyển loại ghế thành tên
  const getSeatTypeName = (type) => {
    switch(type) {
      case 2: return 'VIP';
      case 3: return 'Đôi';
      default: return 'Thường';
    }
  };

  // Chọn phim
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setStep(2);
  };

  // Chọn chuỗi rạp
  const handleSelectCinemaBrand = (brand) => {
    setSelectedCinemaBrand(brand);
    setStep(3);
  };

  // Chọn quận và lấy danh sách rạp
  const handleSelectDistrict = async (district) => {
    setSelectedDistrict(district);
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/search/cinemas-district', {
        cinema_name: selectedCinemaBrand.name.toLowerCase(),
        district: district,
      });
      
      if (!response.data?.cinemas || response.data.cinemas.status !== 200) {
        throw new Error(response.data?.cinemas?.message || 'Không thể lấy danh sách rạp');
      }
      
      setCinemas(response.data.cinemas.message);
      setStep(4);
    } catch (err) {
      console.error('Lỗi khi lấy rạp:', err);
      setError(`Lỗi khi lấy rạp: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Chọn rạp
  const handleSelectCinema = (cinema) => {
    setSelectedCinema(cinema);
    setStep(5);
  };

  // Chọn suất chiếu và xử lý ghế ngồi
  const handleSelectTimeSlot = async (timeSlot) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Tạo suất chiếu mới
      const addRes = await api.post('/add/schedule', {
        movie_id: selectedMovie.movie_id,
        room_id: 21, // Sử dụng room_id cố định theo API mẫu
        schedule_date: selectedDate,
        schedule_start: timeSlot.start,
        schedule_end: timeSlot.end
      });

      console.log('Create schedule response:', addRes.data);

      if (!addRes.data?.result || addRes.data.result.status !== 200) {
        throw new Error(addRes.data?.result?.message || 'Tạo suất chiếu không thành công');
      }

      // 2. Sử dụng schedule_id cố định theo API mẫu
      const scheduleId = 47;
      
      // 3. Lấy thông tin ghế ngồi
      const seatsRes = await api.post('/checking-seats', {
        schedule_id: scheduleId,
        room_id: 1 // Sử dụng room_id theo API mẫu
      });

      console.log('Seats API response:', seatsRes.data);

      // 4. Kiểm tra cấu trúc response
      if (!seatsRes.data?.schedule || seatsRes.data.schedule.status !== 200) {
        throw new Error(seatsRes.data?.schedule?.message || 'Dữ liệu ghế không hợp lệ');
      }

      // 5. Xử lý dữ liệu ghế
      const seatsData = seatsRes.data.schedule.message;
      const formattedSeats = seatsData.map(seat => ({
        seat_id: seat.seat_id,
        seat: `${seat.hang}${seat.so}`.toUpperCase(),
        seat_status: seat.seat_status || 'no',
        type: seat.loai,
        price: calculateSeatPrice(seat.loai)
      }));

      // 6. Cập nhật state
      setSeats(formattedSeats);
      setSelectedSchedule({
        schedule_id: scheduleId,
        room_id: 1,
        schedule_date: selectedDate,
        schedule_start: timeSlot.start,
        schedule_end: timeSlot.end
      });

      // 7. Lấy danh sách dịch vụ
      try {
        const servicesRes = await api.get('/list-services/combo');
        setServices(servicesRes.data.services?.message || []);
      } catch (err) {
        console.error('Lỗi khi lấy dịch vụ:', err);
        setServices([]);
      }

      setStep(6);
    } catch (err) {
      console.error('Booking error:', {
        error: err,
        response: err.response?.data
      });
      setError(err.response?.data?.message || err.message || 'Lỗi khi đặt chỗ');
    } finally {
      setLoading(false);
    }
  };

  // Chọn ghế
  const handleSelectSeat = (seat) => {
    setSelectedSeats(prev => {
      const existingIndex = prev.findIndex(s => s.seat_id === seat.seat_id);
      if (existingIndex >= 0) {
        return prev.filter(s => s.seat_id !== seat.seat_id);
      } else {
        return [...prev, seat];
      }
    });
  };

  // Chọn dịch vụ
  const handleSelectService = (service, action) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.service_id === service.service_id);
      
      if (action === 'increase') {
        return existing
          ? prev.map(s => 
              s.service_id === service.service_id 
                ? { ...s, quantity: (s.quantity || 0) + 1 } 
                : s
            )
          : [...prev, { ...service, quantity: 1 }];
      } else {
        return existing?.quantity > 1
          ? prev.map(s => 
              s.service_id === service.service_id 
                ? { ...s, quantity: s.quantity - 1 } 
                : s
            )
          : prev.filter(s => s.service_id !== service.service_id);
      }
    });
  };

  // Xác nhận đặt vé
  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Vui lòng chọn ít nhất một ghế');
      return;
    }

    if (!email) {
      setError('Vui lòng nhập email để nhận vé');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Tạo mảng dịch vụ theo định dạng API yêu cầu
      const formattedServices = selectedServices.map(service => ({
        service_id: service.service_id,
        quantity: service.quantity || 1
      }));

      // Gọi API cho từng ghế đã chọn
      const bookingPromises = selectedSeats.map(seat => 
        api.post('/booking_seat', {
          info: {
            user_id: 1, // Có thể thay bằng user_id thực tế từ auth
            schedule_id: selectedSchedule.schedule_id,
            seat_id: seat.seat_id,
            price: seat.price,
            seat_status: 1,
            room_id: selectedSchedule.room_id,
            services: formattedServices,
            email: email
          }
        })
      );

      // Chờ tất cả các request hoàn thành
      const results = await Promise.all(bookingPromises);

      // Kiểm tra kết quả
      const failedBookings = results.filter(
        res => !res.data?.ticket || res.data.ticket.status !== 200
      );

      if (failedBookings.length > 0) {
        const errorMessages = failedBookings.map(
          res => res.data?.ticket?.message || 'Lỗi không xác định'
        );
        throw new Error(`Đặt ghế không thành công: ${errorMessages.join(', ')}`);
      }

      // Nếu thành công, chuyển đến trang thanh toán
      navigate('/payment', {
        state: { 
          movie: selectedMovie,
          cinema: selectedCinema,
          schedule: selectedSchedule,
          seats: selectedSeats,
          services: selectedServices,
          total: calculateTotal(),
          bookingResults: results.map(res => res.data.ticket.message),
          email: email
        }
      });

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.ticket?.message || err.message || 'Lỗi khi đặt ghế');
      
      // Nếu ghế đang trong danh sách chờ, cập nhật trạng thái ghế
      if (err.response?.data?.ticket?.message?.includes('waiting list')) {
        setSeats(prevSeats => 
          prevSeats.map(seat => 
            selectedSeats.some(s => s.seat_id === seat.seat_id)
              ? { ...seat, seat_status: 'waiting' }
              : seat
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Render ghế ngồi
  const renderSeats = () => {
    if (loading) return <div className="text-center py-4">Đang tải thông tin ghế...</div>;
    if (!seats.length) return <div className="text-center py-4 text-red-500">Không có ghế nào để hiển thị</div>;

    const seatsByRow = seats.reduce((acc, seat) => {
      const row = seat.seat[0];
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {});

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-4 bg-gray-200 font-bold mb-4">MÀN HÌNH</div>
        
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center mb-4">
            <div className="w-8 font-bold text-center">{row}</div>
            <div className="flex flex-wrap gap-2">
              {rowSeats.map(seat => {
                const isSelected = selectedSeats.some(s => s.seat_id === seat.seat_id);
                const isBooked = seat.seat_status === 'yes';
                const isWaiting = seat.seat_status === 'waiting';
                
                let seatClass = '';
                if (isBooked) {
                  seatClass = 'bg-red-300 cursor-not-allowed';
                } else if (isWaiting) {
                  seatClass = 'bg-yellow-300 cursor-not-allowed';
                } else if (isSelected) {
                  seatClass = 'bg-blue-500 text-white';
                } else {
                  seatClass = seat.type === 2 ? 'bg-purple-200 hover:bg-purple-300' 
                            : seat.type === 3 ? 'bg-pink-200 hover:bg-pink-300' 
                            : 'bg-gray-200 hover:bg-gray-300';
                }

                const seatTitle = isWaiting 
                  ? `Ghế ${seat.seat} - Đang trong danh sách chờ`
                  : `Ghế ${seat.seat} - ${getSeatTypeName(seat.type)} - ${seat.price.toLocaleString()} VNĐ`;

                return (
                  <button
                    key={seat.seat_id}
                    className={`w-10 h-10 rounded flex items-center justify-center ${seatClass} transition-colors`}
                    onClick={() => !isBooked && !isWaiting && handleSelectSeat(seat)}
                    disabled={isBooked || isWaiting}
                    title={seatTitle}
                  >
                    {seat.seat.substring(1)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-200 mr-2"></div>
            <span className="text-sm">Thường</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-purple-200 mr-2"></div>
            <span className="text-sm">VIP</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-pink-200 mr-2"></div>
            <span className="text-sm">Đôi</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-300 mr-2"></div>
            <span className="text-sm">Đã đặt</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 mr-2"></div>
            <span className="text-sm">Đang chọn</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-yellow-300 mr-2"></div>
            <span className="text-sm">Đang chờ</span>
          </div>
        </div>
      </div>
    );
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const servicesTotal = selectedServices.reduce((sum, s) => sum + (s.price * (s.quantity || 0)), 0);
    return seatsTotal + servicesTotal;
  };

  // Render UI
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Thanh tiến trình */}
      <div className="flex mb-8">
        {[1, 2, 3, 4, 5, 6].map(stepNum => (
          <div key={stepNum} className={`flex-1 text-center border-b-2 ${step >= stepNum ? 'border-blue-500' : 'border-gray-300'}`}>
            <div className={`inline-block rounded-full w-8 h-8 ${step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {stepNum}
            </div>
            <p className="mt-2 text-sm">
              {['Chọn phim', 'Chọn rạp', 'Chọn quận', 'Chọn rạp', 'Chọn suất', 'Chọn ghế'][stepNum - 1]}
            </p>
          </div>
        ))}
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              if (step === 6) setStep(5); // Quay lại bước chọn suất chiếu nếu đang ở bước chọn ghế
            }} 
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-4"></div>
              <div>
                <h3 className="font-bold">Đang xử lý</h3>
                <p className="text-sm text-gray-600">
                  {step === 5 ? 'Đang tạo suất chiếu...' : 'Đang đặt vé...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Bước 1: Chọn phim */}
          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {movies.map(movie => (
                <div 
                  key={movie.movie_id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md
                    ${selectedMovie?.movie_id === movie.movie_id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleSelectMovie(movie)}
                >
                  <img 
                    src={movie.movie_poster || 'https://via.placeholder.com/300x450'} 
                    alt={movie.movie_name}
                    className="w-full h-64 object-cover"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x450'}
                  />
                  <div className="p-3">
                    <h3 className="font-bold truncate">{movie.movie_name}</h3>
                    <p className="text-sm text-gray-600">{movie.movie_genres}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bước 2: Chọn chuỗi rạp */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Chọn chuỗi rạp chiếu</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cinemaBrands.map(brand => (
                  <div
                    key={brand.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                      ${selectedCinemaBrand?.id === brand.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                    onClick={() => handleSelectCinemaBrand(brand)}
                  >
                    <h3 className="font-bold">{brand.name}</h3>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={() => setStep(1)} variant="outline">
                  ← Quay lại
                </Button>
              </div>
            </div>
          )}

          {/* Bước 3: Chọn quận */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Chọn quận - {selectedCinemaBrand.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {districts.map(district => (
                  <div
                    key={district}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                      ${selectedDistrict === district ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                    onClick={() => handleSelectDistrict(district)}
                  >
                    <h3 className="font-bold">{district}</h3>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={() => setStep(2)} variant="outline">
                  ← Quay lại
                </Button>
              </div>
            </div>
          )}

          {/* Bước 4: Chọn rạp cụ thể */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Chọn rạp - {selectedDistrict}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cinemas.map(cinema => (
                  <div
                    key={cinema.cinema_id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                      ${selectedCinema?.cinema_id === cinema.cinema_id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                    onClick={() => handleSelectCinema(cinema)}
                  >
                    <h3 className="font-bold">{cinema.cinema_name}</h3>
                    <p className="text-sm text-gray-600">{cinema.cinema_address}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={() => setStep(3)} variant="outline">
                  ← Quay lại
                </Button>
              </div>
            </div>
          )}

          {/* Bước 5: Chọn suất chiếu */}
          {step === 5 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">Chọn suất chiếu</h2>
                  <p className="text-sm text-gray-600">
                    {selectedMovie.movie_name} - {selectedCinema.cinema_name}
                  </p>
                </div>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-3 py-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {timeSlots.map((timeSlot, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleSelectTimeSlot(timeSlot)}
                  >
                    <p className="font-bold">{timeSlot.start} - {timeSlot.end}</p>
                    <p className="text-blue-500 font-bold">85,000 VNĐ</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button onClick={() => setStep(4)} variant="outline">
                  ← Quay lại
                </Button>
              </div>
            </div>
          )}

          {/* Bước 6: Chọn ghế */}
          {step === 6 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h2 className="text-xl font-bold">{selectedMovie.movie_name}</h2>
                  <p className="text-gray-600">
                    {selectedCinema.cinema_name} • {selectedDate} • {selectedSchedule.schedule_start}
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="font-semibold">Tổng: <span className="text-red-500">
                    {calculateTotal().toLocaleString()} VNĐ
                  </span></p>
                  <p className="text-sm">Số ghế: {selectedSeats.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {renderSeats()}
                  
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Ghế đã chọn:</h3>
                    {selectedSeats.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                          <span key={seat.seat_id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            {seat.seat} - {getSeatTypeName(seat.type)} ({seat.price.toLocaleString()} VNĐ)
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Chưa có ghế nào được chọn</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg mb-4">Combo bắp nước</h3>
                  {services.length > 0 ? (
                    services.map(service => (
                      <div key={service.service_id} className="border-b py-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.price.toLocaleString()} VNĐ</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleSelectService(service, 'decrease')}
                              className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200"
                              disabled={!selectedServices.find(s => s.service_id === service.service_id)?.quantity}
                            >
                              -
                            </button>
                            <span className="w-6 text-center">
                              {selectedServices.find(s => s.service_id === service.service_id)?.quantity || 0}
                            </span>
                            <button 
                              onClick={() => handleSelectService(service, 'increase')}
                              className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có dịch vụ nào</p>
                  )}
                  
                  {selectedServices.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Dịch vụ đã chọn:</h4>
                      <ul className="space-y-2">
                        {selectedServices.map(service => (
                          <li key={service.service_id} className="flex justify-between">
                            <span>{service.name} x{service.quantity}</span>
                            <span>{(service.price * service.quantity).toLocaleString()} VNĐ</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email nhận vé</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Nhập email của bạn"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Vé điện tử sẽ được gửi đến email này</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button onClick={() => setStep(5)} variant="outline">
                  ← Quay lại
                </Button>
                <Button 
                  onClick={handleConfirmBooking}
                  disabled={selectedSeats.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingFlow;