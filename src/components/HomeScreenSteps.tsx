function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

export function HomeScreenSteps({
  platformTitle,
  icon,
  steps,
}: {
  platformTitle: string
  icon: 'share' | 'menu'
  steps: string[]
}) {
  return (
    <div className="home-screen-platform">
      <h3>
        <span className="home-screen-platform-icon">{icon === 'share' ? <ShareIcon /> : <MenuIcon />}</span>
        {platformTitle}
      </h3>
      <ol className="home-screen-steps">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  )
}
