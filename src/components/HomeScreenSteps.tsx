// Illustrated mockups of the "Add to Home Screen" flow. Real Safari/Chrome
// UI is native OS chrome, not page content, so it can't be screenshotted --
// these are schematic approximations (generic icons, not Apple/Google
// assets) good enough to show *where to tap*, not a pixel-perfect copy.
import type { ReactNode } from 'react'

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

function PlusSquareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  )
}

function StepFigure({
  number,
  caption,
  children,
}: {
  number: number
  caption: string
  children: ReactNode
}) {
  return (
    <li className="figure-step">
      <div className="mock-frame">
        <span className="figure-step-badge">{number}</span>
        <div className="mock-frame-inner">{children}</div>
      </div>
      <p>{caption}</p>
    </li>
  )
}

function ToolbarFigure({ icon }: { icon: 'share' | 'menu' }) {
  return (
    <div className="mock-toolbar">
      <span className="mock-url-pill" />
      <span className="mock-icon-highlight">{icon === 'share' ? <ShareIcon /> : <MenuIcon />}</span>
    </div>
  )
}

function ShareSheetFigure({ label }: { label: string }) {
  return (
    <div className="mock-sheet">
      <div className="mock-sheet-handle" />
      <div className="mock-sheet-icons-row">
        <span className="mock-sheet-icon" />
        <span className="mock-sheet-icon" />
        <span className="mock-sheet-icon" />
      </div>
      <div className="mock-sheet-row mock-highlight">
        <PlusSquareIcon />
        {label}
      </div>
      <div className="mock-sheet-row" />
    </div>
  )
}

function DropdownMenuFigure({ label }: { label: string }) {
  return (
    <div className="mock-dropdown">
      <div className="mock-dropdown-row" />
      <div className="mock-dropdown-row mock-highlight">
        <PlusSquareIcon />
        {label}
      </div>
      <div className="mock-dropdown-row" />
    </div>
  )
}

function AddConfirmFigure({ addLabel, appName }: { addLabel: string; appName: string }) {
  return (
    <div className="mock-dialog">
      <div className="mock-dialog-header">
        <span className="mock-dialog-cancel" />
        <span className="mock-dialog-btn mock-highlight">{addLabel}</span>
      </div>
      <div className="mock-dialog-body">
        <span className="mock-app-icon" />
        <span>{appName}</span>
      </div>
    </div>
  )
}

export function HomeScreenSteps({
  platformTitle,
  icon,
  intro,
  addToHomeLabel,
  addLabel,
  appName,
  tapIconCaption,
  tapAddCaption,
  tapConfirmCaption,
}: {
  platformTitle: string
  icon: 'share' | 'menu'
  intro: string
  addToHomeLabel: string
  addLabel?: string
  appName: string
  tapIconCaption: string
  tapAddCaption: string
  tapConfirmCaption?: string
}) {
  return (
    <div className="home-screen-platform">
      <h3>
        <span className="home-screen-platform-icon">{icon === 'share' ? <ShareIcon /> : <MenuIcon />}</span>
        {platformTitle}
      </h3>
      <p className="hint">{intro}</p>
      <ol className="figure-steps">
        <StepFigure number={1} caption={tapIconCaption}>
          <ToolbarFigure icon={icon} />
        </StepFigure>
        <StepFigure number={2} caption={tapAddCaption}>
          {icon === 'share' ? (
            <ShareSheetFigure label={addToHomeLabel} />
          ) : (
            <DropdownMenuFigure label={addToHomeLabel} />
          )}
        </StepFigure>
        {tapConfirmCaption && (
          <StepFigure number={3} caption={tapConfirmCaption}>
            <AddConfirmFigure addLabel={addLabel ?? ''} appName={appName} />
          </StepFigure>
        )}
      </ol>
    </div>
  )
}
