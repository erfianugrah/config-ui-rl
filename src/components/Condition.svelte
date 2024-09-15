<script>
  import { createEventDispatcher } from 'svelte';
  import { LABELS, REQUEST_MATCH_FIELDS, REQUEST_MATCH_OPERATORS } from '../lib/config-variables';

  export let condition = {};
  export let i;

  const dispatch = createEventDispatcher();

  function removeCondition() {
    dispatch('remove');
  }

  $: isHeaderCondition = condition.field === 'headers.name' || condition.field === 'headers.nameValue';
  $: isBodyCondition = condition.field === 'body' || condition.field === 'body.custom';
</script>

<div class="condition-field bg-gray-50 p-4 rounded-md shadow-sm mb-6">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1" for="field-{i}">{LABELS.CONDITION_FIELD}</label>
      <select 
        id="field-{i}" 
        bind:value={condition.field}
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" 
        required
      >
        {#each REQUEST_MATCH_FIELDS as field}
          <option value={field.value}>{field.label}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1" for="comparator-{i}">{LABELS.CONDITION_OPERATOR}</label>
      <select 
        id="comparator-{i}" 
        bind:value={condition.comparator}
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" 
        required
      >
        {#each REQUEST_MATCH_OPERATORS as op}
          <option value={op.value}>{op.label}</option>
        {/each}
      </select>
    </div>
    {#if isHeaderCondition}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="headerName-{i}">Header Name</label>
        <input 
          id="headerName-{i}" 
          bind:value={condition.headerName}
          class="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" 
          type="text" 
          required
        >
      </div>
      {#if condition.field === 'headers.nameValue'}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="headerValue-{i}">Header Value</label>
          <input 
            id="headerValue-{i}" 
            bind:value={condition.headerValue}
            class="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" 
            type="text" 
            required
          >
        </div>
      {/if}
    {:else if isBodyCondition}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="bodyField-{i}">
          {condition.field === 'body' ? 'Request Body' : 'Body Field (JSON path)'}
        </label>
        <input 
          id="bodyField-{i}" 
          bind:value={condition.bodyField}
          class="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" 
          type="text" 
          required
        >
      </div>
    {:else}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="value-{i}">{LABELS.CONDITION_VALUE}</label>
        <input 
          id="value-{i}" 
          bind:value={condition.value}
          class="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" 
          type="text" 
          required
        >
      </div>
    {/if}
  </div>
  <div class="mt-4 text-right">
    <button 
      type="button" 
      class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" 
      on:click={removeCondition}
    >
      Remove
    </button>
  </div>
</div>
