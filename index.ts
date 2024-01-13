import express from "express"
import "dotenv/config"
import cors from 'cors'
import passport from "passport"
import { loggingMiddleware } from "./middlewares/logging"
import { apiErrorHandler } from "./middlewares/error"
import { routeNotFound } from "./middlewares/routeNotFound"
import { loginWithGoogle } from "./middlewares/loginWithGoogle"
import authRoute from "./routes/authRoute"
import categoriesRoute from "./routes/categoriesRoute"
import productsRoute from "./routes/productsRoute"
import usersRoute from "./routes/usersRoute"
import ordersRoute from "./routes/ordersRoute"

const app = express();
app.use(express.json());
app.use(cors());

app.use(passport.initialize());
passport.use(loginWithGoogle());

app.use(loggingMiddleware);
app.use("/api/v1/categories", categoriesRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/orders", ordersRoute);
app.use(apiErrorHandler);
app.use(routeNotFound);

export default app;
