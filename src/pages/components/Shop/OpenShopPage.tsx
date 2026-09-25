import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ButtonCustom from '../../../components/ButtonComponent/ButtonCustom';
import Icon, { type IconName } from '../../../components/brand/Icon';
import { Kicker, Seal, StitchRule } from '../../../components/brand/Stitch';
import { CATEGORY_DEFS } from '../../../data/categoryData';
import { CATEGORY_ICON } from '../../../data/categoryMeta';
import { useToastStore } from '../../../stores/toastStore';

const BENEFITS: { icon: IconName; key: string }[] = [
  { icon: 'stall', key: 'openshop.benefit1' },
  { icon: 'thread', key: 'openshop.benefit2' },
  { icon: 'truck', key: 'openshop.benefit3' },
  { icon: 'shield', key: 'openshop.benefit4' },
];

/**
 * "Open a stall" — the other half of the marketplace, given the same brand
 * care as the storefront. A short form, honest benefits, no dark patterns.
 */
const OpenShopPage = () => {
  const { t } = useTranslation();
  const pushToast = useToastStore((s) => s.push);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(CATEGORY_DEFS[7].slug);
  const [story, setStory] = useState('');

  const canSubmit = name.trim().length > 1 && /.+@.+\..+/.test(email);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    pushToast({
      tone: 'success',
      title: t('openshop.submittedTitle', 'Đã nhận đơn mở gian hàng'),
      message: t('openshop.submittedMessage', {
        name: name.trim(),
        defaultValue: 'Cảm ơn {{name}} — đội ngũ Vendora sẽ liên hệ trong 2 ngày làm việc.',
      }),
      icon: 'stall',
    });
    setName('');
    setEmail('');
    setStory('');
  };

  const field =
    'mt-1.5 w-full border border-line bg-surface px-3.5 py-2.5 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold';

  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-ink text-white">
        <span aria-hidden className="loom loom-light absolute inset-0" />
        <span
          aria-hidden
          className="absolute -right-24 -top-24 h-72 w-72 rotate-45 border border-gold/20"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-10 lg:py-20">
          <div>
            <Kicker tone="light">{t('openshop.kicker', 'Dành cho nhà bán')}</Kicker>
            <h1 className="mt-4 max-w-xl font-display text-3xl leading-[1.08] tracking-[-0.02em] sm:text-5xl">
              {t('openshop.title', 'Dựng gian hàng của bạn trong phiên chợ Vendora')}
            </h1>
            <p className="mt-5 max-w-lg font-body text-sm leading-relaxed text-white/70 sm:text-base">
              {t(
                'openshop.desc',
                'Một gian hàng nhỏ, một câu chuyện riêng. Chúng tôi lo phần vận chuyển, thanh toán và bảo vệ người mua để bạn chỉ cần làm ra sản phẩm thật tốt.'
              )}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Seal tone="gold" rotate={-4}>
                {t('openshop.badge', 'Miễn phí 3 tháng đầu')}
              </Seal>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.14em] text-gold-soft transition-colors hover:text-white"
              >
                {t('openshop.previewStalls', 'Xem các gian hàng đang bán')}
                <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Application card */}
          <form
            onSubmit={submit}
            className="brand-frame relative border border-line bg-surface p-5 text-ink shadow-float sm:p-7"
          >
            <h2 className="font-display text-2xl text-ink">
              {t('openshop.formTitle', 'Đăng ký mở gian hàng')}
            </h2>
            <p className="mt-2 font-body text-sm text-ink/60">
              {t('openshop.formDesc', 'Mất khoảng một phút. Chúng tôi sẽ liên hệ lại để duyệt.')}
            </p>

            <StitchRule className="my-5" />

            <label className="block font-body text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
              {t('openshop.shopName', 'Tên gian hàng')}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('openshop.shopNamePlaceholder', 'Ví dụ: Gốm Nhà')}
                className={field}
              />
            </label>

            <label className="mt-4 block font-body text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
              {t('openshop.email', 'Email liên hệ')}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
                className={field}
              />
            </label>

            <label className="mt-4 block font-body text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
              {t('openshop.category', 'Nhóm hàng chính')}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${field} flex items-center`}
              >
                {CATEGORY_DEFS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {t(c.labelKey)}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block font-body text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
              {t('openshop.story', 'Giới thiệu ngắn')}
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={3}
                placeholder={t(
                  'openshop.storyPlaceholder',
                  'Bạn làm gì, ở đâu, và điều gì khiến sản phẩm của bạn khác biệt?'
                )}
                className={`${field} resize-none`}
              />
            </label>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-gold-deep">
                <Icon name={CATEGORY_ICON[category] ?? 'stall'} className="h-5 w-5" />
              </span>
              <ButtonCustom
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!canSubmit}
                className="rounded-none"
              >
                {t('openshop.submit', 'Gửi đăng ký')}
              </ButtonCustom>
            </div>

            <p className="mt-3 font-body text-[11px] leading-relaxed text-ink/45">
              {t(
                'openshop.privacy',
                'Bằng việc gửi, bạn đồng ý để Vendora liên hệ về đơn đăng ký này.'
              )}
            </p>
          </form>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <div key={b.key} className="brand-frame relative border border-line bg-surface p-5">
              <span className="flex h-11 w-11 items-center justify-center bg-ink text-gold-soft">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-lg text-ink">
                {t(`${b.key}.title`, { defaultValue: `Lợi ích ${i + 1}` })}
              </p>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink/60">
                {t(`${b.key}.desc`, { defaultValue: '' })}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OpenShopPage;
