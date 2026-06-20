<script lang="ts">
  import { onMount } from 'svelte';
  import { NuvolarisClient } from '$lib/api';
  import { API_BASE_URL } from '$lib/constants';
  import { toast } from 'sonner';

  const client = new NuvolarisClient(API_BASE_URL);
  let candidates: any[] = [];
  let loading = true;
  let filter = '';
  let minScore = 0;
  let maxScore = 100;

  onMount(async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await client.getRanking({ min_score: minScore, max_score: maxScore });
      candidates = response.candidates;
    } catch (error: any) {
      toast.error('Failed to load candidates');
    } finally {
      loading = false;
    }
  });

  function handleFilter(e: Event) {
    const target = e.target as HTMLInputElement;
    filter = target.value;
  }

  function handleScoreFilter(e: Event) {
    const target = e.target as HTMLInputElement;
    minScore = parseInt(target.value) || 0;
  }

  async function loadMore() {
    try {
      const response = await client.getRanking({ 
        limit: 10, 
        offset: candidates.length,
        min_score: minScore,
        max_score: maxScore 
      });
      candidates = [...candidates, ...response.candidates];
    } catch (error: any) {
      toast.error('Failed to load more candidates');
    }
  }
</script>

<div class="min-h-screen bg-background">
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <div class="flex items-center gap-2">
        <img src="/trustable.png" alt="Logo" class="h-8 w-auto" />
        <span class="text-lg font-semibold">Recruiting App</span>
      </div>
      <div class="ml-auto flex items-center gap-4">
        <span class="text-sm text-muted-foreground">Recruiter Dashboard</span>
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
    <div class="mb-6 flex gap-4">
      <input
        type="text"
        on:input={handleFilter}
        placeholder="Filter candidates..."
        class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      <input
        type="number"
        on:input={handleScoreFilter}
        placeholder="Min Score"
        class="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>

    {#if loading}
      <div class="flex items-center justify-center h-64">
        <span class="animate-spin">Loading...</span>
      </div>
    {:else}
      <div class="rounded-2xl border bg-card shadow-elegant">
        <table class="w-full">
          <thead class="border-b bg-muted/50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-foreground">Candidate</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-foreground">Score</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-foreground">Seniority</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-foreground">Recommendation</th>
              <th class="px-6 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each candidates.filter(c => c.name.toLowerCase().includes(filter.toLowerCase())) as candidate (candidate.id)}
              <tr class="hover:bg-muted/50">
                <td class="px-6 py-4">
                  <div class="font-medium text-foreground">{candidate.name}</div>
                  <div class="text-sm text-muted-foreground">{candidate.email}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-foreground">{candidate.compatibility_score}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">{candidate.seniority}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="rounded-full px-2 py-1 text-xs font-medium text-foreground">{candidate.recommendation}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <a href={`/recruiter/candidate/${candidate.id}`} class="text-primary hover:underline">View Details</a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        {#if candidates.length > 0}
          <div class="border-t p-4">
            <button on:click={loadMore} class="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
              Load More
            </button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
