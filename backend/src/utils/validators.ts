import { badRequest } from './httpError';

type EnumLike = readonly string[];

export function parseStringLimited(
  value: unknown,
  opts: { required?: boolean; maxLength: number; fieldName: string }
): string | undefined {
  if (value == null || value === '') {
    if (opts.required) {
      throw badRequest(`Missing ${opts.fieldName}`);
    }
    return undefined;
  }
  if (typeof value !== 'string') {
    throw badRequest(`Invalid ${opts.fieldName}`);
  }
  if (value.length > opts.maxLength) {
    throw badRequest(`${opts.fieldName} is too long`);
  }
  return value;
}

export function parseBoolean(value: unknown, fieldName: string): boolean | undefined {
  if (value == null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') throw badRequest(`Invalid ${fieldName}`);
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw badRequest(`Invalid ${fieldName}`);
}

export function parsePositiveInt(
  value: unknown,
  opts: { fieldName: string; default?: number; min?: number; max?: number }
): number {
  if (value == null || value === '') {
    if (opts.default !== undefined) return opts.default;
    throw badRequest(`Missing ${opts.fieldName}`);
  }

  const str = typeof value === 'number' ? String(value) : (value as string);
  if (typeof str !== 'string') throw badRequest(`Invalid ${opts.fieldName}`);

  const num = Number.parseInt(str, 10);
  if (Number.isNaN(num)) throw badRequest(`Invalid ${opts.fieldName}`);

  const min = opts.min ?? 1;
  if (num < min) throw badRequest(`Invalid ${opts.fieldName}`);
  if (opts.max !== undefined && num > opts.max) {
    throw badRequest(`Invalid ${opts.fieldName}`);
  }
  return num;
}

export function parseEnum<T> (
  value: unknown,
  allowed: EnumLike,
  opts: { fieldName: string; default: T }
): T {
  if (value == null || value === '') return opts.default;
  if (typeof value !== 'string') {
    throw badRequest(`Invalid ${opts.fieldName}`);
  }
  if (!allowed.includes(value)) {
    throw badRequest(`Invalid ${opts.fieldName}`);
  }
  return value as unknown as T;
}
