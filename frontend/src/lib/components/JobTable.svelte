<script>
  export let jobs = [];
</script>

<div class="overflow-x-auto">
  <table class="min-w-full bg-white">
    <thead class="bg-gray-800 text-white">
      <tr>
        <th class="w-1/4 py-2 px-4 text-left">ID</th>
        <th class="w-1/4 py-2 px-4 text-left">Profile</th>
        <th class="w-1/4 py-2 px-4 text-left">Task</th>
        <th class="w-1/4 py-2 px-4 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      {#each jobs as job}
        <tr class="border-b">
          <td class="py-2 px-4">{job.id}</td>
          <td class="py-2 px-4">{job.profileId}</td>
          <td class="py-2 px-4">{job.taskId}</td>
          <td class="py-2 px-4">{job.status}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
