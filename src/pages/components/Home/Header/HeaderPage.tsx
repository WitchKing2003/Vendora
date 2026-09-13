import React from 'react'
import { useTranslation } from 'react-i18next'
const HeaderPage = () => {
    const { t } = useTranslation()
    return (
        <div className="">
            <h1 className="text-4xl font-bold mb-4">{t('welcomeToVendora')}</h1>
            <p>
                {t('vendoraDescription')}
            </p>
        </div>
    )
}

export default HeaderPage
