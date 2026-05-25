/**
 * k6 load test for the AquaI backend.
 *
 * Local run:
 *   k6 run --vus 50 --duration 30s tests/load/api.k6.js
 *
 * Cloud run (requires k6 cloud token):
 *   K6_API_BASE=https://api.aquai.in/api/v1 k6 cloud tests/load/api.k6.js
 */
import http from "k6/http";
import { check, group, sleep } from "k6";

const BASE = __ENV.K6_API_BASE || "http://localhost:8000/api/v1";

export const options = {
  scenarios: {
    browse: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 50  },
        { duration: "2m",  target: 200 },
        { duration: "1m",  target: 0   },
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed:   ["rate<0.02"],
    http_req_duration: ["p(95)<800", "p(99)<1500"],
  },
};

export default function () {
  group("read-heavy", () => {
    const r1 = http.get(`${BASE}/pricing/prawn`);
    check(r1, { "pricing 200": (r) => r.status === 200 });

    const r2 = http.get(`${BASE}/surveillance/outbreaks`);
    check(r2, { "outbreaks 200": (r) => r.status === 200 });

    const r3 = http.get(`${BASE}/advisory/weather?district=Bhimavaram`);
    check(r3, { "weather 200": (r) => r.status === 200 });

    const r4 = http.get(`${BASE}/marketplace/categories`);
    check(r4, { "marketplace 200": (r) => r.status === 200 });
  });

  sleep(Math.random() * 2);

  group("alerts and chat", () => {
    const payload = JSON.stringify({ question: "vannamei price today", lang: "en" });
    const r = http.post(`${BASE}/advisory/assistant`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    check(r, { "assistant 200": (res) => res.status === 200 });
  });

  sleep(Math.random() * 3);
}
