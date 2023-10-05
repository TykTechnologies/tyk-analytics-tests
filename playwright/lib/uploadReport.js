"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var fs = require("fs");
var path = require("path");
var mime = require('mime-types');
// Load AWS credentials from environment variables
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var AWS_REGION = process.env.AWS_REGION;
var BUCKET_NAME = process.env.S3_BUCKET_NAME; // Replace with your S3 bucket name
var BASE_FOLDER_PATH = './playwright-report';
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !BUCKET_NAME || !BASE_FOLDER_PATH) {
    console.error('Missing required environment variables.');
    process.exit(1);
}
var s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
});
for (var _i = 0, _a = fs.readdirSync(BASE_FOLDER_PATH); _i < _a.length; _i++) {
    var item = _a[_i];
    // Call the function to upload the base folder and its subfolders to S3
    uploadFolderToS3(BASE_FOLDER_PATH);
}
function uploadFolderToS3(folderPath) {
    return __awaiter(this, void 0, void 0, function () {
        var items, _i, items_1, item, itemPath, itemStat, fileContent, ID, s3Key, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    items = fs.readdirSync(folderPath);
                    _i = 0, items_1 = items;
                    _a.label = 1;
                case 1:
                    if (!(_i < items_1.length)) return [3 /*break*/, 6];
                    item = items_1[_i];
                    itemPath = path.join(folderPath, item);
                    itemStat = fs.statSync(itemPath);
                    console.log(itemPath);
                    if (!itemStat.isFile()) return [3 /*break*/, 3];
                    fileContent = fs.readFileSync(itemPath);
                    ID = "fwefefe";
                    s3Key = path.relative(BASE_FOLDER_PATH, itemPath).replace(/\\/g, '/');
                    return [4 /*yield*/, s3
                            .upload({
                            Bucket: BUCKET_NAME,
                            Key: ID + "/" + s3Key,
                            Body: fileContent,
                            ContentType: mime.lookup(itemPath) || undefined,
                        })
                            .promise()];
                case 2:
                    _a.sent();
                    console.log("Uploaded ".concat(s3Key, " to S3."));
                    return [3 /*break*/, 5];
                case 3:
                    if (!itemStat.isDirectory()) return [3 /*break*/, 5];
                    // If it's a directory, recursively upload its contents
                    return [4 /*yield*/, uploadFolderToS3(itemPath)];
                case 4:
                    // If it's a directory, recursively upload its contents
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("Folder upload completed for ".concat(folderPath, "."));
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error("Error uploading folder ".concat(folderPath, " to S3:"), error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
