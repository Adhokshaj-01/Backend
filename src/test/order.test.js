import nock from "nock";
import fetch from "node-fetch";

describe("Nock test example", () => {
  test("should mock 10 API POST calls", async () => {
    const scope = nock("http://localhost:4000")
      .post("/api/order")
      .times(10)
      .reply(200, { message: "mocked ok" });

    const reqs = [];
    for (let i = 0; i < 10; i++) {
      reqs.push(
        fetch("http://localhost:4000/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: 1, qty: 1 })
        })
      );
    }

    const results = await Promise.all(reqs);

    results.forEach(r => expect(r.status).toBe(200));

    scope.done(); // ensures all 10 calls happened
  });
});
