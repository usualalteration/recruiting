import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiGet, getUserFromToken, removeToken, TokenPayload } from '@/lib/api';

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  compatibility_score: number;
  seniority: string;
  recommendation: string;
}

const RecruiterDashboard = () => {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterRole, setFilterRole] = useState('candidate');
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userFromToken = getUserFromToken();
    if (!userFromToken) {
      navigate('/login');
      return;
    }
    
    if (userFromToken.role !== 'recruiter') {
      navigate('/candidate/dashboard');
      return;
    }
    
    setUser(userFromToken);
    loadCandidates();
  }, [navigate]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await apiGet(`/web/v1/candidate/list?token=${token}&limit=50&offset=0&min_score=${minScore}&max_score=${maxScore}&role=${filterRole}`);
      setCandidates(response.candidates || []);
    } catch (err: unknown) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Hire': return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
      case 'Hire': return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Consider': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      default: return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">Manage candidates and assessments</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{candidates.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Strong Hires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {candidates.filter(c => c.recommendation === 'Strong Hire').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {candidates.length > 0 
                  ? Math.round(candidates.reduce((acc, c) => acc + c.compatibility_score, 0) / candidates.length)
                  : 0
                }/100
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter candidates by criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
              <div>
                <Label htmlFor="minScore">Min Score</Label>
                <Input
                  id="minScore"
                  type="number"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxScore">Max Score</Label>
                <Input
                  id="maxScore"
                  type="number"
                  min="0"
                  max="100"
                  value={maxScore}
                  onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                />
              </div>
            </div>
            <Button onClick={loadCandidates}>Apply Filters</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.email}</CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getRecommendationColor(candidate.recommendation)}`}>
                    {candidate.recommendation}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Compatibility Score</span>
                  <span className="text-lg font-bold">{candidate.compatibility_score}/100</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Seniority</span>
                  <span className="text-sm font-medium capitalize">{candidate.seniority}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Insights
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredCandidates.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No candidates found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
