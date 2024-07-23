let product = {
    productId: '10-65740',
    costPrice: 2750,
    profitPercentage: 15,
    sellingPrice: 0
}
function calculateSellingPrice(product) {
    let sellingPrice = product.costPrice + (product.costPrice * (product.profitPercentage / 100));
    product.sellingPrice = sellingPrice;
}
calculateSellingPrice(product);

//product.sellingPrice = product.costPrice + (product.costPrice * (product.profitPercentage / 100));
console.log(product.sellingPrice);

console.log(global);