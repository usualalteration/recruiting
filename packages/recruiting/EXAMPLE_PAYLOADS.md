# Example API Payloads

This document contains example request and response payloads for the Recruiting Web Application API.

## Authentication Endpoints

### Login

**Request:**
```json
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "candidate@example.com",
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "candidate@example.com",
    "role": "candidate"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials"
}
```

### Register

**Request:**
```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword456",
  "role": "candidate"
}
```

**Success Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "candidate"
  }
}
```

## Candidate Endpoints

### Get Candidate Profile

**Request:**
```json
POST /api/v1/candidate/get
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "candidate@example.com",
    "role": "candidate"
  }
}
```

### Get Candidate Profile with Assessment

**Request:**
```json
POST /api/v1/candidate/profile
Content-Type: application/json

{
  "candidate_id": 1
}
```

**Success Response:**
```json
{
  "success": true,
  "candidate": {
    "id": 1,
    "name": "John Doe",
    "email": "candidate@example.com",
    "compatibility_score": 78,
    "seniority": "mid",
    "recommendation": "Hire"
  },
  "technology_scores": [
    {
      "technology": "html",
      "score": 85
    },
    {
      "technology": "css",
      "score": 72
    },
    {
      "technology": "javascript",
      "score": 80
    },
    {
      "technology": "typescript",
      "score": 68
    },
    {
      "technology": "react",
      "score": 75
    }
  ]
}
```

## Assessment Endpoints

### Submit Assessment

**Request:**
```json
POST /api/v1/assessment/submit
Content-Type: application/json

{
  "user_id": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "answers": {
    "html": [18, 16, 14, 17, 15],
    "css": [15, 18, 12, 10, 14],
    "javascript": [17, 18, 15, 16, 14],
    "typescript": [15, 12, 16, 14, 11],
    "react": [18, 16, 15, 12, 14],
    "vue": [0, 0, 0, 0, 0],
    "svelte": [0, 0, 0, 0, 0],
    "nodejs": [14, 12, 16, 10, 12],
    "python": [0, 0, 0, 0, 0],
    "php": [0, 0, 0, 0, 0],
    "sql": [16, 14, 12, 15, 14],
    "consistency": 0.7,
    "communication": 0.8
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "assessment_id": 1,
  "compatibility_score": 78,
  "recommendation": "Hire",
  "seniority": "mid",
  "technology_scores": [
    {
      "technology": "html",
      "score": 80
    },
    {
      "technology": "css",
      "score": 69
    },
    {
      "technology": "javascript",
      "score": 76
    },
    {
      "technology": "typescript",
      "score": 68
    },
    {
      "technology": "react",
      "score": 75
    },
    {
      "technology": "vue",
      "score": 0
    },
    {
      "technology": "svelte",
      "score": 0
    },
    {
      "technology": "nodejs",
      "score": 64
    },
    {
      "technology": "python",
      "score": 0
    },
    {
      "technology": "php",
      "score": 0
    },
    {
      "technology": "sql",
      "score": 71
    }
  ]
}
```

### Evaluate Assessment

**Request:**
```json
POST /api/v1/assessment/evaluate
Content-Type: application/json

{
  "assessment_id": 1
}
```

**Success Response:**
```json
{
  "success": true,
  "assessment": {
    "id": 1,
    "user_id": 1,
    "score": 78,
    "created_at": "2026-06-20T10:30:00Z",
    "compatibility_score": 78,
    "recommendation": "Hire",
    "seniority": "mid",
    "technology_scores": [
      {
        "technology": "html",
        "score": 80
      },
      {
        "technology": "css",
        "score": 69
      }
    ],
    "pillar_scores": [
      {
        "technology": "html",
        "pillar": "semantic",
        "score": 18
      },
      {
        "technology": "html",
        "pillar": "accessibility",
        "score": 16
      }
    ]
  }
}
```

## Recruiter Endpoints

### Get Rankings

**Request:**
```json
GET /api/v1/ranking/get?limit=10&offset=0&min_score=60&max_score=100
```

**Success Response:**
```json
{
  "success": true,
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "candidate@example.com",
      "role": "candidate",
      "compatibility_score": 92,
      "seniority": "senior",
      "recommendation": "Strong Hire"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "candidate",
      "compatibility_score": 78,
      "seniority": "mid",
      "recommendation": "Hire"
    },
    {
      "id": 3,
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "role": "candidate",
      "compatibility_score": 68,
      "seniority": "mid",
      "recommendation": "Consider"
    }
  ],
  "total": 3,
  "limit": 10,
  "offset": 0
}
```

### Get Insights

**Request:**
```json
POST /api/v1/recruiter/insights
Content-Type: application/json

{
  "candidate_id": 1
}
```

**Success Response:**
```json
{
  "success": true,
  "candidate": {
    "id": 1,
    "name": "John Doe",
    "email": "candidate@example.com",
    "compatibility_score": 92,
    "seniority": "senior",
    "recommendation": "Strong Hire"
  },
  "insights": {
    "strengths": [
      "Expert in html",
      "Strong in javascript",
      "Expert in react",
      "Well-rounded skill set",
      "Senior-level potential"
    ],
    "weaknesses": [
      "Needs improvement in svelte"
    ],
    "risk_analysis": "Low risk",
    "suggested_role": "senior",
    "interview_focus": [
      "Expert in html",
      "Strong in javascript",
      "Expert in react"
    ]
  }
}
```

## Analytics Endpoints

### Get Analytics Overview

**Request:**
```json
GET /api/v1/analytics/overview
```

**Success Response:**
```json
{
  "success": true,
  "overview": {
    "total_candidates": 150,
    "average_score": 68.5,
    "highest_score": 98,
    "lowest_score": 32,
    "seniority_distribution": {
      "junior": 45,
      "mid": 68,
      "senior": 32,
      "lead": 5
    },
    "recommendation_distribution": {
      "Strong Hire": 12,
      "Hire": 45,
      "Consider": 68,
      "Reject": 25
    }
  }
}
```

## Complete Assessment Example

Here's a complete example of a candidate's assessment submission with all technologies:

### Full Assessment Submission

**Request:**
```json
POST /api/v1/assessment/submit
Content-Type: application/json

{
  "user_id": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "answers": {
    "html": [18, 16, 14, 17, 15],
    "css": [15, 18, 12, 10, 14],
    "javascript": [17, 18, 15, 16, 14],
    "typescript": [15, 12, 16, 14, 11],
    "react": [18, 16, 15, 12, 14],
    "vue": [8, 10, 7, 8, 9],
    "svelte": [0, 0, 0, 0, 0],
    "nodejs": [14, 12, 16, 10, 12],
    "python": [6, 8, 5, 7, 6],
    "php": [0, 0, 0, 0, 0],
    "sql": [16, 14, 12, 15, 14],
    "consistency": 0.7,
    "communication": 0.8
  }
}
```

### Technology Breakdown

Each technology in the assessment has 5 pillars:

#### HTML
- semantic: 18/20
- accessibility: 16/20
- forms: 14/20
- seo: 17/20
- document: 15/20
- **Total: 80/100**

#### CSS
- layout: 15/20
- responsive: 18/20
- architecture: 12/20
- animations: 10/20
- performance: 14/20
- **Total: 69/100**

#### JavaScript
- fundamentals: 17/20
- async: 18/20
- dom: 15/20
- problem_solving: 16/20
- code_quality: 14/20
- **Total: 76/100**

#### TypeScript
- type_system: 15/20
- generics: 12/20
- interfaces: 16/20
- architecture: 14/20
- maintainability: 11/20
- **Total: 68/100**

#### React
- components: 18/20
- state: 16/20
- hooks: 15/20
- performance: 12/20
- architecture: 14/20
- **Total: 75/100**

#### Vue
- components: 8/20
- state: 10/20
- directives: 7/20
- performance: 8/20
- architecture: 9/20
- **Total: 42/100**

#### Svelte
- components: 0/20
- stores: 0/20
- reactivity: 0/20
- performance: 0/20
- build: 0/20
- **Total: 0/100**

#### Node.js
- api: 14/20
- security: 12/20
- auth: 16/20
- scalability: 10/20
- error_handling: 12/20
- **Total: 64/100**

#### Python
- api: 6/20
- security: 8/20
- async: 5/20
- scalability: 7/20
- error_handling: 6/20
- **Total: 32/100**

#### PHP
- api: 0/20
- security: 0/20
- auth: 0/20
- scalability: 0/20
- error_handling: 0/20
- **Total: 0/100**

#### SQL
- schema: 16/20
- optimization: 14/20
- indexing: 12/20
- normalization: 15/20
- integrity: 14/20
- **Total: 71/100**

### Final Score Calculation

**Technology Scores:**
- HTML: 80/100
- CSS: 69/100
- JavaScript: 76/100
- TypeScript: 68/100
- React: 75/100
- Vue: 42/100
- Svelte: 0/100
- Node.js: 64/100
- Python: 32/100
- PHP: 0/100
- SQL: 71/100

**Average Technology Score:** 57.7/100

**Compatibility Score Components:**
- Technical Skills: 57.7 × 0.6 = 34.6
- Consistency: 0.7 × 10 = 7.0
- Seniority Estimation: 20.0
- Learning Potential: 0.8 × 5 = 4.0

**Total Compatibility Score:** 65.6 → 66

**Recommendation:** Consider

**Seniority:** mid