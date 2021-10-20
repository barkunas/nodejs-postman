import { readFileSync } from 'fs';
const PID = +readFileSync('pidServer')
process.kill(PID);