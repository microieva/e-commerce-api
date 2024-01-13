import app from "..";
import { connectDb } from "./connectDb";

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`👀 app is running at localhost:${PORT}`);
});

connectDb();
