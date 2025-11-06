// src/utils/seatGenerator.js
export const generateSeats = (vehicleId, type) => {
  const seats = [];

  switch (type) {
    case "Limousine":
      for (let i = 1; i <= 9; i++) {
        seats.push({
          vehicleId,
          floor: 1,
          name: `Ghế L${i} - Tầng 1`,
        });
      }
      break;

    case "Normal":
      for (let i = 1; i <= 45; i++) {
        seats.push({
          vehicleId,
          floor: 1,
          name: `Ghế N${i} - Tầng 1`,
        });
      }
      break;

    case "Sleeper":
      // 36 ghế: 18 tầng 1 (1–18) + 18 tầng 2 (19–36)
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
      // 22 ghế: 11 tầng 1 (1–11) + 11 tầng 2 (12–22)
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
      console.warn(`⚠️ Loại xe không xác định: ${type}`);
      break;
  }

  return seats;
};
