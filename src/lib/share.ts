export function guideUrl(): string {
  return `${window.location.origin}/guide`
}

// navigator.share opens the OS share sheet (Messages/WhatsApp/etc. on
// mobile) when available; falls back to copying the link to the clipboard
// on browsers/desktops without it (both require a secure context, which
// localhost and the Vercel HTTPS deploy both satisfy).
export async function shareGuideLink(input: { title: string; text: string }): Promise<'shared' | 'copied'> {
  const url = guideUrl()

  if (navigator.share) {
    try {
      await navigator.share({ title: input.title, text: input.text, url })
      return 'shared'
    } catch (err) {
      // AbortError just means the user closed the share sheet, not a failure.
      if (err instanceof Error && err.name === 'AbortError') return 'shared'
      throw err
    }
  }

  await navigator.clipboard.writeText(url)
  return 'copied'
}
