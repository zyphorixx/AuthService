# AuthService

AuthService is a microservice built with **Node.js and Express** that handles user authentication and token validation for a distributed application.  
It provides endpoints to **login**, **signup**, and **verify JWT tokens** for secure access across your microservices.

This service is used by the API Gateway to verify if incoming requests are authenticated before forwarding them to other services (e.g., BookingService, FlightService).

---

## Features

- User authentication using **JWT**
- Token validation endpoint for API Gateway
- Secure password handling (hashed)
- Easy integration with other microservices
- Stateless and scalable design

---

## Endpoints

| Method | Path                         | Description |
|--------|------------------------------|-------------|
| POST   | `/api/v1/signup`             | Register a new user |
| POST   | `/api/v1/login`              | Login and return JWT |
| GET    | `/api/v1/isAuthenticated`    | Return user validity status based on token |
| GET    | `/api/v1/health`             | Basic health check |

---

## Example Usage (API Gateway)

Your API Gateway will validate requests like this:

```js
app.use("/bookingservice", async (req, res, next) => {
  const token = req.headers["x-access-token"];

  const response = await axios.get(
    "http://localhost:3001/api/v1/isAuthenticated",
    { headers: { "x-access-token": token } }
  );

  if (response.data.success) next();
  else res.status(401).json({ message: "Unauthorized" });
});
