import app from "./app.js";
import { warmupDB } from "./db/warmup.js";

const PORT = process.env.PORT || 4000;

(async () => {
  await warmupDB();

  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})();
