const fs = require("fs");

const tsconfigPath = "api/tsconfig.json";
const baseTsPath = "api/base.ts";
const labMemberControllerApi = "api/api/lab-member-controller-api.ts";
const myUserControllerApi = "api/api/my-user-controller-api.ts";
const modelControllerApi = "api/api/model-controller-api.ts";
const logControllerApi = "api/api/log-controller-api.ts";
const eventLogControllerApi = "api/api/event-log-controller-api.ts";

// Update api/tsconfig.json
if (fs.existsSync(tsconfigPath)) {
  const config = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  config.compilerOptions.target = "ESNext";
  delete config.compilerOptions.rootDir; // Remove rootDir
  fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
  console.log("Updated api/tsconfig.json");
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
  console.log("Updated api/base.ts");
}

// Update api/lab-member-controller-api.ts
if (fs.existsSync(labMemberControllerApi)) {
  let content = fs.readFileSync(labMemberControllerApi, "utf8");

  content = content.replace(/\{File\}/g, "{any}");

  content = content.replace(/file: File/g, "file: any");

  content = content.replace(
    /new Blob\(\[JSON\.stringify\(request\)\], \{ type: "application\/json", \}\)/g,
    '{ name: "request", type: "application/json", string: JSON.stringify(request) }'
  );

  fs.writeFileSync(labMemberControllerApi, content);
  console.log("Updated api/api/lab-member-controller-api.ts");
}

// Update api/my-user-controller-api.ts
if (fs.existsSync(myUserControllerApi)) {
  let content = fs.readFileSync(myUserControllerApi, "utf8");

  content = content.replace(/\{File\}/g, "{any}");

  content = content.replace(/file\?: File/g, "file?: any");

  content = content.replace(
    /new Blob\(\[JSON\.stringify\(request\)\], \{ type: "application\/json", \}\)/g,
    '{ name: "request", type: "application/json", string: JSON.stringify(request) }'
  );

  fs.writeFileSync(myUserControllerApi, content);
  console.log("Updated api/api/my-user-controller-api.ts");
}

// Update api/log-controller-api.ts
if (fs.existsSync(logControllerApi)) {
  let content = fs.readFileSync(logControllerApi, "utf8");

  content = content.replace(/\{File\}/g, "{any}");

  content = content.replace(/file\?: File/g, "file?: any");

  content = content.replace(
    /new Blob\(\[JSON\.stringify\(request\)\], \{ type: "application\/json", \}\)/g,
    '{ name: "request", type: "application/json", string: JSON.stringify(request) }'
  );

  fs.writeFileSync(logControllerApi, content);
  console.log("Updated api/api/my-user-controller-api.ts");
}

// Update api/event-log-controller-api
if (fs.existsSync(eventLogControllerApi)) {
  let content = fs.readFileSync(eventLogControllerApi, "utf8");

  content = content.replace(/\{File\}/g, "{any}");

  content = content.replace(/file\?: File/g, "file?: any");

  content = content.replace(
    /new Blob\(\[JSON\.stringify\(request\)\], \{ type: "application\/json", \}\)/g,
    '{ name: "request", type: "application/json", string: JSON.stringify(request) }'
  );

  fs.writeFileSync(eventLogControllerApi, content);
  console.log("Updated api/api/my-user-controller-api.ts");
}

// Update api/model-controller-api.ts
if (fs.existsSync(modelControllerApi)) {
  let content = fs.readFileSync(modelControllerApi, "utf8");

  content = content.replace(/\{File\}/g, "{any}");

  content = content.replace(/image1: File/g, "image1: any");

  fs.writeFileSync(modelControllerApi, content);
  console.log("Updated api/api/model-controller-api.ts");
}
