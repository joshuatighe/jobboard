export type SeedCompany = {
  slug: string
  name: string
  tagline: string
  description: string
  headquarters: string
  size: string
  website: string
}

export const COMPANIES: SeedCompany[] = [
  {
    slug: 'lumen-ai',
    name: 'Lumen AI',
    tagline: 'AI copilots for financial analysts',
    description:
      'Lumen builds AI copilots that read filings, models and market data so analysts can spend their time on judgement instead of copy-paste. Series B, backed by top-tier investors.',
    headquarters: 'San Francisco, CA',
    size: '51–200',
    website: 'https://lumen.example.com',
  },
  {
    slug: 'parcel',
    name: 'Parcel',
    tagline: 'The shipping API for modern commerce',
    description:
      'Parcel gives e-commerce brands one API for rates, labels and tracking across every carrier. Millions of packages a day flow through our platform.',
    headquarters: 'San Francisco, CA',
    size: '201–500',
    website: 'https://parcel.example.com',
  },
  {
    slug: 'fernhill-health',
    name: 'Fernhill Health',
    tagline: 'Primary care that fits in your pocket',
    description:
      'Fernhill is a virtual-first primary care practice. Our clinicians and engineers work side by side to make great care faster and more affordable.',
    headquarters: 'New York, NY',
    size: '201–500',
    website: 'https://fernhill.example.com',
  },
  {
    slug: 'quarry',
    name: 'Quarry',
    tagline: 'Data pipelines that test themselves',
    description:
      'Quarry is a developer tool for building reliable data pipelines with built-in testing, lineage and alerting. Fully remote, async-first team.',
    headquarters: 'Remote',
    size: '11–50',
    website: 'https://quarry.example.com',
  },
  {
    slug: 'tandem',
    name: 'Tandem',
    tagline: 'Banking built for two',
    description:
      'Tandem is a shared bank account and money app for couples. Joint goals, shared cards and fair-split budgeting in one place.',
    headquarters: 'New York, NY',
    size: '51–200',
    website: 'https://tandem.example.com',
  },
  {
    slug: 'orbital',
    name: 'Orbital',
    tagline: 'Freight visibility from orbit',
    description:
      'Orbital fuses satellite, IoT and carrier data into real-time tracking for global freight. Logistics teams use us to see delays before they happen.',
    headquarters: 'Austin, TX',
    size: '51–200',
    website: 'https://orbital.example.com',
  },
  {
    slug: 'basalt-security',
    name: 'Basalt Security',
    tagline: 'Cloud security without the alert fatigue',
    description:
      'Basalt continuously maps cloud infrastructure and ranks real attack paths, so security teams fix what matters first.',
    headquarters: 'Boston, MA',
    size: '51–200',
    website: 'https://basalt.example.com',
  },
  {
    slug: 'kite-and-co',
    name: 'Kite & Co',
    tagline: 'Design systems, generated',
    description:
      'Kite & Co turns brand guidelines into production-ready design systems for web and mobile. Small team, big craft energy.',
    headquarters: 'Los Angeles, CA',
    size: '11–50',
    website: 'https://kite.example.com',
  },
]
