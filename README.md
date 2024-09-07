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
   - Body:  
     ```json
     { 
       "email": "user@example.com", 
       "password": "password123" 
     }
     ```
   - Response:  
     ```json
     {
       "message": "Login successful",
       "token": "your_jwt_token"
     }
     ```

2. **Signup** - `/user/sign-up`
   - Method: `POST`
   - Body:  
     ```json
     { 
       "name": "John Doe", 
       "email": "john@example.com", 
       "password": "password123" 
     }
     ```
   - Response:  
     ```json
     {
       "message": "User registered successfully"
     }
     ```

### URL Routes

3. **Generate URL** - `/url`
   - Method: `POST`
   - Body:  
     ```json
     {
       "url": "https://example.com",
       "shortid": "customShortId" // optional
     }
     ```
   - Response:  
     ```json
     {
       "id": "12345",
       "entries": [
         {
           "_id": "66dc09b8e1ee590464f75fc0",
           "shortId": "pHxneKPb_",
           "redirectURL": "https://example.com",
           "visitHistory": [ ... ],
           "createdBy": "userId",
           "createdAt": "2024-09-07T08:07:20.128Z",
           "updatedAt": "2024-09-07T08:07:30.158Z"
         }
       ]
     }
     ```

4. **Handle Redirection** - `/url/:shortid`
   - Method: `GET`
   - Description: Redirects to the original URL based on the short ID.

5. **URL Analytics** - `/url/analyse/:shortId`
   - Method: `GET`
   - Response:  
     ```json
     {
       "shortid": "pHxneKPb_",
       "totalVisits": 3,
       "uniqueVisitors": 2,
       "deviceTypeCount": {
         "mobile": 1,
         "desktop": 2
       },
       "dailyVisit": {
         "2024-09-07": 3
       },
       "redirectURL": "https://example.com"
     }
     ```

### Admin Routes

6. **Get All Entries** - `/admin/`
   - Method: `GET`
   - Response:  
     ```json
     [
       {
         "_id": "66dc09b8e1ee590464f75fc0",
         "shortId": "pHxneKPb_",
         "redirectURL": "https://example.com",
         "visitHistory": [ ... ],
         "createdBy": "userId",
         "createdAt": "2024-09-07T08:07:20.128Z",
         "updatedAt": "2024-09-07T08:07:30.158Z"
       },
       {
         "_id": "66dc09bde1ee590464f75fc4",
         "shortId": "adsf",
         "redirectURL": "https://fedex.com",
         "visitHistory": [],
         "createdBy": "userId",
         "createdAt": "2024-09-07T08:07:25.377Z",
         "updatedAt": "2024-09-07T08:07:25.377Z"
       }
     ]
     ```

7. **Delete Old URLs (older than 7 days)** - `/admin/deleteOldUrl`
   - Method: `GET`
   - Response:  
     ```json
     {
       "message": "Old URLs deleted successfully",
       "deletedCount": 0
     }
     ```

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
