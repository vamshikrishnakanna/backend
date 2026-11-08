import 'dotenv/config';
import mongoose from 'mongoose';
import Issue from './models/Issue.js';

const rows = [
  ['Large pothole near bus stop', 'Deep pothole on the main road damaging two-wheelers', 'pothole', 'MG Road', 12.9716, 77.5946],
  ['Overflowing garbage bin', 'Bin has not been cleared for a week, smell is terrible', 'garbage', 'Indiranagar', 12.9784, 77.6408],
  ['Streetlight not working', 'Entire lane is dark after 7pm', 'streetlight', 'Koramangala', 12.9352, 77.6245],
  ['Water pipe leaking', 'Water gushing from a broken pipe near the junction', 'water_leak', 'MG Road', 12.9722, 77.5951],
  ['Damaged speed limit sign', 'Sign bent after an accident, unreadable', 'damaged_sign', 'Jayanagar', 12.9250, 77.5938],
];
await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/issue_finder');
await Issue.deleteMany({});
await Issue.insertMany(rows.map(([title, description, category, area, lat, lng]) => ({ title, description, category, area, lat, lng, reporterName: 'Seed' })));
console.log('Seeded', rows.length, 'issues');
await mongoose.disconnect();
