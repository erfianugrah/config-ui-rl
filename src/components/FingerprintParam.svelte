<script>
  import { createEventDispatcher } from 'svelte';
  import { FINGERPRINT_PARAMS } from '../lib/config-variables';

  const dispatch = createEventDispatcher();

  let selectedParam = FINGERPRINT_PARAMS[0].value;
  let headerName = '';
  let headerValue = '';
  let bodyField = '';

  function addParameter() {
    let paramValue = selectedParam;

    if (selectedParam === 'headers.name') {
      if (!headerName) {
        alert('Please enter a header name.');
        return;
      }
      paramValue = `headers.name:${headerName}`;
    } else if (selectedParam === 'headers.nameValue') {
      if (!headerName || !headerValue) {
        alert('Please enter both header name and value.');
        return;
      }
      paramValue = `headers.nameValue:${headerName}:${headerValue}`;
    } else if (selectedParam === 'body.custom') {
      if (!bodyField) {
        alert('Please enter a body field.');
        return;
      }
      paramValue = `body.custom:${bodyField}`;
    }

    dispatch('add', paramValue);

    // Reset fields
    headerName = '';
    headerValue = '';
    bodyField = '';
  }
</script>

<div class="flex flex-wrap items-end space-x-4 mb-4">
  <div class="flex-grow max-w-md">
    <label for="paramType" class="block text-sm font-medium text-gray-700 mb-1">Parameter Type</label>
    <select 
      id="paramType"
      bind:value={selectedParam}
      class="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
    >
      {#each FINGERPRINT_PARAMS as param}
        <option value={param.value}>{param.label}</option>
      {/each}
    </select>
  </div>
  
  {#if selectedParam === 'headers.name' || selectedParam === 'headers.nameValue'}
    <div class="flex-grow">
      <label for="headerName" class="block text-sm font-medium text-gray-700 mb-1">Header Name</label>
      <input 
        id="headerName"
        type="text" 
        bind:value={headerName}
        class="w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white"
      >
    </div>
    {#if selectedParam === 'headers.nameValue'}
      <div class="flex-grow">
        <label for="headerValue" class="block text-sm font-medium text-gray-700 mb-1">Header Value</label>
        <input 
          id="headerValue"
          type="text" 
          bind:value={headerValue}
          class="w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white"
        >
      </div>
    {/if}
  {:else if selectedParam === 'body.custom'}
    <div class="flex-grow">
      <label for="bodyField" class="block text-sm font-medium text-gray-700 mb-1">Body Field (JSON path)</label>
      <input 
        id="bodyField"
        type="text" 
        bind:value={bodyField}
        class="w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white"
      >
    </div>
  {/if}
  
  <button 
    type="button" 
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md"
    on:click={addParameter}
  >
    Add Parameter
  </button>
</div>
