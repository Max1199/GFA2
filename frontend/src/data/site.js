export const CONTACT = {
  brand: "GFA Việt Nam",
  legalName: "Công ty TNHH GFA Việt Nam",
  taxCode: "", // TODO: bổ sung mã số thuế
  hotline: "0916 269 919",
  hotlineTel: "+84916269919",
  phone2: "0919 191 996",
  phone2Tel: "+84919191996",
  landline: "024 3755 6677",
  landlineTel: "+842437556677",
  email: "info.gfavietnam@gmail.com",
  email2: "datxe.gfavietnam@gmail.com",
  zalo: "https://zalo.me/0916919919",
  facebook: "https://www.facebook.com/GFAVietnam.Company/",
  messenger: "https://www.facebook.com/messages/t/GFAVietnam.Company/",
  website: "https://gfavietnam.com.vn/",
  hours: "Thứ 2 – Chủ nhật: 8:00 – 17:00 · Xe phục vụ 24/7 theo lịch đặt",
  addresses: [
    { label: "Trụ sở — Khu E", value: "Ô số E20 Khu E, khu đấu giá quyền sử dụng đất, khu đất 3ha, P. Phú Diễn, TP. Hà Nội" },
    { label: "Chi nhánh — Khu B", value: "Ô số B38 Khu B, khu đấu giá quyền sử dụng đất, khu đất 3ha, P. Phú Diễn, TP. Hà Nội" },
  ],
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14894.3146215451!2d105.7532948!3d21.0495386!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454e8cf2681b3%3A0x72e90d2d8f427ead!2sC%C3%B4ng%20Ty%20TNHH%20GFA%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1726729297404!5m2!1svi!2s",
  mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJs4Emz-hUNDERrX5Cjy0N6XI",
  rating: 4.7,
  reviewCount: 6,
};

export const directionsUrl = (address) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address + ", Hà Nội, Việt Nam")}`;

export const zaloWith = (msg) => `${CONTACT.zalo}?text=${encodeURIComponent(msg)}`;

export const SERVICES = [
  { id: "dai-han", title: "Thuê xe dài hạn", desc: "Hợp đồng thuê xe theo tháng hoặc theo năm cho doanh nghiệp, cá nhân và hộ gia đình. Xe + tài xế riêng, xe thay thế khi bảo dưỡng, hoá đơn VAT đầy đủ.", tag: "Doanh nghiệp", big: true },
  { id: "cong-vu", title: "Ngoại tỉnh & xe công vụ", desc: "Xe đưa đón cán bộ, chuyên gia, ban lãnh đạo và các chuyến công tác liên tỉnh. Sedan hạng sang, SUV 7 chỗ, tài xế lịch sự đúng giờ.", tag: "Doanh nghiệp", big: true },
  { id: "san-bay", title: "Xe sân bay", desc: "Đưa đón sân bay Nội Bài theo lịch trình của khách, đặt lịch trước qua hotline hoặc Zalo.", tag: "24/7" },
  { id: "cuoi-hoi", title: "Xe cưới hỏi", desc: "Xe phục vụ đám cưới, rước dâu tại Hà Nội và các tỉnh lân cận.", tag: "Cá nhân" },
  { id: "du-lich", title: "Du lịch & lễ hội", desc: "Xe phục vụ các chuyến du lịch, lễ hội theo đoàn hoặc theo gia đình, từ 4 đến 45 chỗ.", tag: "Đoàn" },
  { id: "tu-lai", title: "Xe tự lái & thuê tài xế", desc: "Lựa chọn tự lái hoặc thuê xe kèm tài xế theo nhu cầu sử dụng.", tag: "Linh hoạt" },
];

export const FLEET_BRANDS = ["Toyota", "Honda", "Ford", "Hyundai", "Mercedes", "BMW", "Lexus", "Nissan", "Mitsubishi", "Daewoo", "Porsche", "Jaguar"];

export const FLEET = [
  { id: "camry", seats: "4 chỗ", name: "Toyota Camry", models: "Sedan hạng sang", use: "Đón khách công tác, sự kiện, xe công vụ", image: "/assets/fleet-camry.jpg" },
  { id: "fortuner", seats: "7 chỗ", name: "Toyota Fortuner", models: "SUV 7 chỗ", use: "Gia đình, di chuyển đường dài", image: "/assets/fleet-fortuner.jpg" },
  { id: "innova", seats: "7 chỗ", name: "Toyota Innova", models: "MPV 7 chỗ", use: "Đoàn khách, du lịch nhóm", image: "/assets/fleet-innova.jpg" },
];

// TODO: thay bằng ảnh độ phân giải cao hơn (ảnh hiện tại 340×190px)
export const GALLERY = [
  { src: "/assets/facility-building.jpg", alt: "Toà nhà GFA Building", position: "center 78%" },
  { src: "/assets/facility-meeting.jpg", alt: "Phòng họp" },
  { src: "/assets/facility-lounge.jpg", alt: "Không gian tiếp khách" },
  { src: "/assets/facility-reception.jpg", alt: "Khu vực văn phòng" },
];

// TODO: thay bằng logo thật (PNG/SVG) của khách hàng doanh nghiệp
export const CLIENTS = [
  "Delta Logistics", "Nova Tech", "Hanoi Grand Hotel", "VN Capital Bank",
  "Sakura Electronics", "Thăng Long Group", "Global FDI Park", "Sunrise Pharma",
];

// TODO: thay bằng đánh giá thật từ Google Maps
export const REVIEWS = [
  { name: "Nguyễn Minh Tuấn", role: "Trưởng phòng Hành chính", text: "Công ty mình ký hợp đồng thuê 3 xe dài hạn với GFA đã hơn 4 năm. Tài xế luôn đúng giờ, xe sạch, có xe thay ngay khi bảo dưỡng. Rất yên tâm.", stars: 5, time: "2 tháng trước" },
  { name: "Trần Thu Hà", role: "Điều phối nhân sự", text: "Đón chuyên gia Nhật tại Nội Bài lúc 1h sáng, tài xế chờ sẵn, cầm bảng tên, hỗ trợ hành lý chu đáo. Đối tác khen rất nhiều.", stars: 5, time: "1 tháng trước" },
  { name: "Lê Hoàng Long", role: "Khách cưới hỏi", text: "Thuê xe hoa + 2 xe 16 chỗ đưa đón họ hàng. Giá rõ ràng, không phát sinh, trang trí xe đẹp. Cảm ơn GFA!", stars: 5, time: "3 tuần trước" },
  { name: "Phạm Quốc Việt", role: "Quản lý nhà máy", text: "Tuyến đưa đón công nhân 45 chỗ chạy ổn định 2 năm, hầu như không trễ. Báo giá nhanh, hoá đơn VAT đầy đủ.", stars: 4, time: "1 tuần trước" },
];

export const SERVICE_OPTIONS = SERVICES.map((s) => s.title);
