<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { NuvolarisClient } from '$lib/api';
  import { API_BASE_URL } from '$lib/constants';
  import { toast } from 'sonner';

  const client = new NuvolarisClient(API_BASE_URL);
  let user: any = null;
  let loading = true;

  onMount(async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (token) {
      try {
        const response = await client.getUser(token);
        user = response.user;
        
        if (user.role === 'recruiter') {
          goto('/recruiter/dashboard');
        } else {
          goto('/candidate/dashboard');
        }
      } catch (error: any) {
        toast.error('Failed to load user');
      } finally {
        loading = false;
      }
    } else {
      loading = false;
    }
  });
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
  <div class="w-full max-w-md px-6">
    <div class="flex flex-col items-center space-y-8">
      <div class="animate-in fade-in zoom-in duration-500">
        <img src="/trustable.png" alt="Trustable Logo" class="h-24 w-auto" />
      </div>

      <div class="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <div class="rounded-2xl border bg-card p-8 shadow-elegant">
          <h1 class="mb-2 text-2xl font-bold text-foreground">Welcome to Recruiting App</h1>
          <p class="mb-6 text-muted-foreground">Evaluate developer candidates across multiple technologies and produce scoring, rankings, and recruiter insights.</p>

          <div class="space-y-4">
            <button on:click={() => goto('/login')} class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
              Sign In
            </button>
            <button on:click={() => goto('/register')} class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full">
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <div class="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div class="rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 class="mb-4 text-lg font-semibold text-foreground">Features</h2>
          <ul class="space-y-3 text-sm text-foreground">
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              Multi-technology assessment (HTML, CSS, JS, TypeScript, React, Vue, Svelte, Node.js, Python, PHP, SQL)
            </li>
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-blue-500"></span>
              5 evaluation pillars per technology (0-20 scoring)
            </li>
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-purple-500"></span>
              Compatibility scoring (0-100)
            </li>
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-orange-500"></span>
              Candidate rankings and insights
            </li>
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-red-500"></span>
              Recruiter dashboard with filters
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
