import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiPost, apiGet, getUserFromToken, removeToken } from '@/lib/api';
import { TokenPayload } from '@/lib/api';

interface TechnologyScore {
  technology: string;
  score: number;
}

interface AssessmentResponse {
  success: boolean;
  assessment_id?: number;
  compatibility_score?: number;
  recommendation?: string;
  seniority?: string;
  technology_scores?: TechnologyScore[];
}

interface Technology {
  name: string;
  id: string;
  pillars: string[];
}

interface Assessment {
  compatibility_score: number;
  recommendation: string;
  seniority: string;
  technology_scores?: TechnologyScore[];
}

const CandidateDashboard = () => {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userFromToken = getUserFromToken();
    if (!userFromToken) {
      navigate('/login');
      return;
    }
    
    if (userFromToken.role !== 'candidate') {
      navigate('/recruiter/dashboard');
      return;
    }
    
    setUser(userFromToken);
    loadAssessment();
  }, [navigate]);

  const loadAssessment = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await apiGet('/web/v1/assessment/evaluate?assessment_id=1');
      setAssessment(response.assessment);
    } catch {
      // Assessment not found, user needs to submit
    }
  };

  const handleAnswerChange = (technology: string, index: number, value: number) => {
    setAnswers(prev => {
      const current = prev[technology] || new Array(5).fill(0);
      const updated = [...current];
      updated[index] = value;
      return { ...prev, [technology]: updated };
    });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response: AssessmentResponse = await apiPost('/web/v1/assessment/submit', {
        token,
        answers,
        consistency: 0.5,
        communication: 0.5
      });
      
      if (response.success) {
        setAssessment({
          compatibility_score: response.compatibility_score || 0,
          recommendation: response.recommendation || '',
          seniority: response.seniority || '',
          technology_scores: response.technology_scores
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  const technologies = [
    { name: 'HTML', id: 'html', pillars: ['semantic', 'accessibility', 'forms', 'seo', 'document'] },
    { name: 'CSS', id: 'css', pillars: ['layout', 'responsive', 'architecture', 'animations', 'performance'] },
    { name: 'JavaScript', id: 'javascript', pillars: ['fundamentals', 'async', 'dom', 'problem_solving', 'code_quality'] },
    { name: 'TypeScript', id: 'typescript', pillars: ['type_system', 'generics', 'interfaces', 'architecture', 'maintainability'] },
    { name: 'React', id: 'react', pillars: ['components', 'state', 'hooks', 'performance', 'architecture'] },
    { name: 'Vue', id: 'vue', pillars: ['components', 'state', 'directives', 'performance', 'architecture'] },
    { name: 'Svelte', id: 'svelte', pillars: ['components', 'stores', 'reactivity', 'performance', 'build'] },
    { name: 'Node.js', id: 'nodejs', pillars: ['api', 'security', 'auth', 'scalability', 'error_handling'] },
    { name: 'Python', id: 'python', pillars: ['api', 'security', 'async', 'scalability', 'error_handling'] },
    { name: 'PHP', id: 'php', pillars: ['api', 'security', 'auth', 'scalability', 'error_handling'] },
    { name: 'SQL', id: 'sql', pillars: ['schema', 'optimization', 'indexing', 'normalization', 'integrity'] },
  ];

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Hire': return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'Hire': return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'Consider': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      default: return 'bg-red-500/20 text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        {assessment ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Assessment Results</CardTitle>
                <CardDescription>Based on your recent assessment submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 rounded-xl bg-card border">
                  <div>
                    <p className="text-sm text-muted-foreground">Compatibility Score</p>
                    <p className="text-4xl font-bold">{assessment.compatibility_score}/100</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${getRecommendationColor(assessment.recommendation)}`}>
                    <p className="font-semibold">{assessment.recommendation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Seniority Level</p>
                    <p className="text-lg font-semibold">{assessment.seniority.charAt(0).toUpperCase() + assessment.seniority.slice(1)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Technology Scores</h3>
                  <div className="space-y-3">
                    {assessment.technology_scores?.map((tech: { technology: string; score: number }) => (
                      <div key={tech.technology} className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="font-medium capitalize">{tech.technology}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${tech.score}%` }}
                            />
                          </div>
                          <span className="font-semibold">{tech.score}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Take Assessment</CardTitle>
              <CardDescription>Evaluate your skills across 11 technologies</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {technologies.map((tech) => (
                  <div key={tech.id} className="space-y-3">
                    <h3 className="font-semibold capitalize">{tech.name}</h3>
                    <div className="space-y-2">
                      {tech.pillars.map((pillar, index) => (
                        <div key={pillar} className="flex items-center justify-between">
                          <Label className="capitalize text-sm">{pillar.replace('_', ' ')}</Label>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">0</span>
                            <Input
                              type="range"
                              min="0"
                              max="20"
                              value={answers[tech.id]?.[index] || 0}
                              onChange={(e) => handleAnswerChange(tech.id, index, parseInt(e.target.value))}
                              className="w-24"
                            />
                            <span className="text-xs text-muted-foreground">20</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button onClick={handleSubmit} className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
