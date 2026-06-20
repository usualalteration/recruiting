<script lang="ts">
  import { onMount } from 'svelte';
  import { NuvolarisClient } from '$lib/api';
  import { API_BASE_URL } from '$lib/constants';
  import { toast } from 'sonner';

  const client = new NuvolarisClient(API_BASE_URL);
  let loading = true;
  let technologyScores: any[] = [];
  let pillarScores: any[] = [];

  onMount(async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await client.getAssessment(1);
      technologyScores = response.assessment.technology_scores;
      pillarScores = response.assessment.pillar_scores;
    } catch (error: any) {
      toast.error('Failed to load results');
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
    {:else}
      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-2xl font-bold text-foreground mb-4">Technology Breakdown</h2>
          <div class="space-y-4">
            {#each technologyScores as tech (tech.technology)}
              <div>
                <div class="flex justify-between mb-2">
                  <span class="font-medium capitalize">{tech.technology}</span>
                  <span class="font-bold">{tech.score}/100</span>
                </div>
                <div class="h-2 w-full rounded-full bg-muted">
                  <div class="h-2 rounded-full bg-primary" style="width: {tech.score}%"></div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div class="rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="text-2xl font-bold text-foreground mb-4">Pillar Scores</h2>
          <div class="space-y-4">
            {#each pillarScores as pillar (pillar.pillar)}
              <div>
                <div class="flex justify-between mb-2">
                  <span class="font-medium capitalize">{pillar.technology} - {pillar.pillar}</span>
                  <span class="font-bold">{pillar.score}/20</span>
                </div>
                <div class="h-2 w-full rounded-full bg-muted">
                  <div class="h-2 rounded-full bg-primary" style="width: {(pillar.score / 20) * 100}%"></div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
