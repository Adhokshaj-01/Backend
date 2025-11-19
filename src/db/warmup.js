import pool from "./index.js";

export async function warmupDB() {
  console.log("🔥 Warming up the DB & preparing statements...");

  const client = await pool.connect();

  try {
    console.time("DB Warmup");

    await client.query("SELECT 1");

    console.log("➡️ Preparing inventory query...");
    await client.query(
      {
        name: "prep-inventory-select",
        text: "SELECT stock FROM inventory WHERE id = $1"
      },
      [0]
    );

    console.log("➡️ Preparing atomic stock update...");
    await client.query(
      {
        name: "prep-atomic-stock-update",
        text: `
          UPDATE inventory
          SET stock = stock - $2
          WHERE id = $1 AND stock >= $2
          RETURNING stock
        `
      },
      [0, 0]
    );

    console.log("➡️ Preparing insert order (EXPLAIN only)...");
    await client.query(`
      EXPLAIN 
      INSERT INTO orders (product_id, qty, status)
      VALUES (1, 1, 'CREATED')
    `);

    console.timeEnd("DB Warmup");
    console.log("✅ DB Warmed, Prepared Statements Cached!");

  } catch (e) {
    console.log("❌ DB warmup failed:", e);
  } finally {
    client.release();
  }
}
