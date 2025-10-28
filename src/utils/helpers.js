export const formatCurrency = (num) => 
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(num);

export const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' });
