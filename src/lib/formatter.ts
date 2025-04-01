
/**
 * Format a number as currency in USD
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value < 1 ? 6 : 2,
    minimumFractionDigits: value < 1 ? 2 : 2,
  }).format(value);
};

/**
 * Format a number with specified decimal places
 */
export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a large number with abbreviations (K, M, B, etc.)
 */
export const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

/**
 * Format a date to a readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};
