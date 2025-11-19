import fetch from "node-fetch";

// Helpers
const timestamp = () =>
  new Date().toISOString().replace("T", " ").replace("Z", "");

let requestId = 0;
let currentSecond = 0;
const secondStats = {};
let reqC = 100;

// Initialize stats bucket
function initStats(sec) {
  secondStats[sec] = {
    sent: 0,
    success: 0,
    fail: 0,
    latencies: []
  };
}

// Send request with detailed logging
async function sendRequest(sec) {
  const start = performance.now();
  secondStats[sec].sent++;

  try {
    const res = await fetch("http://localhost:4000/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: 2, qty: 1 })
    });

    const latency = +(performance.now() - start).toFixed(2);
    const id = ++requestId;

    secondStats[sec].latencies.push(latency);

    if (res.status >= 200 && res.status < 300) {
      secondStats[sec].success++;
      console.log(
        `[${timestamp()}]  Req:${id.toString().padStart(4)} | Sec:${sec
          .toString()
          .padStart(2)} | STATUS ${res.status} | ${latency
          .toString()
          .padStart(6)} ms`
      );
    } else {
      secondStats[sec].fail++;
      console.log(
        `[${timestamp()}]  Req:${id.toString().padStart(4)} | Sec:${sec
          .toString()
          .padStart(2)} | ERROR_STATUS ${res.status} | ${latency
          .toString()
          .padStart(6)} ms`
      );
    }
  } catch (err) {
    const id = ++requestId;
    secondStats[sec].fail++;
    console.log(
      `[${timestamp()}]  Req:${id
        .toString()
        .padStart(4)} | Sec:${sec
        .toString()
        .padStart(2)} | NETWORK_ERROR | ${err.message}`
    );
  }
}

// Print summary cleanly
function printSummary(sec) {
  const s = secondStats[sec];
  const avg =
    s.latencies.length === 0
      ? 0
      : (s.latencies.reduce((a, b) => a + b) / s.latencies.length).toFixed(2);

  console.log(`
──────────────────── SUMMARY (SECOND ${sec}) ────────────────────
Requests Sent   : ${s.sent}
Success         : ${s.success}
Failed          : ${s.fail}
Average Latency : ${avg} ms
──────────────────────────────────────────────────────────────────\n`);
}

// MAIN LOOP → 20 RPS
setInterval(() => {
  currentSecond++;
  initStats(currentSecond);

  console.log(
    `\n🚀 ${timestamp()} — Firing 20 requests for second ${currentSecond}...\n`
  );

  for (let i = 0; i < reqC; i++) {
    sendRequest(currentSecond);
  }

  // print summary after 1 second
  setTimeout(() => printSummary(currentSecond), 1000);
}, 1000);

console.log(`Load Test Started — Generating ${reqC} RPS...\n`);
