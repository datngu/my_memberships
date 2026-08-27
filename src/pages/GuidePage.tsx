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
          intro={t('guide.step3.iosIntro')}
          addToHomeLabel={t('guide.step3.addToHomeScreenLabel')}
          addLabel={t('guide.step3.addButtonLabel')}
          appName={t('app.title')}
          tapIconCaption={t('guide.step3.iosTapShare')}
          tapAddCaption={t('guide.step3.iosTapAdd')}
          tapConfirmCaption={t('guide.step3.iosTapConfirm')}
        />
        <HomeScreenSteps
          platformTitle={t('guide.step3.androidTitle')}
          icon="menu"
          intro={t('guide.step3.androidIntro')}
          addToHomeLabel={t('guide.step3.addToHomeScreenLabelAndroid')}
          addLabel={t('guide.step3.installButtonLabel')}
          appName={t('app.title')}
          tapIconCaption={t('guide.step3.androidTapMenu')}
          tapAddCaption={t('guide.step3.androidTapAdd')}
          tapConfirmCaption={t('guide.step3.androidTapConfirm')}
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
