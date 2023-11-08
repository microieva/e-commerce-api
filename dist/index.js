import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import itemsRoute from "./routes/itemsRoute.js";
import productsRoute from "./routes/productsRoute.js";
import { loggingMiddleware } from "./middlewares/logging.js";
import { apiErrorHandler } from "./middlewares/error.js";
import { routeNotFound } from "./middlewares/routeNotFound.js";
const PORT = 8080;
const app = express();
app.use(express.json());
// TODO: Validate .env using Zod
const mongoURL = process.env.DB_URL;
mongoose.connect(mongoURL).then(() => console.log("Connected!"));
app.get("/hello", loggingMiddleware, (_, res) => {
    res.json({ msg: "hello, from Express.js!" });
});
app.use("/api/v1/items", itemsRoute);
app.use("/api/v1/products", productsRoute);
app.use(apiErrorHandler);
app.use(routeNotFound);
app.listen(PORT, () => {
    console.log(`👀 app is running at localhost:${PORT}`);
});
