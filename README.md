# 🎬 Capstone Movie Booking API

## 🧩 Overview
This is a **Cinema Movie Booking System API** built with **NestJS**, **Prisma ORM**, and **MySQL**. It supports full CRUD, soft delete, restore, authentication with JWT, role & permission management, and a payment gateway simulation for online movie ticket booking. The project follows clean modular architecture for scalability and reusability.

---

## ⚙️ Tech Stack
| Category | Technologies |
|-----------|---------------|
| Backend Framework | **NestJS v11** |
| ORM | **Prisma v6** |
| Database | **MySQL** (via Docker) |
| Authentication | **JWT (Access & Refresh Token)** |
| Image Storage | **Cloudinary** |
| Validation | **class-validator + class-transformer** |
| API Docs | **Swagger (OpenAPI 3)** |

---

## 🗂️ Project Structure
```
src/
┣ common/
┃ ┣ cloudinary/
┃ ┣ constant/
┃ ┣ decorators/
┃ ┣ guard/
┃ ┣ helpers/
┃ ┣ interceptors/
┃ ┗ jobs/
┣ modules/
┃ ┣ modules-api/
┃ ┃ ┣ auth/
┃ ┃ ┣ user/
┃ ┃ ┣ role/
┃ ┃ ┣ permission/
┃ ┃ ┣ cinema/
┃ ┃ ┣ cinema-brand/
┃ ┃ ┣ cinema-area/
┃ ┃ ┣ room/
┃ ┃ ┣ screen-tech/
┃ ┃ ┣ sound-system/
┃ ┃ ┣ seat/
┃ ┃ ┣ seat-type/
┃ ┃ ┣ movie/
┃ ┃ ┣ movie-genre/
┃ ┃ ┣ movie-format/
┃ ┃ ┣ age-limit/
┃ ┃ ┣ showtime/
┃ ┃ ┣ booking/
┃ ┃ ┗ payment/
┃ ┗ modules-system/
┃ ┣ prisma/
┃ ┗ token/
```

---

## 🧠 System Modules
| Module | Description |
|--------|--------------|
| **Auth** | User authentication & token management |
| **User** | Manage user profiles, avatars, and password |
| **Role & Permission** | Role-based Access Control (RBAC) |
| **Cinema** | Manage cinema systems, brands, and areas |
| **Room** | Manage screening rooms and their configurations |
| **ScreenTech** | Define screen technologies (IMAX, 4DX, etc.) |
| **SoundSystem** | Define sound technologies (Dolby, DTS, etc.) |
| **Seat & SeatType** | Manage seat layout and pricing multipliers |
| **Movie** | Manage movies and their metadata |
| **MovieFormat / Genre / AgeLimit** | Define movie categories and classifications |
| **Showtime** | Schedule movie showtimes and auto-calculate basePrice |
| **Booking** | Reserve and manage ticket bookings |
| **Payment** | Simulate payment process with callback confirmation |

---

## 🧾 Install dependencies
```bash
npm install
```

---

## ⚙️ Environment Variables
Create a `.env` file in the root folder:
```bash
PORT=3069
DATABASE_URL=mysql://root:1234@localhost:3305/db_capstone_nestjs_movieAPI

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=1d

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
---

## 🐳 Docker Setup (MySQL)
```bash
docker run -d --name capstone-nestjs-mysql -e MYSQL_ROOT_PASSWORD=1234 -p 3305:3306 mysql
```

---

## 🔧 Prisma Commands
Generate Prisma Client:
```bash
npm run prisma
```

Run migrations:
```bash
npx prisma migrate dev
```

---

## 🚀 Start Server
Development:
```bash
npm run start:dev
```

Production:
```bash
npm run build
npm run start:prod
```

---

## 🧭 Access Swagger Docs

http://localhost:3069/api/docs

---

## 🧱 Main API Modules (Total: 109 APIs)

### 🔐 Auth (4 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Login to system |
| POST | `/api/auth/refresh-token` | Refresh token |
| GET | `/api/auth/get-info` | Get user info from token payload |

### 👤 User (8 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/user/change-password` | Change user password |
| PUT | `/api/user/update` | Update user profile |
| DELETE | `/api/user/delete` | Soft delete user |
| POST | `/api/user/restore` | Restore deleted user |
| POST | `/api/user/avatar` | Upload user avatar |
| DELETE | `/api/user/avatar` | Delete user avatar |
| GET | `/api/user` | Get all users (pagination + search) |
| GET | `/api/user/{userId}` | Get user detail by ID |

### 🧱 Role (7 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/role` | Create role |
| GET | `/api/role` | Get all roles |
| GET | `/api/role/{id}` | Get role by ID |
| PUT | `/api/role/{id}` | Update role |
| DELETE | `/api/role/{id}` | Soft delete role |
| POST | `/api/role/{id}/restore` | Restore role |
| POST | `/api/role/assign-permissions` | Assign permissions to role |

### 🔒 Permission (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/permission` | Create permission |
| GET | `/api/permission` | Get all permissions |
| GET | `/api/permission/{id}` | Get permission detail |
| PUT | `/api/permission/{id}` | Update permission |
| DELETE | `/api/permission/{id}` | Soft delete permission |
| POST | `/api/permission/{id}/restore` | Restore permission |

### 🎦 Cinema (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/cinema` | Create cinema |
| GET | `/api/cinema` | Get all cinemas |
| GET | `/api/cinema/{id}` | Get cinema by ID |
| PUT | `/api/cinema/{id}` | Update cinema |
| DELETE | `/api/cinema/{id}` | Soft delete cinema |
| POST | `/api/cinema/{id}/restore` | Restore cinema |

### 🏢 Cinema Brand (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/cinema-brands` | Create cinema brand |
| GET | `/api/cinema-brands` | Get all cinema brands |
| GET | `/api/cinema-brands/{id}` | Get cinema brand detail |
| PUT | `/api/cinema-brands/{id}` | Update cinema brand |
| DELETE | `/api/cinema-brands/{id}` | Soft delete cinema brand |
| POST | `/api/cinema-brands/{id}/restore` | Restore cinema brand |

### 🌐 Cinema Area (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/cinema-areas` | Create cinema area |
| GET | `/api/cinema-areas` | Get all cinema areas |
| GET | `/api/cinema-areas/{id}` | Get cinema area detail |
| PUT | `/api/cinema-areas/{id}` | Update cinema area |
| DELETE | `/api/cinema-areas/{id}` | Soft delete cinema area |
| POST | `/api/cinema-areas/{id}/restore` | Restore cinema area |

### 🏠 Room (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/room` | Create room |
| GET | `/api/room` | Get all rooms |
| GET | `/api/room/{id}` | Get room detail |
| PUT | `/api/room/{id}` | Update room |
| DELETE | `/api/room/{id}` | Soft delete room |
| POST | `/api/room/{id}/restore` | Restore room |

### 💡 Screen Technology (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/screen-tech` | Create screen technology |
| GET | `/api/screen-tech` | Get all screen technologies |
| GET | `/api/screen-tech/{id}` | Get screen technology detail |
| PUT | `/api/screen-tech/{id}` | Update screen technology |
| DELETE | `/api/screen-tech/{id}` | Soft delete screen technology |
| POST | `/api/screen-tech/{id}/restore` | Restore screen technology |

### 🔊 Sound System (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/sound-system` | Create sound system |
| GET | `/api/sound-system` | Get all sound systems |
| GET | `/api/sound-system/{id}` | Get sound system detail |
| PUT | `/api/sound-system/{id}` | Update sound system |
| DELETE | `/api/sound-system/{id}` | Soft delete sound system |
| POST | `/api/sound-system/{id}/restore` | Restore sound system |

### 💺 Seat Type (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/seat-type` | Create seat type |
| GET | `/api/seat-type` | Get all seat types |
| GET | `/api/seat-type/{id}` | Get seat type detail |
| PUT | `/api/seat-type/{id}` | Update seat type |
| DELETE | `/api/seat-type/{id}` | Soft delete seat type |
| POST | `/api/seat-type/{id}/restore` | Restore seat type |

### 💺 Seat (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/seat` | Create seat |
| GET | `/api/seat` | Get all seats |
| GET | `/api/seat/{id}` | Get seat detail |
| PUT | `/api/seat/{id}` | Update seat |
| DELETE | `/api/seat/{id}` | Soft delete seat |
| POST | `/api/seat/{id}/restore` | Restore seat |

### 🎥 Movie (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/movie` | Create movie |
| GET | `/api/movie` | Get all movies |
| GET | `/api/movie/{id}` | Get movie detail |
| PUT | `/api/movie/{id}` | Update movie |
| DELETE | `/api/movie/{id}` | Soft delete movie |
| POST | `/api/movie/{id}/restore` | Restore movie |

### 🎞️ Movie Format (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/movie-format` | Create movie format |
| GET | `/api/movie-format` | Get all movie formats |
| GET | `/api/movie-format/{id}` | Get movie format detail |
| PUT | `/api/movie-format/{id}` | Update movie format |
| DELETE | `/api/movie-format/{id}` | Soft delete movie format |
| POST | `/api/movie-format/{id}/restore` | Restore movie format |

### 🎭 Movie Genre (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/movie-genre` | Create movie genre |
| GET | `/api/movie-genre` | Get all movie genres |
| GET | `/api/movie-genre/{id}` | Get movie genre detail |
| PUT | `/api/movie-genre/{id}` | Update movie genre |
| DELETE | `/api/movie-genre/{id}` | Soft delete movie genre |
| POST | `/api/movie-genre/{id}/restore` | Restore movie genre |

### 🔞 Age Limit (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/age-limit` | Create age limit |
| GET | `/api/age-limit` | Get all age limits |
| GET | `/api/age-limit/{id}` | Get age limit detail |
| PUT | `/api/age-limit/{id}` | Update age limit |
| DELETE | `/api/age-limit/{id}` | Soft delete age limit |
| POST | `/api/age-limit/{id}/restore` | Restore age limit |

### ⏱️ Showtime (6 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/showtime` | Create showtime (auto-calc basePrice) |
| GET | `/api/showtime` | Get all showtimes |
| GET | `/api/showtime/{id}` | Get showtime detail |
| PUT | `/api/showtime/{id}` | Update showtime (recalculate basePrice) |
| DELETE | `/api/showtime/{id}` | Soft delete showtime |
| POST | `/api/showtime/{id}/restore` | Restore showtime |

### 🎟️ Booking (4 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/booking` | Create booking |
| GET | `/api/booking` | Get all bookings |
| GET | `/api/booking/{id}` | Get booking detail |
| DELETE | `/api/booking/{id}` | Cancel booking |

### 💳 Payment (3 APIs)
| Method | Endpoint | Description |
| ------ | --------- | ----------- |
| POST | `/api/payment/initiate` | Initiate payment (mock gateway) |
| POST | `/api/payment/callback` | Payment callback (webhook) |
| GET | `/api/payment/{bookingId}/status` | Get payment status by booking ID |

---

## 💰 Pricing Formula
```bash
Showtime.basePrice = Movie.basePrice * Brand.multiplier * Screen.multiplier * Sound.multiplier + Area.priceAddition

Booking.seatPrice = Showtime.basePrice * SeatType.multiplier
```

---

## 👨‍💻 Author

**Ngô Thanh Hiền** - Backend Developer  
📧 [thanhhien1732@gmail.com](mailto:thanhhien1732@gmail.com)  
🎓 CyberSoft Academy - Capstone Project  
💻 Backend Developer | NestJS | Prisma | MySQL  
🗓️ 2025


