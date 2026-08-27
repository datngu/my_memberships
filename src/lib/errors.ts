// Supabase/PostgREST errors are plain objects with a `message` field, not JS
// Error instances, so `err instanceof Error` misses them and falls through
// to `String(err)` (renders as "[object Object]").
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
    return err.message
  }
  return String(err)
}
