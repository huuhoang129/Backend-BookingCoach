// src/ultis/vnpay.utils.js
/**
 * Sắp xếp key của object theo thứ tự bảng chữ cái
 * và encode dữ liệu để phù hợp khi tạo query string
 */
export function sortObject(obj) {
  const sorted = {};
  const keys = [];

  // Lấy danh sách key hợp lệ
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(encodeURIComponent(key));
    }
  }

  // Sắp xếp key theo ABC
  keys.sort();

  // Gán lại vào object mới theo thứ tự đã sắp xếp
  for (let i = 0; i < keys.length; i++) {
    sorted[keys[i]] = encodeURIComponent(obj[keys[i]]).replace(/%20/g, "+");
  }

  return sorted;
}
