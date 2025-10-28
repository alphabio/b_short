// b_path:: test/me.ts
// Test file to verify partial options work correctly
import { expand } from "../src/index";

// Test the user's desired usage pattern
// const css = "margin: 10px; padding: 5px;";
// const css = "columns: red;";

const css = "border: solid;";

console.log("Testing partial options...");

// Test 1: Only indent specified
const result1 = expand(css, { indent: 0 });
console.log("Result with indent: 0");
console.log(result1.result);
console.log("---");

// Test 2: Only format specified
const result2 = expand(css, { format: "js" });
console.log("Result with format: js");
console.log(result2);
console.log("---");

// Test 3: Multiple partial options
const result3 = expand(css, { indent: 4, separator: " " });
console.log("Result with indent: 4, separator: ' '");
console.log(result3);
console.log("---");

// Test 4: No options (should use defaults)
const result4 = expand(css);
console.log("Result with no options (defaults)");
console.log(result4);
console.log("---");

console.log("All tests completed successfully!");
