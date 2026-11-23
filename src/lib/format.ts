const priceFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatPrice(price: number) {
  return `${priceFormatter.format(price)}/৳ `;
}
