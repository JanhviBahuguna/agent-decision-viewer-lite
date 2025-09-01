export function maskCustomerId(customerId: string): string {
  if (!customerId || customerId.length < 4) {
    return '***';
  }
  
  const lastThree = customerId.slice(-3);
  return `***${lastThree}`;
}