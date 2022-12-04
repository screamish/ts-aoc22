import { existsSync, copyFileSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path'

/**
 * Creates the boilerplate code for a new puzzle
 * Usage: npm run init-day {dayNumber} i.e npm run 1
 * It will create a new folder under src/day{dayNumber}
 * with the boilerplate code to build the solution, and an empty input .txt file.
 */

const args = process.argv.slice(2);
const day = args[0];
if (!day) {
  console.error('Please run with the day to bootstrap, i.e. npm run init-day 1');
  process.exit(1)
}

console.log(`creating template for day ${day}`);

const newDayPath = `./src/day${day}`;

if (existsSync(newDayPath)) {
  console.log(`day ${day} already exists`);
  process.exit(0);
}

mkdirSync(newDayPath);

const copy = (filename:string) => {
  console.log(`copying ${filename} from ${__dirname} to ${newDayPath}`)
  copyFileSync(path.join(__dirname, filename), path.join(newDayPath, filename))
}

const files = ['puzzle.ts', 'puzzle.test.ts', 'data.txt']
files.forEach(f => copy(f))