# Advanced URL Shortener

An advanced URL shortener service with features like JWT authentication, custom short IDs, traffic analysis with visualizations, and role-based access control for admins. This service allows users to shorten URLs, analyze traffic, and manage access securely.

## Features
- **JWT Authentication** for secure access.
- **Custom Short IDs** for personalized URL shorteners.
- **Analytics and Visualizations** including graphs and pie charts to track URL usage.
- **Role-Based Access Control**: Admins have exclusive access to certain routes.
- **Redis Caching** for fast retrieval of analytics data.

## API Endpoints

### User Routes
1. **Login** - `/user/login`
   - Method: `POST`
   - Body: `{ email, password }`
   
2. **Signup** - `/user/sign-up`
   - Method: `POST`
   - Body: `{ name, email, password }`

### URL Routes
3. **Generate URL** - `/url`
   - Method: `POST`
   - Body: `{ url, shortid (optional) }`
   
4. **Handle Redirection** - `/url/:shortid`
   - Method: `GET`
   
5. **URL Analytics** - `/url/analyse/:shortId`
   - Method: `GET`
   - Response: Detailed visit data (total visits, unique visitors, device types, etc.)

### Admin Routes
6. **Get All Entries** - `/admin/`
   - Method: `GET`
   
7. **Delete Old URLs (older than 7 days)** - `/admin/deleteOldUrl`
   - Method: `GET`

## Database Structure
The application uses **MongoDB** for data storage with two main schemas:
- **URL Schema**: Stores the short ID, original URL, visit history, and creator.
- **User Schema**: Stores user details including roles (admin or normal).

## Security
Two key middleware are used for security:
- **Authentication Middleware**: Verifies JWT tokens for protected routes.
- **Role-Based Authorization Middleware**: Restricts access to certain routes based on user roles.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT
- **Caching**: Redis
- **Data Visualization**: Graphs and pie charts for analytics

---
