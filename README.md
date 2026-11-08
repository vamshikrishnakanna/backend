# Public Issue Duplicate Finder (MERN)

**Student:** Kanna Vamshi Krishna — USN 2102508584
**Theme:** Civic complaint consolidation

Public issue portals receive repeated reports about the same pothole, damaged sign or
overflowing bin. This app lets citizens report issues, filter them by location and category,
and — the differentiating feature — **suggests possible duplicates *before* a new report is submitted**.

## Stack
React (Vite) · Node.js + Express REST API · MongoDB (Mongoose) · express-validator · responsive CSS

## Run
```bash
# 1. API
cd server && cp .env.example .env && npm install && npm run dev      # http://localhost:5000
# 2. UI
cd client && npm install && npm run dev                              # http://localhost:5173
# 3. Test the matching algorithm (no DB needed)
cd server && npm test
```

## REST API
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/issues?category=&area=&status=&q=&lat=&lng=&radius=&page=&limit=` | List / filter issues |
| GET | `/api/issues/:id` | One issue |
| POST | `/api/issues` | Create issue (validated) |
| POST | `/api/issues/duplicates` | **Suggest duplicates for a draft report** |
| POST | `/api/issues/:id/confirm` | "Me too" – upvote an existing issue instead of filing a new one |
| PATCH | `/api/issues/:id/status` | open → in_progress → resolved |
| GET | `/api/issues/meta/categories` | Category list |

## How duplicate suggestion works (`server/src/utils/similarity.js`)
Candidates are unresolved issues in the same category within ~1 km (Mongo `$geoNear`-style `$near` on a 2dsphere index).
Each is scored 0–100:

score = 0.45·distance + 0.35·text + 0.10·recency + 0.10·area

* **distance** – haversine, linear decay to 0 at 500 m
* **text** – Jaccard similarity of stop-word-filtered title+description tokens
* **recency** – decays to 0 over 30 days
* **area** – same locality/ward name

Anything ≥ 45 is suggested; ≥ 70 is flagged "very likely duplicate". The UI shows matches live (debounced) while the user types and offers *"Same issue – confirm it"* instead of submitting.

## Requirement checklist
- React UI ✔ · Express REST API ✔ · MongoDB persistence ✔
- Input validation (client + server) ✔ · Central error handling ✔ · Responsive design ✔
