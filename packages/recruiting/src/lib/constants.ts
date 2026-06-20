export const TECHNOLOGIES = [
  'html',
  'css',
  'javascript',
  'typescript',
  'react',
  'vue',
  'svelte',
  'nodejs',
  'python',
  'php',
  'sql'
] as const;

export type Technology = typeof TECHNOLOGIES[number];

export const PILLARS = {
  html: ['semantic', 'accessibility', 'forms', 'seo', 'document'],
  css: ['layout', 'responsive', 'architecture', 'animations', 'performance'],
  javascript: ['fundamentals', 'async', 'dom', 'problem_solving', 'code_quality'],
  typescript: ['type_system', 'generics', 'interfaces', 'architecture', 'maintainability'],
  react: ['components', 'state', 'hooks', 'performance', 'architecture'],
  vue: ['components', 'state', 'directives', 'performance', 'architecture'],
  svelte: ['components', 'stores', 'reactivity', 'performance', 'build'],
  nodejs: ['api', 'security', 'auth', 'scalability', 'error_handling'],
  python: ['api', 'security', 'async', 'scalability', 'error_handling'],
  php: ['api', 'security', 'auth', 'scalability', 'error_handling'],
  sql: ['schema', 'optimization', 'indexing', 'normalization', 'integrity']
} as const;

export const RECOMMENDATIONS = {
  'Strong Hire': { label: 'Strong Hire', color: 'bg-green-500', textColor: 'text-green-50' },
  'Hire': { label: 'Hire', color: 'bg-blue-500', textColor: 'text-blue-50' },
  'Consider': { label: 'Consider', color: 'bg-yellow-500', textColor: 'text-yellow-50' },
  'Reject': { label: 'Reject', color: 'bg-red-500', textColor: 'text-red-50' }
};

export const SENIORITY_LEVELS = {
  junior: { label: 'Junior', color: 'bg-blue-500' },
  mid: { label: 'Mid', color: 'bg-green-500' },
  senior: { label: 'Senior', color: 'bg-purple-500' },
  lead: { label: 'Lead', color: 'bg-pink-500' }
};

export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/web';
