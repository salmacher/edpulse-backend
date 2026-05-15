"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.StockStatus = void 0;
var StockStatus;
(function (StockStatus) {
    StockStatus["IN_STOCK"] = "in_stock";
    StockStatus["LOW_STOCK"] = "low_stock";
    StockStatus["OUT_OF_STOCK"] = "out_of_stock";
})(StockStatus || (exports.StockStatus = StockStatus = {}));
class Product {
    id;
    name;
    category;
    price;
    stock_status;
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map