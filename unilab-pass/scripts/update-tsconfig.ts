const fs = require("fs");
const path = "api/tsconfig.json";

if (fs.existsSync(path)) {
  const config = JSON.parse(fs.readFileSync(path, "utf8"));
  config.compilerOptions.target = "ESNext";
  delete config.compilerOptions.rootDir; // Remove rootDir
  fs.writeFileSync(path, JSON.stringify(config, null, 2));
  console.log(
    "Updated tsconfig.json: Removed rootDir and set target to ESNext"
  );
}
