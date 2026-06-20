<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { NuvolarisClient } from '$lib/api';
  import { API_BASE_URL, TECHNOLOGIES, PILLARS } from '$lib/constants';
  import { toast } from 'sonner';

  const client = new NuvolarisClient(API_BASE_URL);
  let user: any = null;
  let loading = true;
  let currentStep = 1;
  let totalSteps = TECHNOLOGIES.length;
  let answers: Record<string, number[]> = {};
  let submissionLoading = false;

  onMount(async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await client.getUser(token);
      user = response.user;
    } catch (error: any) {
      toast.error('Failed to load user');
    } finally {
      loading = false;
    }
  });

  function handlePillarScoreChange(technology: string, pillarIndex: number, value: number) {
    if (!answers[technology]) {
      answers[technology] = new Array(5).fill(0);
    }
    answers[technology][pillarIndex] = value;
  }

  function handleNext() {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  }

  function handlePrev() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  async function handleSubmit() {
    submissionLoading = true;
    
    try {
      const response = await client.submitAssessment(user.id, answers, document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '');
      
      toast.success('Assessment submitted!');
      goto(`/candidate/results/${response.assessment_id}`);
    } catch (error: any) {
      toast.error('Failed to submit assessment');
    } finally {
      submissionLoading = false;
    }
  }

  function getCurrentTechnology() {
    return TECHNOLOGIES[currentStep - 1];
  }

  function getTechnologyProgress() {
    return Math.round((currentStep / totalSteps) * 100);
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
      <div class="max-w-3xl mx-auto">
        <div class="mb-8">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-foreground">Assessment Progress</span>
            <span class="text-sm font-medium text-foreground">{currentStep} of {totalSteps}</span>
          </div>
          <div class="h-2 w-full rounded-full bg-muted">
            <div class="h-2 rounded-full bg-primary transition-all duration-300" style="width: {getTechnologyProgress()}%"></div>
          </div>
        </div>

        <div class="rounded-2xl border bg-card p-8 shadow-elegant">
          <h1 class="text-2xl font-bold text-foreground mb-2 capitalize">{getCurrentTechnology()} Assessment</h1>
          <p class="text-muted-foreground mb-6">Rate your skills in each area from 0-20</p>

          <div class="space-y-8">
            {#each PILLARS[getCurrentTechnology()] as pillar, index (pillar)}
              <div>
                <div class="flex justify-between mb-2">
                  <label class="font-medium text-foreground capitalize">{pillar.replace('_', ' ')}</label>
                  <span class="text-sm font-bold text-primary">{answers[getCurrentTechnology()]?.[index] || 0}/20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value="{answers[getCurrentTechnology()]?.[index] || 0}"
                  oninput={(e: Event) => handlePillarScoreChange(getCurrentTechnology(), index, parseInt((e.target as HTMLInputElement).value))}
                  class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div class="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>
            {/each}
          </div>

          <div class="mt-8 flex justify-between">
            <button
              on:click={handlePrev}
              disabled={currentStep === 1}
              class="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
            >
              Previous
            </button>
            
            {#if currentStep === totalSteps}
              <button
                on:click={handleSubmit}
                disabled={submissionLoading}
                class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {#if submissionLoading}
                  Submitting...
                {:else}
                  Submit Assessment
                {/if}
              </button>
            {:else}
              <button
                on:click={handleNext}
                class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Next
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
