import type { SubscriptionPlan } from '@/types';

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    tier: 'free',
    name: { en: 'Free Learner', km: 'ឥតគិតថ្លៃ (Free)' },
    tagline: {
      en: 'Access free foundational courses, public training videos, and starter certificates.',
      km: 'សិក្សាវគ្គមូលដ្ឋានឥតគិតថ្លៃ ទស្សនាវីដេអូសាធារណៈ និងទទួលវិញ្ញាបនបត្រមូលដ្ឋាន។',
    },
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'USD',
    taxRate: 0,
    autoRenewNotice: {
      en: 'No credit card required. Free forever.',
      km: 'មិនតម្រូវឱ្យមានកាតធនាគារទេ។ ឥតគិតថ្លៃជារៀងរហូត។',
    },
    cancellationPolicy: {
      en: 'No billing commitments.',
      km: 'គ្មានកាតព្វកិច្ចបង់ប្រាក់។',
    },
    features: [
      { label: { en: 'All free academy courses', km: 'វគ្គសិក្សាឥតគិតថ្លៃទាំងអស់' }, included: true },
      { label: { en: 'Public video clinics & lesson previews', km: 'វីដេអូសាធារណៈ និងមេរៀនសាកល្បង' }, included: true },
      { label: { en: 'Course progress & personal watchlist', km: 'តាមដានវឌ្ឍនភាព និងបញ្ជីរក្សាទុក' }, included: true },
      { label: { en: 'Standard subscription video library', km: 'បណ្ណាល័យវីដេអូសមាជិកស្តង់ដារ' }, included: false },
      { label: { en: 'Premium flagship courses & exams', km: 'វគ្គសិក្សា Premium និងការប្រឡងវិញ្ញាបនបត្រ' }, included: false },
    ],
  },
  {
    id: 'plan-basic',
    tier: 'basic',
    name: { en: 'Basic Membership', km: 'សមាជិក Basic' },
    tagline: {
      en: 'Great for steady skill building with standard subscription courses and HD video clinics.',
      km: 'សាកសមសម្រាប់ការពង្រឹងជំនាញជាប្រចាំ ជាមួយវគ្គសិក្សាស្តង់ដារ និងវីដេអូ HD។',
    },
    monthlyPrice: 9,
    yearlyPrice: 86,
    currency: 'USD',
    taxRate: 0.1,
    highlighted: true,
    autoRenewNotice: {
      en: 'Auto-renews each billing cycle until cancelled.',
      km: 'បន្តដោយស្វ័យប្រវត្តិតាមវដ្តនីមួយៗរហូតដល់ការបោះបង់។',
    },
    cancellationPolicy: {
      en: 'Cancel anytime; access remains active until period end.',
      km: 'បោះបង់បានគ្រប់ពេល; សិទ្ធិនៅតែប្រើបានដល់ចុងវដ្ត។',
    },
    features: [
      { label: { en: 'All free academy courses', km: 'វគ្គសិក្សាឥតគិតថ្លៃទាំងអស់' }, included: true },
      { label: { en: 'Standard subscription video library (1080p)', km: 'បណ្ណាល័យវីដេអូស្តង់ដារ (1080p)' }, included: true },
      { label: { en: 'Selected Basic-tier career courses', km: 'វគ្គសិក្សាកម្រិត Basic ជ្រើសរើស' }, included: true },
      { label: { en: 'Downloadable workbooks & templates', km: 'ទាញយកឯកសារ និងគម្រូអនុវត្ត' }, included: true },
      { label: { en: 'Premium exclusive flagship courses', km: 'វគ្គសិក្សា Premium ផ្តាច់មុខ' }, included: false },
    ],
  },
  {
    id: 'plan-premium',
    tier: 'premium',
    name: { en: 'Premium Academy', km: 'សមាជិក Premium' },
    tagline: {
      en: 'Unlimited access to all eligible courses, structured learning paths, and verified certifications.',
      km: 'សិទ្ធិពេញលេញលើវគ្គសិក្សា ផ្លូវសិក្សា និងការប្រឡងវិញ្ញាបនបត្រទាំងអស់។',
    },
    monthlyPrice: 19,
    yearlyPrice: 182,
    currency: 'USD',
    taxRate: 0.1,
    autoRenewNotice: {
      en: 'Auto-renews each billing cycle until cancelled.',
      km: 'បន្តដោយស្វ័យប្រវត្តិតាមវដ្តនីមួយៗរហូតដល់ការបោះបង់។',
    },
    cancellationPolicy: {
      en: 'Cancel anytime; access remains active until period end.',
      km: 'បោះបង់បានគ្រប់ពេល; សិទ្ធិនៅតែប្រើបានដល់ចុងវដ្ត។',
    },
    features: [
      { label: { en: 'Everything in Basic Membership', km: 'អត្ថប្រយោជន៍ទាំងអស់ក្នុង Basic' }, included: true },
      { label: { en: 'All flagship & advanced courses included', km: 'រួមបញ្ចូលវគ្គសិក្សាកម្រិតខ្ពស់ទាំងអស់' }, included: true },
      { label: { en: 'Full Premium video library (up to 4K)', km: 'បណ្ណាល័យវីដេអូ Premium ពេញលេញ' }, included: true },
      { label: { en: 'All Learning Path exams & verified certificates', km: 'ការប្រឡងផ្លូវសិក្សា និងវិញ្ញាបនបត្រផ្លូវការ' }, included: true },
      { label: { en: 'Priority academy mentor Q&A support', km: 'ការគាំទ្រសំណួរចម្លើយពីគ្រូបង្វឹកអាទិភាព' }, included: true },
    ],
  },
];

