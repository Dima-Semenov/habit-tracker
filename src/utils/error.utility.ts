export function parseError(error: unknown): {
  field?: string;
  message: string;
} {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message);
      return parsed;
    } catch {
      return { message: error.message };
    }
  }
  return { message: 'Unknown error' };
}
