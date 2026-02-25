export const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (createdAt: any) => {
  if (!createdAt) return '';

  if (typeof createdAt === 'number') {
    return new Date(createdAt).toLocaleDateString();
  }

  if (createdAt.toDate) {
    return createdAt.toDate().toLocaleDateString();
  }

  return '';
};