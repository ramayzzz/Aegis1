<script>
  import JobTable from '$lib/components/JobTable.svelte';
  import { onMount } from 'svelte';
  import { socket } from '$lib/socket';

  let jobs = [];

  onMount(() => {
    socket.on('job:update', (updatedJob) => {
      const index = jobs.findIndex((job) => job.id === updatedJob.id);
      if (index !== -1) {
        jobs[index] = updatedJob;
      } else {
        jobs = [...jobs, updatedJob];
      }
    });

    // Fetch initial jobs
    fetch('http://localhost:3000/api/v1/jobs')
      .then((res) => res.json())
      .then((data) => {
        jobs = data;
      });
  });
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold">Jobs</h1>
  <JobTable {jobs} />
</div>
