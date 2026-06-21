import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const RecruitingPlatform = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
          
          <div className="text-center space-y-6 max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight">TalentMatch</h1>
            <p className="text-xl text-muted-foreground">
              AI-powered recruitment platform connecting candidates with recruiters
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/login">I'm a Recruiter</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/register">I'm a Candidate</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">For Recruiters</CardTitle>
                <CardDescription>Find your next top hire with AI-assisted candidate screening</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>✅ AI-powered candidate matching</li>
                  <li>✅ Automated skill assessments</li>
                  <li>✅ Detailed candidate profiles</li>
                  <li>✅ Real-time analytics</li>
                </ul>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/login">Start Screening</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">For Candidates</CardTitle>
                <CardDescription>Showcase your skills and get matched with the right opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>✅ Free skill assessment</li>
                  <li>✅ AI-powered feedback</li>
                  <li>✅ Match with top companies</li>
                  <li>✅ Track your progress</li>
                </ul>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/register">Take Assessment</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecruitingPlatform;
