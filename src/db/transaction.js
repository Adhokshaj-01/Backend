import pool from "./index.js";

export async function runTransaction(callback) {
    const client = await pool.connect();
    try{
      await client.query("BEGIN");
     const result = await callback(client);
     await client.query("COMMIT");
     return result;
    }
    catch (e){
      await client.query('ROLLBACK');
      throw e; 
    }
    finally {
        client.release();
    }
}

