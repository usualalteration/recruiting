<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { NuvolarisClient } from '$lib/api';
  import { API_BASE_URL } from '$lib/constants';
  import { toast } from 'sonner';

  const client = new NuvolarisClient(API_BASE_URL);
  let name = '';
  let email = '';
  let password = '';
  let loading = false;

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    
    try {
      const response = await client.register(name, email, password);
      
      if (response.token) {
        document.cookie = `token=${response.token}; path=/; max-age=604800`;
        toast.success('Registration successful!');
        goto('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
  <div class="w-full max-w-md px-6">
    <div class="flex flex-col items-center space-y-8">
      <div class="animate-in fade-in zoom-in duration-500">
        <img src="/trustable.png" alt="Trustable Logo" class="h-24 w-auto" />
      </div>

      <div class="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <div class="rounded-2xl border bg-card p-8 shadow-elegant">
          <h1 class="mb-2 text-2xl font-bold text-foreground">Create Account</h1>
          <p class="mb-6 text-muted-foreground">Sign up to get started</p>

          <form onsubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                bind:value={name}
                required
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                bind:value={email}
                required
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                bind:value={password}
                required
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              {#if loading}
                <span class="animate-spin">Loading...</span>
              {:else}
                Sign Up
              {/if}
            </button>
          </form>

          <p class="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? 
            <a href="/login" class="underline underline-offset-4 hover:text-primary">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
