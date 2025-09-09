## Movie Ticket Management System (Spring Boot)

Base URL: `http://localhost:8080`

Notes
- Unsecured root `/` will return 403 (expected). Public endpoints live under `/api/auth/**`.
- All protected requests require header: `Authorization: Bearer <JWT>`.
- Content type for bodies: `Content-Type: application/json`.

### 1) Authentication (Public)

Register (default role = ROLE_CUSTOMER)
```http
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Login (returns JWT)
```http
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```
Response
```json
{ "token": "<JWT>" }
```

Postman example (cURL)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"secret123"}'

curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

### 2) Customer Endpoints (Require ROLE_CUSTOMER)

List all movies
```http
GET /api/movies
Authorization: Bearer <JWT>
```

Get movie by id
```http
GET /api/movies/{id}
Authorization: Bearer <JWT>
```

Search movies by title
```http
GET /api/movies/search?title=star
Authorization: Bearer <JWT>
```

Showtimes for a movie
```http
GET /api/showtimes/movie/{movieId}
Authorization: Bearer <JWT>
```

Book tickets
```http
POST /api/bookings
Authorization: Bearer <JWT>
{
  "showtimeId": 1,
  "numberOfSeats": 2
}
```

My booking history
```http
GET /api/bookings/my-bookings
Authorization: Bearer <JWT>
```

Postman examples (cURL)
```bash
TOKEN=<paste JWT here>
curl http://localhost:8080/api/movies -H "Authorization: Bearer $TOKEN"
curl http://localhost:8080/api/movies/search?title=star -H "Authorization: Bearer $TOKEN"
curl http://localhost:8080/api/showtimes/movie/1 -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"showtimeId":1,"numberOfSeats":2}'
curl http://localhost:8080/api/bookings/my-bookings -H "Authorization: Bearer $TOKEN"
```

### 3) Admin Endpoints (Require ROLE_ADMIN)

Movies
```http
POST   /api/admin/movies
GET    /api/admin/movies
GET    /api/admin/movies/{id}
PUT    /api/admin/movies/{id}
DELETE /api/admin/movies/{id}
```
Create movie (body)
```json
{
  "title": "Interstellar",
  "genre": "Sci-Fi",
  "durationInMinutes": 169,
  "releaseDate": "2014-11-07",
  "description": "A space epic."
}
```

Theaters
```http
POST   /api/admin/theaters
GET    /api/admin/theaters
PUT    /api/admin/theaters/{id}
DELETE /api/admin/theaters/{id}
```
Create theater (body)
```json
{
  "name": "Cinema One",
  "location": "Downtown",
  "seatingCapacity": 200
}
```

Showtimes
```http
POST   /api/admin/showtimes
GET    /api/admin/showtimes
PUT    /api/admin/showtimes/{id}
DELETE /api/admin/showtimes/{id}
```
Create showtime (body)
```json
{
  "movieId": 1,
  "theaterId": 1,
  "showDateTime": "2025-09-10T19:30:00",
  "ticketPrice": 12.5
}
```

Bookings overview
```http
GET /api/admin/bookings
GET /api/admin/bookings/user/{userId}
```

Promote a user to admin
```http
POST /api/admin/users/{userId}/make-admin
```

Postman examples (cURL)
```bash
ADMIN_JWT=<paste admin JWT>
curl -X POST http://localhost:8080/api/admin/movies \
  -H "Authorization: Bearer $ADMIN_JWT" -H "Content-Type: application/json" \
  -d '{"title":"Interstellar","genre":"Sci-Fi","durationInMinutes":169,"releaseDate":"2014-11-07","description":"A space epic."}'

curl http://localhost:8080/api/admin/movies -H "Authorization: Bearer $ADMIN_JWT"
curl -X PUT http://localhost:8080/api/admin/movies/1 \
  -H "Authorization: Bearer $ADMIN_JWT" -H "Content-Type: application/json" \
  -d '{"title":"Interstellar (Extended)","genre":"Sci-Fi","durationInMinutes":175,"releaseDate":"2014-11-07","description":"Extended cut."}'
curl -X DELETE http://localhost:8080/api/admin/movies/1 -H "Authorization: Bearer $ADMIN_JWT"

curl -X POST http://localhost:8080/api/admin/theaters \
  -H "Authorization: Bearer $ADMIN_JWT" -H "Content-Type: application/json" \
  -d '{"name":"Cinema One","location":"Downtown","seatingCapacity":200}'

curl -X POST http://localhost:8080/api/admin/showtimes \
  -H "Authorization: Bearer $ADMIN_JWT" -H "Content-Type: application/json" \
  -d '{"movieId":1,"theaterId":1,"showDateTime":"2025-09-10T19:30:00","ticketPrice":12.5}'

curl http://localhost:8080/api/admin/bookings -H "Authorization: Bearer $ADMIN_JWT"
curl http://localhost:8080/api/admin/bookings/user/1 -H "Authorization: Bearer $ADMIN_JWT"

curl -X POST http://localhost:8080/api/admin/users/1/make-admin -H "Authorization: Bearer $ADMIN_JWT"
```

### 4) Getting an Admin Token (if you have none yet)

Option A (SQL)
```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'admin@example.com';
```
Then login again and use the returned token for `/api/admin/**`.

### 5) Common HTTP Headers in Postman
- Key: `Content-Type`, Value: `application/json`
- Key: `Authorization`, Value: `Bearer <JWT>`


