// src/utils/seatGenerator.js

// Ánh xạ type từ FE (uppercase) sang type dùng nội bộ
const TYPE_MAP = {
  NORMAL: "Normal",
  SLEEPER: "Sleeper",
  DOUBLESLEEPER: "DoubleSleeper",
  LIMOUSINE: "Limousine",
};

export const generateSeats = (vehicleId, type) => {
  const seats = [];

  // Chuẩn hóa loại xe nhận từ FE
  const mappedType = TYPE_MAP[type] || type;

  switch (mappedType) {
    case "Limousine":
      // 9 ghế limousine tầng 1
      for (let i = 1; i <= 9; i++) {
        seats.push({
          vehicleId,
          floor: 1,
          name: `Ghế L${i} - Tầng 1`,
        });
      }
      break;

    case "Normal":
      // 45 ghế ngồi tầng 1
      for (let i = 1; i <= 45; i++) {
        seats.push({
          vehicleId,
          floor: 1,
          name: `Ghế N${i} - Tầng 1`,
        });
      }
      break;

    case "Sleeper":
      // Giường đơn: 36 ghế (18 tầng 1 + 18 tầng 2)
      for (let i = 1; i <= 18; i++) {
        seats.push({
          vehicleId,
          floor: 1,
          name: `Ghế S${i} - Tầng 1`,
        });
      }
      for (let i = 19; i <= 36; i++) {
        seats.push({
          vehicleId,
          floor: 2,
          name: `Ghế S${i} - Tầng 2`,
        });
      }
      break;

    case "DoubleSleeper":
      // Giường đôi: 22 ghế (11 tầng 1 + 11 tầng 2)
      for (let i = 1; i <= 11; i++) {
        seats.push({
          vehicleId,
          floor: 1,
          name: `Ghế DS${i} - Tầng 1`,
        });
      }
      for (let i = 12; i <= 22; i++) {
        seats.push({
          vehicleId,
          floor: 2,
          name: `Ghế DS${i} - Tầng 2`,
        });
      }
      break;

    default:
      // Loại xe không hợp lệ hoặc chưa hỗ trợ
      console.warn(`Loại xe không xác định khi tạo ghế: ${mappedType}`);
      break;
  }

  return seats;
};
