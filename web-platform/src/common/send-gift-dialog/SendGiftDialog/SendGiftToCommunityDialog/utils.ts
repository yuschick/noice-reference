export const getCommunityGiftProductName = (amount: number) => {
  return amount > 1 ? `${amount} Subs` : `${amount} Sub`;
};
