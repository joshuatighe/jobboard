import type { Database } from '../../src/types/database.ts'

type Enums = Database['public']['Enums']

export const DEMO_PASSWORD = 'jobboard-demo'

export type SeedExperience = {
  title: string
  company: string
  location?: string
  start: string
  end?: string
  description: string
}

export type SeedSeeker = {
  email: string
  fullName: string
  headline: string
  location: string
  bio: string
  skills: string[]
  prefs: {
    locations: string[]
    remote: boolean
    minPay: number
    level: Enums['experience_level']
    types: Enums['employment_type'][]
  }
  experiences: SeedExperience[]
}

export type SeedRecruiter = {
  email: string
  fullName: string
  title: string
  company: string // company slug
}

export type SeedApplication = {
  seeker: string // email
  job: string // job key
  /** Status history after `applied`, in order. */
  path: Enums['application_status'][]
  daysAgo: number
  coverNote?: string
}

export const DEMO_SEEKER: SeedSeeker = {
  email: 'seeker@jobboard.dev',
  fullName: 'Jordan Rivera',
  headline: 'Frontend engineer who loves fast, accessible interfaces',
  location: 'San Francisco, CA',
  bio: "Frontend engineer with four years of experience building data-heavy React apps. I care about performance, accessibility and the small details that make software feel good. Looking for a product-minded team where I can own big surfaces.",
  skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind CSS', 'Postgres', 'Figma'],
  prefs: {
    locations: ['San Francisco', 'New York'],
    remote: true,
    minPay: 140_000,
    level: 'mid',
    types: ['full_time'],
  },
  experiences: [
    {
      title: 'Software Engineer II',
      company: 'Brightline Analytics',
      location: 'San Francisco, CA',
      start: '2023-03-01',
      description:
        'Lead engineer on the dashboard builder. Rebuilt the charting layer in React + TypeScript, cutting render times by 60%. Introduced a shared component library used by 4 teams.',
    },
    {
      title: 'Software Engineer',
      company: 'Pebble Commerce',
      location: 'Oakland, CA',
      start: '2021-06-01',
      end: '2023-02-28',
      description:
        'Built merchant onboarding and checkout flows in React and Node.js. Owned the GraphQL gateway and its schema.',
    },
    {
      title: 'Frontend Intern',
      company: 'Civic Labs',
      location: 'Remote',
      start: '2020-06-01',
      end: '2020-08-31',
      description: 'Shipped an accessible form builder used by city governments.',
    },
  ],
}

export const DEMO_RECRUITER: SeedRecruiter = {
  email: 'recruiter@jobboard.dev',
  fullName: 'Morgan Lee',
  title: 'Head of Talent',
  company: 'lumen-ai',
}

/** Other seekers so the demo recruiter's pipeline has candidates in it. */
export const APPLICANTS: SeedSeeker[] = [
  {
    email: 'priya.shah@example.com',
    fullName: 'Priya Shah',
    headline: 'Senior frontend engineer, design systems',
    location: 'Seattle, WA',
    bio: 'Seven years building design systems and complex web apps. Previously led frontend platform at a public SaaS company.',
    skills: ['React', 'TypeScript', 'Design Systems', 'Performance', 'Storybook'],
    prefs: { locations: ['Seattle'], remote: true, minPay: 180_000, level: 'senior', types: ['full_time'] },
    experiences: [
      {
        title: 'Senior Software Engineer',
        company: 'Northwind Cloud',
        start: '2020-01-01',
        description: 'Led the design system team; 40+ components used across 12 products.',
      },
      {
        title: 'Frontend Engineer',
        company: 'Hatch',
        start: '2017-05-01',
        end: '2019-12-31',
        description: 'Built the customer dashboard from the ground up.',
      },
    ],
  },
  {
    email: 'marcus.chen@example.com',
    fullName: 'Marcus Chen',
    headline: 'Full-stack engineer, ex-fintech',
    location: 'San Francisco, CA',
    bio: 'Full-stack engineer comfortable anywhere from Postgres to pixels. Spent three years building trading tools.',
    skills: ['React', 'TypeScript', 'Python', 'Postgres', 'GraphQL'],
    prefs: { locations: ['San Francisco'], remote: false, minPay: 150_000, level: 'mid', types: ['full_time'] },
    experiences: [
      {
        title: 'Software Engineer',
        company: 'Ledgerline',
        start: '2021-08-01',
        description: 'Built real-time portfolio views and the alerts pipeline.',
      },
    ],
  },
  {
    email: 'amara.okafor@example.com',
    fullName: 'Amara Okafor',
    headline: 'ML engineer focused on search and retrieval',
    location: 'New York, NY',
    bio: 'I build retrieval systems that hold up in production. PhD dropout, happy builder.',
    skills: ['Python', 'PyTorch', 'Search', 'LLMs', 'Kubernetes'],
    prefs: { locations: ['New York', 'San Francisco'], remote: true, minPay: 200_000, level: 'senior', types: ['full_time'] },
    experiences: [
      {
        title: 'Machine Learning Engineer',
        company: 'Indexly',
        start: '2020-09-01',
        description: 'Owned the ranking stack serving 20M queries/day.',
      },
    ],
  },
  {
    email: 'diego.morales@example.com',
    fullName: 'Diego Morales',
    headline: 'Frontend engineer and part-time designer',
    location: 'Austin, TX',
    bio: 'Frontend engineer with a design background. I like turning rough ideas into polished product.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    prefs: { locations: ['Austin'], remote: true, minPay: 130_000, level: 'mid', types: ['full_time', 'contract'] },
    experiences: [
      {
        title: 'Frontend Engineer',
        company: 'Studio Nine',
        start: '2022-01-01',
        description: 'Built marketing sites and web apps for venture-backed startups.',
      },
    ],
  },
  {
    email: 'hannah.kim@example.com',
    fullName: 'Hannah Kim',
    headline: 'New grad, CS @ state university',
    location: 'Los Angeles, CA',
    bio: 'Graduating in May. Built three full-stack side projects and interned twice. Eager to learn fast.',
    skills: ['TypeScript', 'React', 'Python', 'SQL'],
    prefs: { locations: ['Los Angeles', 'San Francisco'], remote: true, minPay: 100_000, level: 'entry', types: ['full_time', 'internship'] },
    experiences: [
      {
        title: 'Software Engineering Intern',
        company: 'Brightwave',
        start: '2025-06-01',
        end: '2025-08-31',
        description: 'Built an internal admin dashboard in React.',
      },
    ],
  },
  {
    email: 'sam.patel@example.com',
    fullName: 'Sam Patel',
    headline: 'Staff engineer, web performance',
    location: 'Remote',
    bio: 'Twelve years on the web. I make slow apps fast and help teams ship with confidence.',
    skills: ['React', 'TypeScript', 'Performance', 'Node.js', 'Leadership'],
    prefs: { locations: [], remote: true, minPay: 210_000, level: 'lead', types: ['full_time'] },
    experiences: [
      {
        title: 'Staff Engineer',
        company: 'Streamly',
        start: '2018-02-01',
        description: 'Led the web platform group; cut p75 load time in half.',
      },
    ],
  },
]

export const APPLICATIONS: SeedApplication[] = [
  // The demo seeker's tracker: one of every interesting status.
  {
    seeker: DEMO_SEEKER.email,
    job: 'lumen-frontend',
    path: ['reviewing', 'interviewing'],
    daysAgo: 3,
    coverNote: "I've spent the last two years building dense data UIs. Lumen's workspace is exactly the kind of surface I love owning.",
  },
  { seeker: DEMO_SEEKER.email, job: 'parcel-product-engineer', path: ['reviewing'], daysAgo: 2 },
  { seeker: DEMO_SEEKER.email, job: 'fernhill-fullstack', path: [], daysAgo: 1 },
  { seeker: DEMO_SEEKER.email, job: 'tandem-web', path: ['reviewing', 'rejected'], daysAgo: 5 },
  {
    seeker: DEMO_SEEKER.email,
    job: 'kite-design-engineer',
    path: ['reviewing', 'interviewing', 'offer'],
    daysAgo: 2,
    coverNote: 'Design engineering is my sweet spot. I would love to help build your token pipeline.',
  },

  // Candidates in the demo recruiter's pipeline (Lumen AI).
  { seeker: 'priya.shah@example.com', job: 'lumen-senior-frontend', path: ['reviewing', 'interviewing'], daysAgo: 5 },
  { seeker: 'sam.patel@example.com', job: 'lumen-senior-frontend', path: ['reviewing'], daysAgo: 4 },
  { seeker: 'diego.morales@example.com', job: 'lumen-senior-frontend', path: [], daysAgo: 1 },
  { seeker: 'marcus.chen@example.com', job: 'lumen-frontend', path: ['reviewing'], daysAgo: 2 },
  { seeker: 'diego.morales@example.com', job: 'lumen-frontend', path: [], daysAgo: 1 },
  { seeker: 'hannah.kim@example.com', job: 'lumen-frontend', path: ['rejected'], daysAgo: 3 },
  {
    seeker: 'amara.okafor@example.com',
    job: 'lumen-ml-engineer',
    path: ['reviewing', 'interviewing', 'offer'],
    daysAgo: 9,
    coverNote: 'Retrieval over long financial documents is exactly the problem I want to work on next.',
  },
  { seeker: 'hannah.kim@example.com', job: 'lumen-intern', path: ['reviewing', 'interviewing', 'offer'], daysAgo: 38 },

  // A little activity elsewhere so other companies' postings aren't empty.
  { seeker: 'marcus.chen@example.com', job: 'parcel-product-engineer', path: ['reviewing'], daysAgo: 1 },
  { seeker: 'priya.shah@example.com', job: 'quarry-founding-frontend', path: [], daysAgo: 1 },
  { seeker: 'hannah.kim@example.com', job: 'orbital-junior', path: [], daysAgo: 1 },
]
