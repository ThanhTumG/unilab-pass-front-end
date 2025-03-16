const fs = require("fs");

const tsconfigPath = "api/tsconfig.json";
const baseTsPath = "api/base.ts";

// Update api/tsconfig.json
if (fs.existsSync(tsconfigPath)) {
  const config = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  config.compilerOptions.target = "ESNext";
  delete config.compilerOptions.rootDir; // Remove rootDir
  fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
  console.log(
    "✅ Updated tsconfig.json: Removed rootDir and set target to ESNext"
  );
}

// Update api/base.ts
if (fs.existsSync(baseTsPath)) {
  let content = fs.readFileSync(baseTsPath, "utf8");

  content = content.replace(
    `import globalAxios from 'axios';`,
    `import API from "./axios-instance";`
  );

  content = content.replace(
    `protected axios: AxiosInstance = globalAxios`,
    `protected axios: AxiosInstance = API`
  );

  fs.writeFileSync(baseTsPath, content);
  console.log("✅ Updated base.ts: Replaced axios import and instance");
}
