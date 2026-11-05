/**
 * Content configuration for the Services Page (/services)
 * Digital Custard
 */

export const servicesMetadata = {
  title: "Services | Digital Custard",
  description:
    "Explore AI, IT development, web and mobile solutions, branding, and digital marketing services by Digital Custard.",
};

export const servicesHeroContent = {
  eyebrow: "What We Do",
  title: "Technology, Creativity",
  titleEm: "and Growth.",
  lead: "We combine smart technology, creative thinking, and digital strategies to help businesses grow and succeed.",
  primaryCta: {
    label: "Get Started",
    href: "/contact",
  },
  secondaryCta: {
    label: "Explore Services",
    href: "#ai",
  },
  visual: {
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85",
    alt: "Creative professionals planning a project",
    badgeLine1: "One Partner",
    badgeLine2: "Endless Possibilities",
  },
};

export const servicePanels = [
  {
    id: "ai",
    className: "panel-ai",
    num: "01",
    pill: "01 / AI & Automation",
    title: "AI Services &",
    titleEm: "Smart Solutions",
    desc: "We use the power of AI and automation to simplify workflows, improve decisions, and create smarter business solutions.",
    cta: "Explore AI Solutions",
    ctaHref: "/services/ai",
    items: [
      {
        title: "Generative AI Solutions",
        desc: "Build intelligent AI solutions for content creation, automation, and business productivity.",
        chips: ["LLM Integration", "AI Automation"],
      },
      {
        title: "Agentic AI & Workflows",
        desc: "Automate complex tasks with AI agents that work, analyze, and make decisions.",
        chips: ["AI Agents", "Smart Workflows"],
      },
      {
        title: "Data Intelligence",
        desc: "Turn business data into useful insights with analytics and predictive solutions.",
        chips: ["Data Analytics", "Predictive Models"],
      },
    ],
  },

  {
    id: "it",
    className: "panel-it",
    num: "02",
    pill: "02 / IT & Development",
    title: "IT Solutions &",
    titleEm: "Digital Products",
    desc: "From websites to powerful applications, we build reliable and scalable digital products that support your business growth.",
    cta: "Build Your Product",
    ctaHref: "/services/it",
    items: [
      {
        title: "Product Development",
        desc: "Turn your ideas into practical digital products, from planning to launch.",
        chips: ["Product Strategy", "MVP Development"],
      },
      {
        title: "Web Development",
        desc: "Create modern, responsive, and high-performing websites and web applications.",
        chips: ["React & Next.js", "Web Applications"],
      },
      {
        title: "UI/UX Design",
        desc: "Design clean, attractive, and user-friendly digital experiences.",
        chips: ["UX Research", "Creative Design"],
      },
      {
        title: "Mobile App Development",
        desc: "Build powerful mobile applications for Android and iOS platforms.",
        chips: ["Android & iOS", "Cross-Platform"],
      },
      {
        title: "ERP & CRM Development",
        desc: "Simplify business operations with custom ERP and CRM management solutions.",
        chips: ["Custom ERP", "CRM Solutions"],
      },
    ],
  },

  {
    id: "marketing",
    className: "panel-marketing",
    num: "03",
    pill: "03 / Digital Marketing",
    title: "Digital Marketing &",
    titleEm: "Brand Growth",
    desc: "We help brands build a strong online presence, reach the right audience, and turn digital engagement into business growth.",
    cta: "Grow Your Brand",
    ctaHref: "/services/marketing",
    items: [
      {
        title: "Content & Copywriting",
        desc: "Create engaging content that communicates your brand message effectively.",
        chips: ["Content Strategy", "Copywriting"],
      },
      {
        title: "Brand Identity & Strategy",
        desc: "Build a unique brand identity with creative logos and consistent visual designs.",
        chips: ["Logo Design", "Brand Identity"],
      },
      {
        title: "Search Engine Optimization",
        desc: "Improve your website visibility and attract more organic traffic through SEO.",
        chips: ["Technical SEO", "Organic Growth"],
      },
      {
        title: "Performance Marketing",
        desc: "Reach potential customers through targeted Google, Meta, and paid ad campaigns.",
        chips: ["Google Ads", "Meta Ads"],
      },
      {
        title: "Social Media Marketing",
        desc: "Grow your brand through creative social media content, reels, and campaigns.",
        chips: ["Social Media", "Video Marketing"],
      },
    ],
  },
];

export const servicesProcessContent = {
  eyebrow: "How We Work",
  title: "Our Process",
  lead: "A simple and effective approach to turn ideas into successful solutions.",
  steps: [
    {
      num: "01",
      title: "Discovery",
      desc: "We understand your business, goals, and requirements.",
    },
    {
      num: "02",
      title: "Strategy",
      desc: "We create the right plan for your business needs.",
    },
    {
      num: "03",
      title: "Execution",
      desc: "We bring your ideas to life with quality solutions.",
    },
    {
      num: "04",
      title: "Optimization",
      desc: "We monitor results and continuously improve.",
    },
  ],
};

export const servicesCtaContent = {
  title: "Ready to Grow Your Business?",
  text: "Let's find the right digital solutions to move your business forward.",
  label: "Let's Connect",
  href: "/contact",
};
