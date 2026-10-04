export const STRIPE_PAYMENT_LINKS = {
  yen1000: process.env.NEXT_PUBLIC_STRIPE_LINK_1000 || "https://buy.stripe.com/test_1000",
  yen3000: process.env.NEXT_PUBLIC_STRIPE_LINK_3000 || "https://buy.stripe.com/test_3000",
  yen5000: process.env.NEXT_PUBLIC_STRIPE_LINK_5000 || "https://buy.stripe.com/test_5000",
  yen10000: process.env.NEXT_PUBLIC_STRIPE_LINK_10000 || "https://buy.stripe.com/test_10000",
  custom: process.env.NEXT_PUBLIC_STRIPE_LINK_CUSTOM || "https://buy.stripe.com/test_custom",
};

export const SUPPORT_NOTES = [
  "アカウント登録不要",
  "クレジットカード等で決済",
  "物品等のリターンなし",
];
