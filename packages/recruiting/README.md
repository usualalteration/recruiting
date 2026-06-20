# Recruiting Web Application

Full-stack recruiting web application using SvelteKit (frontend) and Nuvolaris OpenWhisk serverless functions (backend).

## Overview

The system evaluates developer candidates across multiple technologies and produces scoring, rankings, and recruiter insights. All business logic is implemented as Nuvolaris serverless functions, with the frontend purely acting as a presentation layer that consumes the API.

## Architecture

```
Frontend (SvelteKit) → Nuvolaris API Gateway → Serverless Functions → Database
```

### Frontend Stack
- **SvelteKit**: Modern frontend framework with TypeScript
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components

### Backend Stack
- **Nuvolaris**: Apache OpenWhisk-based serverless platform
- **PostgreSQL**: External database (accessed only through serverless functions)
- **Python**: Serverless function language

## Key Features

### For Candidates
- Multi-technology assessment across 11 technologies
- 5 evaluation pillars per technology (0-20 scoring)
- Real-time progress tracking
- Detailed results and compatibility score
- Strengths and weaknesses analysis
- Improvement suggestions

### For Recruiters
- Candidate ranking dashboard
- Filtering by score and technology
- Detailed candidate profiles
- AI-powered insights generation
- Risk analysis
- Interview focus areas
- Recommendation engine

## Technologies Evaluated

Each technology is evaluated using 5 pillars (0-20 points per pillar, 0-100 total):

### Frontend Technologies
- **HTML**: Semantic structure, Accessibility, Forms, SEO, Document structure
- **CSS**: Layout (Flexbox/Grid), Responsive design, Architecture, Animations, Performance
- **JavaScript**: Language fundamentals, Async programming, DOM manipulation, Problem solving, Code quality
- **TypeScript**: Type system, Generics, Interfaces, Architecture, Maintainability

### Frameworks
- **React**: Components, State management, Reactivity/hooks, Performance, Architecture
- **Vue**: Components, State, Directives, Performance, Architecture
- **Svelte**: Components, Stores, Reactivity, Performance, Build

### Backend Technologies
- **Node.js**: API design, Security, Authentication, Scalability, Error handling
- **Python**: API, Security, Async, Scalability, Error handling
- **PHP**: API, Security, Auth, Scalability, Error handling

### Database
- **SQL**: Schema design, Query optimization, Indexing, Normalization, Data integrity

## Scoring System

### Compatibility Score (0-100)
Computed based on:
- Technical skills (weighted 60%)
- Consistency across technologies (weighted 10%)
- Seniority estimation (weighted 20%)
- Learning potential (weighted 10%)

### Recommendations
- **90-100**: Strong Hire
- **75-89**: Hire
- **60-74**: Consider
- **<60**: Reject

### Seniority Levels
- **Junior**: 0-40 average score
- **Mid**: 40-60 average score
- **Senior**: 60-80 average score
- **Lead**: 80+ average score

## Backend API Endpoints

All endpoints are served through Nuvolaris serverless functions:

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Candidate
- `POST /api/v1/candidate/get` - Get candidate profile
- `POST /api/v1/candidate/profile` - Get candidate assessment results

### Assessment
- `POST /api/v1/assessment/submit` - Submit assessment answers
- `POST /api/v1/assessment/evaluate` - Get assessment evaluation

### Recruiter
- `POST /api/v1/ranking/get` - Get candidate rankings
- `POST /api/v1/recruiter/insights` - Get candidate insights

### Analytics
- `GET /api/v1/analytics/overview` - Get analytics overview

## Project Structure

```
recruiting/
├── packages/
│   └── recruiting/
│       ├── src/
│       │   ├── lib/
│       │   │   ├── api.ts              # Nuvolaris API client
│       │   │   ├── constants.ts        # Constants and configurations
│       │   │   ├── types.ts            # TypeScript type definitions
│       │   │   └── supabase.ts         # Database client (for reference)
│       │   └── routes/
│       │       ├── +page.svelte        # Landing page
│       │       ├── login.svelte        # Login page
│       │       ├── register.svelte     # Registration page
│       │       └── candidate/
│       │           ├── dashboard.svelte      # Candidate dashboard
│       │           ├── assessment.svelte     # Assessment submission
│       │           └── results/
│       │               └── [id].svelte       # Assessment results
│       │       └── recruiter/
│       │           ├── dashboard.svelte      # Recruiter dashboard
│       │           └── candidate/
│       │               └── [id].svelte       # Candidate details
│       ├── svelte.config.js              # SvelteKit configuration
│       ├── vite.config.ts                # Vite configuration
│       ├── tsconfig.json                 # TypeScript configuration
│       └── package.json                  # Frontend dependencies

└── .ops/
    └── packages/
        ├── v1/                          # Public API package
        │   ├── auth/
        │   │   ├── login/
        │   │   │   └── action.py        # Login endpoint
        │   │   ├── register/
        │   │   │   └── action.py        # Registration endpoint
        │   │   ├── lib.py               # Auth utilities
        │   │   ├── jwt.py               # JWT utilities
        │   │   └── requirements.txt     # Python dependencies
        │   ├── candidate/
        │   │   ├── get/
        │   │   │   └── action.py        # Get candidate profile
        │   │   ├── profile/
        │   │   │   └── action.py        # Get candidate profile
        │   │   └── requirements.txt
        │   ├── assessment/
        │   │   ├── submit/
        │   │   │   └── action.py        # Submit assessment
        │   │   ├── evaluate/
        │   │   │   └── action.py        # Evaluate assessment
        │   │   └── requirements.txt
        │   ├── ranking/
        │   │   ├── get/
        │   │   │   └── action.py        # Get rankings
        │   │   └── requirements.txt
        │   ├── recruiter/
        │   │   ├── insights/
        │   │   │   └── action.py        # Get insights
        │   │   └── requirements.txt
        │   └── analytics/
        │       ├── overview/
        │       │   └── action.py        # Analytics overview
        │       └── requirements.txt
        └── setup/
            └── database/
                └── action.py            # Database schema setup
```

## Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'candidate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### assessments
```sql
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### technology_scores
```sql
CREATE TABLE technology_scores (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id) ON DELETE CASCADE,
    technology VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL
);
```

#### pillar_scores
```sql
CREATE TABLE pillar_scores (
    id SERIAL PRIMARY KEY,
    technology_score_id INTEGER REFERENCES technology_scores(id) ON DELETE CASCADE,
    pillar VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL
);
```

#### compatibility
```sql
CREATE TABLE compatibility (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    recommendation VARCHAR(255) NOT NULL,
    seniority VARCHAR(50) NOT NULL,
    strengths TEXT[],
    weaknesses TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Installation

### Prerequisites
- Node.js 18+
- Nuvolaris account
- PostgreSQL database
- Python 3.8+

### Frontend Setup

```bash
cd packages/recruiting
npm install
npm run dev
```

### Backend Setup

```bash
# Install Nuvolaris CLI (if not installed)
# Set up database
ops ide setup

# Deploy actions (automatically handled)
```

## Environment Variables

Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080/web
JWT_SECRET=your-secret-key
OPS_USER=your-username
OPS_PASSWORD=your-password
```

## Usage

### For Candidates

1. Register an account
2. Complete the assessment (11 technologies × 5 pillars each)
3. View results and insights
4. See strengths and improvement areas

### For Recruiters

1. Register with recruiter role
2. View candidate rankings
3. Filter by score, technology, or seniority
4. View detailed candidate profiles
5. Get AI-powered insights and recommendations

## Development

### Adding New Technologies

1. Update `TECHNOLOGIES` in `src/lib/constants.ts`
2. Add pillar definitions in `PILLARS`
3. Update database schema if needed

### Adding New Features

1. Create new serverless function in `.ops/packages/v1/`
2. Add API client methods in `src/lib/api.ts`
3. Create frontend pages in `src/routes/`

## Security

- All database access goes through serverless functions
- Frontend never directly accesses the database
- JWT-based authentication
- Role-based access control
- Passwords hashed using PBKDF2 with 100,000 iterations
- Input validation on all endpoints

## Deployment

### Frontend (SvelteKit)

```bash
cd packages/recruiting
npm run build
```

### Backend (Nuvolaris)

Backend deployment is automatic when you deploy the application. The serverless functions are deployed and configured automatically.

## API Examples

### Login
```typescript
const response = await client.login(email, password);
// Returns: { success: true, token: string, user: User }
```

### Submit Assessment
```typescript
const answers = {
  html: [15, 18, 12, 16, 14],
  css: [18, 15, 12, 10, 14],
  // ... other technologies
};
const response = await client.submitAssessment(userId, answers, token);
// Returns: { success: true, assessment_id: number, compatibility_score: number }
```

### Get Rankings
```typescript
const response = await client.getRanking({ min_score: 70 });
// Returns: { candidates: CandidateRanking[] }
```

## Testing

### Manual Testing Flow

1. Register as a candidate
2. Complete the full assessment
3. View results
4. Register as a recruiter
5. View candidate rankings
6. Check candidate insights

## Troubleshooting

### Frontend Issues
- Check that `VITE_API_BASE_URL` is correct
- Ensure Nuvolaris actions are deployed
- Verify CORS configuration

### Backend Issues
- Check database connection
- Verify PostgreSQL schema is set up
- Check action logs for errors

## License

MIT License

## Support

For issues and questions, please refer to the project documentation or contact the development team.