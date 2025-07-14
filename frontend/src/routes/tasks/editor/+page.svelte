<script>
  import { onMount } from 'svelte';
  import * as monaco from 'monaco-editor';

  let editorContainer;

  onMount(() => {
    monaco.editor.create(editorContainer, {
      value: 'module.exports = { run: async ({ page }) => { \n  // Your code here\n}}',
      language: 'javascript'
    });
  });
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold">Task Editor</h1>
  <div bind:this={editorContainer} class="w-full h-96 border mt-4"></div>
</div>
