import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VI' },
  { code: 'no', label: 'NO' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-current={i18n.resolvedLanguage === lang.code}
          className={i18n.resolvedLanguage === lang.code ? 'lang-active' : ''}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
