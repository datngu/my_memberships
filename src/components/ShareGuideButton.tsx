import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { shareGuideLink } from '../lib/share'

export function ShareGuideButton({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    const result = await shareGuideLink({
      title: t('app.title'),
      text: t('share.text'),
    })
    if (result === 'copied') {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {copied ? t('share.copied') : t('share.button')}
    </button>
  )
}
