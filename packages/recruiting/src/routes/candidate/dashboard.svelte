<script lang="ts">
  import { onMount } from 'svelte';
  import { NuvolarisClient } from '$lib/api';
  import { API_BASE_URL } from '$lib/constants';
  import { toast } from 'sonner';

  const client = new NuvolarisClient(API_BASE_URL);
  let user: any = null;
  let loading = true;
  let compatibilityScore = 0;
  let recommendation = '';
  let seniority = '';
  let technologyScores: any[] = [];
  let insights: any = null;

  onMount(async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await client.getUser(token);
      user = response.user;
      
      const assessmentsResponse = await fetch(`${API_BASE_URL}/v1/assessment/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      
      const assessments = await assessmentsResponse.json();
      
      if (assessments.assessment) {
        compatibilityScore = assessments.assessment.compatibility_score;
        recommendation = assessments.assessment.recommendation;
        seniority = assessments.assessment.seniority;
        technologyScores = assessments.assessment.technology_scores;
        insights = assessments;
      }
    } catch (error: any) {
      toast.error('Failed to load dashboard');
    } finally {
      loading = false;
    }
  });
</script>

<div class="min-h-screen bg-background">
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <div class="flex items-center gap-2">
        <img src="/trustable.png" alt="Logo" class="h-8 w-auto" />
        <span class="text-lg font-semibold">Recruiting App</span>
      </div>
      <div class="ml-auto flex items-center gap-4">
        <span class="text-sm text-muted-foreground">Welcome, {#if user}{user.name}{/if}</span>
        <button on:click={() => {
          document.cookie = 'token=; path=/; max-age=0';
          window.location.href = '/login';
        }} class="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:bg-destructive/90">
          Sign Out
        </button>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-4 py-8">
    {#if loading}
      <div class="flex items-center justify-center h-64">
        <span class="animate-spin">Loading...</span>
      </div>
    {:else}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="col-span-1 md:col-span-2 rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-2xl font-bold text-foreground mb-4">Compatibility Score</h2>
          <div class="flex items-center gap-4">
            <div class="relative h-32 w-32">
              <svg class="h-full w-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" class="text-muted-foreground" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" stroke-dasharray="283" stroke-dashoffset="283" class="text-primary" style="stroke-dashoffset: {283 - (compatibilityScore / 100) * 283}; transition: stroke-dashoffset 1s ease-in-out;" />
                <text x="50" y="50" text-anchor="middle" dy=".3em" class="text-2xl font-bold fill-foreground">{compatibilityScore}%</text>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Recommendation</p>
              <p class="text-lg font-semibold text-foreground">{recommendation}</p>
              <p class="text-sm text-muted-foreground mt-1">Seniority: {seniority}</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-2xl font-bold text-foreground mb-4">Your Strengths</h2>
          {#if insights?.insights?.strengths?.length}
            <ul class="space-y-2">
              {#each insights.insights.strengths as strength}
                <li class="flex items-center gap-2 text-sm text-foreground">
                  <span class="h-2 w-2 rounded-full bg-green-500"></span>
                  {strength}
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-sm text-muted-foreground">No strengths identified yet</p>
          {/if}
        </div>

        <div class="col-span-1 md:col-span-2 rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-2xl font-bold text-foreground mb-4">Technology Scores</h2>
          <div class="space-y-3">
            {#each technologyScores as tech (tech.technology)}
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-foreground capitalize">{tech.technology}</span>
                  <span class="text-sm font-bold text-foreground">{tech.score}/100</span>
                </div>
                <div class="h-2 w-full rounded-full bg-muted">
                  <div class="h-2 rounded-full bg-primary" style="width: {tech.score}%"></div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div class="col-span-1 md:col-span-2 rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-2xl font-bold text-foreground mb-4">Improvement Areas</h2>
          {#if insights?.insights?.weaknesses?.length}
            <ul class="space-y-2">
              {#each insights.insights.weaknesses as weakness}
                <li class="flex items-center gap-2 text-sm text-foreground">
                  <span class="h-2 w-2 rounded-full bg-red-500"></span>
                  {weakness}
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-sm text-muted-foreground">Great job! No improvement areas identified.</p>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
