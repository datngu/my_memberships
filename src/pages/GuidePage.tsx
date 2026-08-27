import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { HomeScreenSteps } from '../components/HomeScreenSteps'
import loginShot from '../assets/guide/01-login.png'
import addCardShot from '../assets/guide/04-add-card-filled.png'
import cardsListShot from '../assets/guide/05-cards-list.png'
import scanShot from '../assets/guide/06-card-scan.png'

export function GuidePage() {
  const { t } = useTranslation()

  return (
    <div className="page guide-page">
      <div className="top-bar">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </div>

      <h2>{t('guide.title')}</h2>
      <p className="hint">{t('guide.subtitle')}</p>

      <section className="guide-step">
        <h3>{t('guide.step1.title')}</h3>
        <p>{t('guide.step1.body')}</p>
        <img src={loginShot} alt="" className="guide-figure" />
      </section>

      <section className="guide-step">
        <h3>{t('guide.step2.title')}</h3>
        <p>{t('guide.step2.body')}</p>
        <img src={addCardShot} alt="" className="guide-figure" />
        <img src={cardsListShot} alt="" className="guide-figure" />
      </section>

      <section className="guide-step">
        <h3>{t('guide.step3.title')}</h3>
        <p>{t('guide.step3.body')}</p>
        <HomeScreenSteps
          platformTitle={t('guide.step3.iosTitle')}
          icon="share"
          steps={[
            t('guide.step3.ios1'),
            t('guide.step3.ios2'),
            t('guide.step3.ios3'),
            t('guide.step3.ios4'),
          ]}
        />
        <HomeScreenSteps
          platformTitle={t('guide.step3.androidTitle')}
          icon="menu"
          steps={[t('guide.step3.android1'), t('guide.step3.android2'), t('guide.step3.android3')]}
        />
      </section>

      <section className="guide-step guide-tip">
        <h3>{t('guide.tip.title')}</h3>
        <p>{t('guide.tip.body')}</p>
        <img src={scanShot} alt="" className="guide-figure guide-figure-narrow" />
      </section>

      <Link to="/" className="fab">
        {t('guide.cta')}
      </Link>
    </div>
  )
}
