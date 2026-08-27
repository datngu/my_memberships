// Forces a check for a newer service worker (the app is registered with
// registerType: 'autoUpdate' in vite.config.ts, so skipWaiting/clientsClaim
// are already on -- a fresh worker activates itself, it just doesn't repaint
// the already-loaded page). registration.update() re-fetches sw.js so a
// pending update installs+activates immediately instead of waiting for the
// browser's own periodic check, then the reload picks up the new assets.
export async function checkForAppUpdate(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.update()
    }
  }
  window.location.reload()
}
