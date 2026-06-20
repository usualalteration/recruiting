<script lang="ts">
  import { onMount } from 'svelte';
  import { NuvolarisClient } from '$lib/api';
  import { API_BASE_URL } from '$lib/constants';
  import { toast } from 'sonner';

  const client = new NuvolarisClient(API_BASE_URL);
  let candidate: any = null;
  let loading = true;

  onMount(async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await client.getInsights(1);
      candidate = response;
    } catch (error: any) {
      toast.error('Failed to load candidate');
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
    {:else if candidate}
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="col-span-1 lg:col-span-2 rounded-2xl border bg-card p-6 shadow-elegant">
          <div class="flex items-center gap-4 mb-6">
            <div class="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              {candidate.candidate.name.charAt(0)}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-foreground">{candidate.candidate.name}</h1>
              <p class="text-muted-foreground">{candidate.candidate.email}</p>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-xl bg-muted/50 p-4">
              <p class="text-sm font-medium text-muted-foreground">Compatibility Score</p>
              <p class="text-3xl font-bold text-foreground">{candidate.candidate.compatibility_score}%</p>
            </div>
            <div class="rounded-xl bg-muted/50 p-4">
              <p class="text-sm font-medium text-muted-foreground">Seniority</p>
              <p class="text-2xl font-bold text-foreground capitalize">{candidate.candidate.seniority}</p>
            </div>
            <div class="col-span-2 rounded-xl bg-muted/50 p-4">
              <p class="text-sm font-medium text-muted-foreground">Recommendation</p>
              <p class="text-2xl font-bold text-foreground">{candidate.candidate.recommendation}</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-xl font-bold text-foreground mb-4">Risk Analysis</h2>
          <div class="rounded-xl bg-muted/50 p-4">
            <p class="text-sm font-medium text-muted-foreground mb-2">Risk Level</p>
            <p class="text-2xl font-bold text-foreground">{candidate.insights.risk_analysis}</p>
          </div>
        </div>

        <div class="col-span-1 lg:col-span-2 rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-xl font-bold text-foreground mb-4">Strengths</h2>
          {#if candidate.insights.strengths?.length}
            <ul class="space-y-2">
              {#each candidate.insights.strengths as strength}
                <li class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-green-500"></span>
                  <span class="text-foreground">{strength}</span>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-muted-foreground">No strengths identified</p>
          {/if}
        </div>

        <div class="col-span-1 lg:col-span-2 rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-xl font-bold text-foreground mb-4">Weaknesses</h2>
          {#if candidate.insights.weaknesses?.length}
            <ul class="space-y-2">
              {#each candidate.insights.weaknesses as weakness}
                <li class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-red-500"></span>
                  <span class="text-foreground">{weakness}</span>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-muted-foreground">No weaknesses identified</p>
          {/if}
        </div>

        <div class="col-span-1 lg:col-span-2 rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-xl font-bold text-foreground mb-4">Suggested Role</h2>
          <p class="text-2xl font-bold text-foreground capitalize">{candidate.insights.suggested_role}</p>
        </div>

        <div class="col-span-1 lg:col-span-2 rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-xl font-bold text-foreground mb-4">Interview Focus Areas</h2>
          {#if candidate.insights.interview_focus?.length}
            <ul class="space-y-2">
              {#each candidate.insights.interview_focus as focus}
                <li class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span class="text-foreground">{focus}</span>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-muted-foreground">No focus areas identified</p>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
