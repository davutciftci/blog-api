"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("../controllers/post");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', post_1.getAll);
router.get('/:id', post_1.getOne);
router.post('/', auth_1.authenticate, post_1.create);
router.put('/:id', auth_1.authenticate, post_1.update);
router.delete('/:id', auth_1.authenticate, post_1.remove);
exports.default = router;
