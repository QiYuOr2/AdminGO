import { Button } from '@ago/ui'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t('welcome')}</h1>
      <p>{t('hello')}</p>

      <div className="mt-4">
        <Button variant="outline" onClick={() => changeLanguage('en')} className="mr-2">
          English
        </Button>
        <Button onClick={() => changeLanguage('zh')}>
          中文
        </Button>
      </div>
    </div>
  )
}

export default App
