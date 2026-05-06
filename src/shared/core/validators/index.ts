export const isRequired = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().length > 0;

export const maxLength = (value: unknown, max: number): boolean => {
  if (value === undefined || value === null) return true;
  return typeof value === 'string' && value.trim().length <= max;
};

export const minLength = (value: unknown, min: number): boolean => {
  if (value === undefined || value === null) return true;
  return typeof value === 'string' && value.trim().length >= min;
};

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isInEnum = (
  value: string | undefined,
  validValues: string[],
): boolean => {
  if (!value) return true;
  return validValues.includes(value.toLowerCase());
};

export const matches = (value: unknown, target: unknown): boolean =>
  value === target;
