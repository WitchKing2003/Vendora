import { useTranslation } from 'react-i18next';
import ButtonCustom from '../ButtonComponent/ButtonCustom';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-switcher flex gap-2">
            <ButtonCustom
                variant="raw"
                onClick={() => changLanguage('vi')}
                className={`text-sm transition-colors ${i18n.language === 'vi' ? 'font-bold text-gold' : 'text-ink/70 hover:text-gold'}`}
            >
                VI
            </ButtonCustom>
            <ButtonCustom
                variant="raw"
                onClick={() => changLanguage('en')}
                className={`text-sm transition-colors ${i18n.language === 'en' ? 'font-bold text-gold' : 'text-ink/70 hover:text-gold'}`}
            >
                EN
            </ButtonCustom>
        </div>
    )
}

export default LanguageSwitcher;
