"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/orderRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const orderController = __importStar(require("../controllers/orderController"));
const router = express_1.default.Router();
/**
 * 订单管理路由
 */
/**
 * 获取当前用户的所有订单
 * @route GET /my
 * @requires auth 中间件验证
 * @access 登录用户
 */
router.get('/my', auth_1.authenticate, orderController.getUserOrders);
/**
 * 获取当前用户作为卖家的所有订单
 * @route GET /seller
 * @requires auth 中间件验证
 * @access 登录用户
 */
router.get('/seller', auth_1.authenticate, orderController.getSellerOrders);
/**
 * 获取当前用户作为买家的所有订单
 * @route GET /buyer
 * @requires auth 中间件验证
 * @access 登录用户
 */
router.get('/buyer', auth_1.authenticate, orderController.getBuyerOrders);
/**
 * 管理员获取系统所有订单（需要管理员权限）
 * @route GET /admin/all
 * @requires auth 中间件验证
 * @access 管理员
 */
router.get('/admin/all', auth_1.authenticate, orderController.getAdminAllOrders);
/**
 * 获取订单统计信息（需要管理员权限）
 * @route GET /admin/stats
 * @requires auth 中间件验证
 * @access 管理员
 */
router.get('/admin/stats', auth_1.authenticate, orderController.getOrderStats);
exports.default = router;
