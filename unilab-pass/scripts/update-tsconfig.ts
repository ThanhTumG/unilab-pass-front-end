const fs = require("fs");

// Đường dẫn file tsconfig.json
const tsconfigPath = "api/tsconfig.json";
// Đường dẫn file base.ts do OpenAPI Generator tạo ra
const baseTsPath = "api/base.ts";

// Cập nhật tsconfig.json
if (fs.existsSync(tsconfigPath)) {
  const config = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  config.compilerOptions.target = "ESNext";
  delete config.compilerOptions.rootDir; // Remove rootDir
  fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
  console.log(
    "✅ Updated tsconfig.json: Removed rootDir and set target to ESNext"
  );
}

// Cập nhật base.ts
if (fs.existsSync(baseTsPath)) {
  let content = fs.readFileSync(baseTsPath, "utf8");

  // Thay thế import Axios mặc định bằng import API từ axios-instance.ts
  content = content.replace(
    `import globalAxios from 'axios';`,
    `import API from "./axios-instance";`
  );

  // Thay thế axios instance trong class
  content = content.replace(
    `protected axios: AxiosInstance = globalAxios`,
    `protected axios: AxiosInstance = API`
  );

  fs.writeFileSync(baseTsPath, content);
  console.log("✅ Updated base.ts: Replaced axios import and instance");
}
