import type {
  AchievementBadge,
  Assessment,
  CertificateRecord,
  InvoiceRecord,
  LearningPath,
  NotificationItem,
} from '@/types';

export const MOCK_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-1',
    slug: 'digital-marketing-specialist',
    title: {
      en: 'Digital Marketing Specialist Track',
      km: 'ផ្លូវសិក្សា៖ អ្នកជំនាញទីផ្សារឌីជីថល',
    },
    subtitle: {
      en: 'Go from marketing fundamentals to running measurable SEO, B2B social, and analytics campaigns.',
      km: 'រៀនពីមូលដ្ឋានគ្រឹះទីផ្សារ រហូតដល់ការដឹកនាំយុទ្ធនាការ SEO និង B2B ប្រកបដោយទិន្នន័យ។',
    },
    description: {
      en: 'Structured 3-course academy certification track built for marketers, founders, and career switchers.',
      km: 'ផ្លូវសិក្សារយៈពេល ៣ វគ្គ រៀបចំសម្រាប់អ្នកទីផ្សារ និងម្ចាស់អាជីវកម្ម។',
    },
    categorySlug: 'digital-marketing',
    level: 'beginner',
    estimatedHours: 21,
    courseIds: ['course-1', 'course-9', 'course-6'],
    badgeName: {
      en: 'Certified Growth Strategist',
      km: 'វិញ្ញាបនបត្រអ្នកយុទ្ធសាស្ត្រកំណើន',
    },
    outcomes: [
      { en: 'Architect full-funnel inbound & paid social campaigns', km: 'រៀបចំយុទ្ធនាការទីផ្សារចម្រុះឆានែល' },
      { en: 'Build executive KPI dashboards and content calendars', km: 'បង្កើតផ្ទាំង KPI និងតារាងមាតិកា' },
      { en: 'Earn the Digital Marketing Specialist Certificate', km: 'ទទួលបានវិញ្ញាបនបត្រជំនាញទីផ្សារឌីជីថល' },
    ],
    accentColor: '#2563EB',
    thumbnailTheme: 'from-blue-50 to-indigo-100 border-blue-200',
  },
  {
    id: 'path-2',
    slug: 'business-analytics-ai-operator',
    title: {
      en: 'Business Analytics & AI Operator',
      km: 'ផ្លូវសិក្សា៖ ការវិភាគអាជីវកម្ម និង AI',
    },
    subtitle: {
      en: 'Master spreadsheet analytics, financial forecasting, and practical AI productivity workflows.',
      km: 'ស្ទាត់ជំនាញ Excel ការព្យាករណ៍ហិរញ្ញវត្ថុ និង AI សម្រាប់ការងារប្រចាំថ្ងៃ។',
    },
    description: {
      en: 'Designed for analysts, managers, and SME owners turning raw operational data into fast decisions.',
      km: 'រចនាឡើងសម្រាប់អ្នកគ្រប់គ្រង និងអ្នកវិភាគទិន្នន័យអាជីវកម្ម។',
    },
    categorySlug: 'data-ai',
    level: 'beginner',
    estimatedHours: 20,
    courseIds: ['course-4', 'course-6', 'course-5'],
    badgeName: {
      en: 'Data-Driven Operations Lead',
      km: 'អ្នកដឹកនាំប្រតិបត្តិការផ្អែកលើទិន្នន័យ',
    },
    outcomes: [
      { en: 'Automate monthly sales and cash flow summaries', km: 'រៀបចំរបាយការណ៍លក់ និងសាច់ប្រាក់ដោយស្វ័យប្រវត្តិ' },
      { en: 'Apply safe AI workflows for team documentation', km: 'ប្រើប្រាស់ AI សម្រាប់របាយការណ៍ប្រកបដោយសុវត្ថិភាព' },
    ],
    accentColor: '#D97706',
    thumbnailTheme: 'from-amber-50 to-orange-100 border-amber-200',
  },
  {
    id: 'path-3',
    slug: 'modern-product-engineer',
    title: {
      en: 'Modern Product & UI Engineer',
      km: 'ផ្លូវសិក្សា៖ វិស្វករផលិតផល និង UI ទំនើប',
    },
    subtitle: {
      en: 'Combine bilingual Figma design systems with TypeScript React architecture and secure APIs.',
      km: 'ផ្សំការរចនា Figma ពីរភាសា ជាមួយស្ថាបត្យកម្ម React TypeScript និងសុវត្ថិភាព API។',
    },
    description: {
      en: 'Ideal for builders shipping production SaaS web applications end-to-end.',
      km: 'សាកសមសម្រាប់អ្នកអភិវឌ្ឍន៍កម្មវិធី SaaS ពេញលេញ។',
    },
    categorySlug: 'software-engineering',
    level: 'intermediate',
    estimatedHours: 34,
    courseIds: ['course-3', 'course-2', 'course-8'],
    badgeName: {
      en: 'Full-Cycle Product Builder',
      km: 'អ្នកបង្កើតផលិតផលឌីជីថលពេញលេញ',
    },
    outcomes: [
      { en: 'Design accessible light/dark token systems in Figma' },
      { en: 'Ship strict TypeScript React apps with verified webhook security' },
    ],
    accentColor: '#0891B2',
    thumbnailTheme: 'from-cyan-50 to-sky-100 border-cyan-200',
  },
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-excel',
    slug: 'excel-business-analytics-certification-exam',
    title: {
      en: 'Business Analytics & Excel Certification Exam',
      km: 'ការប្រឡងវិញ្ញាបនបត្រ Excel និងការវិភាគអាជីវកម្ម',
    },
    description: {
      en: 'Evaluate your mastery of clean data structures, multi-criteria formulas, and PivotTable reporting.',
      km: 'វាយតម្លៃសមត្ថភាពរបស់អ្នកលើរូបមន្តគណនា និង PivotTable។',
    },
    courseId: 'course-4',
    categorySlug: 'data-ai',
    durationMinutes: 15,
    passingScore: 75,
    dueDate: '2026-12-05',
    difficulty: 'beginner',
    certificateTitle: {
      en: 'Practical Excel & Business Analytics Certification',
      km: 'វិញ្ញាបនបត្រ Excel និងការវិភាគទិន្នន័យអាជីវកម្ម',
    },
    questions: [
      {
        id: 'ex-1',
        question: {
          en: 'Why should raw operational spreadsheets avoid merged cells inside data columns?',
          km: 'ហេតុអ្វីបានជាតារាងទិន្នន័យដើមមិនគួរបញ្ចូលក្រឡា (Merge Cells) ក្នុងជួរឈរទិន្នន័យ?',
        },
        options: [
          { en: 'Merged cells break sorting, filtering, and PivotTable grouping', km: 'វាធ្វើឱ្យការតម្រៀប Filter និង PivotTable មិនដំណើរការត្រឹមត្រូវ' },
          { en: 'Merged cells double the file size automatically', km: 'វាធ្វើឱ្យទំហំឯកសារកើនឡើងទ្វេដង' },
          { en: 'Excel formulas only work in row 1', km: 'រូបមន្ត Excel ដំណើរការតែជួរទី ១' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Tidy tabular data requires one value per cell so sorting, filters, and PivotTables parse every record reliably.',
          km: 'ទិន្នន័យស្អាតត្រូវការតម្លៃមួយក្នុងមួយក្រឡា ដើម្បីឱ្យ PivotTable និងការតម្រៀបដំណើរការត្រឹមត្រូវ។',
        },
      },
      {
        id: 'ex-2',
        question: {
          en: 'Which Excel function replaces VLOOKUP with safer default exact matching and leftward lookups?',
          km: 'តើរូបមន្តណាជំនួស VLOOKUP ដោយផ្តល់ការផ្គូផ្គងពិតប្រាកដ និងស្វែងរកទៅឆ្វេងបាន?',
        },
        options: [
          { en: 'XLOOKUP', km: 'XLOOKUP' },
          { en: 'COUNTBLANK', km: 'COUNTBLANK' },
          { en: 'LEN', km: 'LEN' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'XLOOKUP defaults to an exact match and allows independent lookup and return arrays in any column direction.',
          km: 'XLOOKUP កំណត់ការផ្គូផ្គងពិតប្រាកដជាលំនាំដើម និងអាចស្វែងរកបានគ្រប់ទិសដៅ។',
        },
      },
      {
        id: 'ex-3',
        question: {
          en: 'You need total revenue only where Region = "Phnom Penh" and Status = "Paid". Which function fits best?',
          km: 'ដើម្បីបូកសរុបចំណូលតែតំបន់ "Phnom Penh" និងស្ថានភាព "Paid" តើត្រូវប្រើរូបមន្តណា?',
        },
        options: [
          { en: 'SUMIFS', km: 'SUMIFS' },
          { en: 'AVERAGE', km: 'AVERAGE' },
          { en: 'TRIM', km: 'TRIM' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'SUMIFS evaluates multiple AND criteria across separate columns.',
          km: 'SUMIFS អាចបូកសរុបដោយផ្អែកលើលក្ខខណ្ឌច្រើនក្នុងពេលតែមួយ។',
        },
      },
      {
        id: 'ex-4',
        question: {
          en: 'What is the fastest way to let a manager filter a PivotTable by Month and Category visually?',
          km: 'តើវិធីណាលឿនបំផុតដើម្បីឱ្យអ្នកគ្រប់គ្រង Filter តារាង PivotTable តាមខែ និងប្រភេទ?',
        },
        options: [
          { en: 'Insert Slicers connected to the PivotTable', km: 'បន្ថែម Slicers ភ្ជាប់ទៅ PivotTable' },
          { en: 'Manually delete rows every Monday', km: 'លុបជួរដេកដោយដៃរៀងរាល់ថ្ងៃចន្ទ' },
          { en: 'Convert numbers to plain text', km: 'ប្តូរលេខទៅជាអក្សរធម្មតា' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'PivotTable Slicers provide clear one-click visual filtering for non-technical stakeholders.',
          km: 'Slicers ផ្តល់ប៊ូតុងចុចងាយស្រួលសម្រាប់អ្នកគ្រប់គ្រងមើលទិន្នន័យភ្លាមៗ។',
        },
      },
    ],
  },
  {
    id: 'assess-marketing',
    slug: 'digital-marketing-certification-exam',
    title: {
      en: 'Digital Marketing Fundamentals Assessment',
      km: 'ការប្រឡងមូលដ្ឋានគ្រឹះទីផ្សារឌីជីថល',
    },
    description: {
      en: 'Test your knowledge of buyer personas, inbound funnels, SEO intent, and GA4 attribution.',
      km: 'សាកល្បងចំណេះដឹងអំពី Buyer Persona, Funnel, SEO និង GA4។',
    },
    courseId: 'course-1',
    categorySlug: 'digital-marketing',
    durationMinutes: 20,
    passingScore: 75,
    dueDate: '2026-12-12',
    difficulty: 'beginner',
    certificateTitle: {
      en: 'CamcodeLearn Certified Digital Marketer',
      km: 'វិញ្ញាបនបត្រអ្នកទីផ្សារឌីជីថល CamcodeLearn',
    },
    questions: [
      {
        id: 'mk-1',
        question: {
          en: 'What is the primary purpose of UTM parameters on campaign links?',
          km: 'តើអ្វីជាគោលបំណងសំខាន់នៃ UTM Parameters លើតំណភ្ជាប់យុទ្ធនាការ?',
        },
        options: [
          { en: 'Identify exact traffic source, medium, and campaign in analytics', km: 'កំណត់ប្រភព និងយុទ្ធនាការពិតប្រាកដក្នុងប្រព័ន្ធវិភាគ' },
          { en: 'Increase server RAM capacity', km: 'បង្កើនទំហំ RAM របស់ម៉ាស៊ីនមេ' },
          { en: 'Hide the page from Google Search', km: 'លាក់ទំព័រពី Google Search' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'UTM tags pass structured attribution metadata so GA4 knows which ad or newsletter drove each conversion.',
          km: 'UTM ជួយឱ្យ GA4 ដឹងច្បាស់ថាយុទ្ធនាការណាមួយនាំមកនូវការទិញ ឬចុះឈ្មោះ។',
        },
      },
      {
        id: 'mk-2',
        question: {
          en: 'Which stage focuses on turning loyal buyers into repeat advocates?',
          km: 'តើដំណាក់កាលណាផ្តោតលើការបម្លែងអតិថិជនឱ្យត្រឡប់មកទិញម្តងទៀត?',
        },
        options: [
          { en: 'Retention & Delight', km: 'ការរក្សាអតិថិជន (Retention)' },
          { en: 'Cold Prospecting', km: 'ការស្វែងរកអតិថិជនថ្មី' },
          { en: 'Keyword Stuffing', km: 'ការបញ្ចូលពាក្យគន្លឹះច្រើនហួស' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Retention builds lifetime value (LTV) and referrals after the first purchase.',
          km: 'Retention បង្កើនតម្លៃអតិថិជនរយៈពេលវែង និងការណែនាំមិត្តភក្តិ។',
        },
      },
      {
        id: 'mk-3',
        question: {
          en: 'What does CAC stand for in growth reporting?',
          km: 'តើ CAC មានន័យដូចម្តេចក្នុងរបាយការណ៍ទីផ្សារ?',
        },
        options: [
          { en: 'Customer Acquisition Cost', km: 'ថ្លៃដើមទទួលបានអតិថិជនថ្មីម្នាក់' },
          { en: 'Creative Asset Cache', km: 'ឃ្លាំងផ្ទុករូបភាព' },
          { en: 'Content Approval Cycle', km: 'វដ្តអនុម័តមាតិកា' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'CAC measures total sales and marketing cost divided by new customers acquired.',
          km: 'CAC វាស់វែងការចំណាយសរុបធៀបនឹងចំនួនអតិថិជនថ្មីដែលទទួលបាន។',
        },
      },
      {
        id: 'mk-4',
        question: {
          en: 'Why should each landing page focus on one primary call-to-action?',
          km: 'ហេតុអ្វីបានជាទំព័រ Landing Page គួរផ្តោតលើប៊ូតុងសកម្មភាពសំខាន់តែមួយ?',
        },
        options: [
          { en: 'It reduces decision friction and improves conversion clarity', km: 'វាកាត់បន្ថយការស្ទាក់ស្ទើរ និងបង្កើនអត្រាចុះឈ្មោះ' },
          { en: 'Browsers only allow one button per domain', km: 'កម្មវិធីអ៊ីនធឺណិតអនុញ្ញាតឱ្យមានប៊ូតុងតែមួយ' },
          { en: 'It disables mobile scrolling', km: 'វាបិទការរមូរលើទូរស័ព្ទ' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Focused landing pages align message, value proof, and a single next step.',
          km: 'ទំព័រផ្តោតគោលដៅតែមួយជួយឱ្យអ្នកទស្សនាងាយសម្រេចចិត្ត។',
        },
      },
    ],
  },
  {
    id: 'assess-ai',
    slug: 'practical-ai-workflows-certification',
    title: {
      en: 'Practical AI Productivity Assessment',
      km: 'ការវាយតម្លៃការប្រើប្រាស់ AI ក្នុងការងារ',
    },
    description: {
      en: 'Confirm your ability to structure reliable prompts, verify outputs, and protect organizational data.',
      km: 'ផ្ទៀងផ្ទាត់សមត្ថភាពក្នុងការរៀបចំ Prompt ការពិនិត្យលទ្ធផល និងសុវត្ថិភាពទិន្នន័យ។',
    },
    courseId: 'course-6',
    categorySlug: 'data-ai',
    durationMinutes: 10,
    passingScore: 75,
    dueDate: '2026-12-20',
    difficulty: 'beginner',
    certificateTitle: {
      en: 'Practical AI Workflows Certification',
      km: 'វិញ្ញាបនបត្រជំនាញ AI ក្នុងការងារ',
    },
    questions: [
      {
        id: 'ai-1',
        question: { en: 'Which three elements make a business prompt reliable and repeatable?' },
        options: [
          { en: 'Clear Context, Specific Task, and Desired Output Format' },
          { en: 'All-caps urgency and zero examples' },
          { en: 'Pasting confidential customer passwords' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Context, task, and format constraints dramatically reduce vague or off-target responses.',
        },
      },
      {
        id: 'ai-2',
        question: { en: 'What should always happen before sending an AI-drafted financial or legal summary?' },
        options: [
          { en: 'Human verification against source documents' },
          { en: 'Automatic broadcast without reading' },
          { en: 'Removing all numbers' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Human review ensures factual accuracy, tone, and compliance.',
        },
      },
    ],
  },
];

export const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-1',
    credentialCode: 'CCL-2026-8492-AI',
    title: {
      en: 'Practical AI Workflows Certification',
      km: 'វិញ្ញាបនបត្រជំនាញ AI ក្នុងការងារ',
    },
    categorySlug: 'data-ai',
    courseId: 'course-6',
    assessmentId: 'assess-ai',
    issuedAt: '2026-11-12',
    instructorName: 'Dara Chea',
    hoursCompleted: 4,
    score: 95,
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-first-step',
    title: { en: 'First Milestone', km: 'ជំហានដំបូង' },
    description: { en: 'Complete your first academy lesson', km: 'បញ្ចប់មេរៀនដំបូងរបស់អ្នក' },
    xp: 100,
    icon: 'CheckCircle2',
    category: 'progress',
    unlocked: true,
    unlockedAt: '2026-11-05',
    progressCurrent: 1,
    progressTarget: 1,
  },
  {
    id: 'ach-streak-7',
    title: { en: '7-Day Learning Streak', km: 'សិក្សាជាប់គ្នា ៧ ថ្ងៃ' },
    description: { en: 'Study consistently for 7 days in a row', km: 'សិក្សាទៀងទាត់រយៈពេល ៧ ថ្ងៃជាប់គ្នា' },
    xp: 250,
    icon: 'Flame',
    category: 'consistency',
    unlocked: true,
    unlockedAt: '2026-11-18',
    progressCurrent: 7,
    progressTarget: 7,
  },
  {
    id: 'ach-certified',
    title: { en: 'Certified Learner', km: 'សិក្ខាកាមមានវិញ្ញាបនបត្រ' },
    description: { en: 'Earn your first verified academy certificate', km: 'ទទួលបានវិញ្ញាបនបត្រផ្លូវការដំបូង' },
    xp: 350,
    icon: 'Award',
    category: 'mastery',
    unlocked: true,
    unlockedAt: '2026-11-12',
    progressCurrent: 1,
    progressTarget: 1,
  },
  {
    id: 'ach-course-finisher',
    title: { en: 'Course Finisher', km: 'អ្នកបញ្ចប់វគ្គសិក្សា' },
    description: { en: 'Complete 3 full courses on CamcodeLearn', km: 'បញ្ចប់វគ្គសិក្សាពេញលេញចំនួន ៣ វគ្គ' },
    xp: 500,
    icon: 'BookOpen',
    category: 'progress',
    unlocked: false,
    progressCurrent: 1,
    progressTarget: 3,
  },
  {
    id: 'ach-path-explorer',
    title: { en: 'Path Navigator', km: 'អ្នករុករកផ្លូវសិក្សា' },
    description: { en: 'Enroll in a structured Learning Path', km: 'ចុះឈ្មោះក្នុងផ្លូវសិក្សាមានរចនាសម្ព័ន្ធ' },
    xp: 150,
    icon: 'Compass',
    category: 'exploration',
    unlocked: true,
    unlockedAt: '2026-11-10',
    progressCurrent: 1,
    progressTarget: 1,
  },
  {
    id: 'ach-quiz-master',
    title: { en: 'Assessment Pro', km: 'អ្នកពូកែប្រឡង' },
    description: { en: 'Pass 2 certification exams with 75%+', km: 'ប្រឡងជាប់វិញ្ញាបនបត្រចំនួន ២ ដោយពិន្ទុ ៧៥%+' },
    xp: 400,
    icon: 'ShieldCheck',
    category: 'mastery',
    unlocked: false,
    progressCurrent: 1,
    progressTarget: 2,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'course',
    title: { en: 'Continue where you left off', km: 'បន្តការសិក្សាពីកន្លែងចុងក្រោយ' },
    message: {
      en: 'You are 50% through "Practical Excel & Business Analytics". Jump back into Lesson 3: Pivot Dashboard.',
      km: 'អ្នកបានសិក្សា ៥០% នៃវគ្គ "ការវិភាគទិន្នន័យ Excel" ហើយ។',
    },
    createdAt: '2 hours ago',
    read: false,
    actionUrl: '/learn/practical-excel-business-analytics/c4-l3',
    actionLabel: { en: 'Resume Lesson', km: 'បន្តមេរៀន' },
  },
  {
    id: 'notif-2',
    type: 'assessment',
    title: { en: 'Upcoming Certification Exam', km: 'ការប្រឡងវិញ្ញាបនបត្រជិតមកដល់' },
    message: {
      en: 'Business Analytics & Excel Certification Exam is unlocked and ready whenever you want to earn your credential.',
      km: 'ការប្រឡងវិញ្ញាបនបត្រ Excel បើកដំណើរការហើយ។',
    },
    createdAt: '1 day ago',
    read: false,
    actionUrl: '/assessments/excel-business-analytics-certification-exam',
    actionLabel: { en: 'Start Assessment', km: 'ចាប់ផ្តើមប្រឡង' },
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: { en: 'Badge Unlocked: 7-Day Learning Streak!', km: 'ដោះសោរង្វាន់៖ សិក្សាជាប់គ្នា ៧ ថ្ងៃ!' },
    message: {
      en: 'Great consistency! You earned +250 XP for learning seven days in a row.',
      km: 'ល្អណាស់! អ្នកទទួលបាន +250 XP សម្រាប់ការសិក្សា ៧ ថ្ងៃជាប់គ្នា។',
    },
    createdAt: '3 days ago',
    read: true,
    actionUrl: '/achievements',
    actionLabel: { en: 'View Achievements', km: 'មើលសមិទ្ធផល' },
  },
  {
    id: 'notif-4',
    type: 'billing',
    title: { en: 'Invoice #INV-2026-1094 available', km: 'វិក្កយបត្រ #INV-2026-1094 រួចរាល់' },
    message: {
      en: 'Your course receipt for "Complete Digital Marketing Course" ($29.00) is ready in Membership & Billing.',
      km: 'វិក្កយបត្រសម្រាប់វគ្គសិក្សា Digital Marketing ($29.00) អាចទាញយកបានហើយ។',
    },
    createdAt: '1 week ago',
    read: true,
    actionUrl: '/membership',
    actionLabel: { en: 'View Billing', km: 'មើលការទូទាត់' },
  },
];

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-2026-1094',
    date: '2026-11-04',
    description: {
      en: 'Individual Course — Complete Digital Marketing Course',
      km: 'ទិញវគ្គសិក្សា — Complete Digital Marketing Course',
    },
    amount: 29.0,
    status: 'paid',
    method: 'KHQR / ABA Pay',
  },
];

