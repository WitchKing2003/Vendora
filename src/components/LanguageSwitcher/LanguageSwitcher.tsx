import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-switcher">
            <button onClick={() => changLanguage('vi')}>VI</button>
            <button onClick={() => changLanguage('en')}>EN</button>
        </div>
    )
}

export default LanguageSwitcher;
