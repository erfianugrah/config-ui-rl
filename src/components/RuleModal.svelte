<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let rule;
  export let index;

  const dispatch = createEventDispatcher();

  function viewRule() {
    dispatch('view', { rule });
  }

  function editRule() {
    dispatch('edit', { rule, index });
  }

  function deleteRule() {
    dispatch('delete', { index });
  }

  onMount(() => {
    const element = document.querySelector(`[data-id="${index}"]`);
    if (element) {
      element.setAttribute('draggable', 'true');
    }
  });
</script>

<div class="bg-white shadow-md rounded px-6 py-4 mb-4 cursor-move transition-all duration-200 hover:shadow-lg" data-id={index}>
  <div class="flex justify-between items-center mb-2">
    <h3 class="text-lg font-semibold text-gray-800">{rule.name}</h3>
    <span class="text-gray-500 opacity-50 hover:opacity-100 transition-opacity duration-200">☰</span>
  </div>
  <p class="text-sm text-gray-600 mb-4">{rule.description || 'No description'}</p>
  <div class="flex justify-between">
    <button on:click={viewRule} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">View</button>
    <button on:click={editRule} class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">Edit</button>
    <button on:click={deleteRule} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">Delete</button>
  </div>
</div>
