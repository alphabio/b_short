import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync("test/fixtures/background.json", "utf8"));
let count = 0;

for (const key in data) {
  if (data[key].backgroundClip && !data[key].backgroundColor) {
    data[key].backgroundColor = "transparent";
    count++;
  }
}

writeFileSync("test/fixtures/background.json", `${JSON.stringify(data, null, 2)}\n`);
console.log("Updated", count, "fixtures");
