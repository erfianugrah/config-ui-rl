<script>
  import { createEventDispatcher } from 'svelte';
  import { LABELS, FINGERPRINT_PARAMS, REQUEST_MATCH_FIELDS, REQUEST_MATCH_OPERATORS } from '../lib/config-variables';
  import Condition from './Condition.svelte';
  import FingerprintParam from './FingerprintParam.svelte';

  export let rule = {
    name: '',
    description: '',
    rateLimit: { limit: '', period: '' },
    action: { type: 'rateLimit' },
    fingerprint: { parameters: [] },
    requestMatch: { conditions: [] }
  };
  export let index;

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch('save', { rule, index });
  }

  function addCondition() {
    rule.requestMatch.conditions = [...rule.requestMatch.conditions, {}];
  }

  function addConditionGroup() {
    rule.requestMatch.conditions = [...rule.requestMatch.conditions, { type: 'group', conditions: [] }];
  }

  function updateActionFields(event) {
    const actionType = event.target.value;
    rule.action = { type: actionType };
    if (actionType === 'customResponse') {
      rule.action.statusCode = '';
      rule.action.body = '';
    }
  }

  function addFingerprint(param) {
    rule.fingerprint.parameters = [...rule.fingerprint.parameters, param];
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div class="mb-4">
    <h3 class="text-lg font-semibold">Rule {index + 1}</h3>
  </div>
  
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleName">
      {LABELS.RULE_NAME}
    </label>
    <input 
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="ruleName" 
      bind:value={rule.name} 
      required
    >
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleDescription">
      {LABELS.DESCRIPTION}
    </label>
    <textarea 
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="ruleDescription" 
      bind:value={rule.description}
    ></textarea>
  </div>

  <div class="mb-4">
    <h4 class="text-md font-semibold mb-2">Rate Limit</h4>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="limit">
          {LABELS.REQUEST_LIMIT}
        </label>
        <input 
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          id="limit" 
          type="number" 
          bind:value={rule.rateLimit.limit} 
          required
        >
      </div>
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="period">
          {LABELS.TIME_PERIOD}
        </label>
        <input 
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          id="period" 
          type="number" 
          bind:value={rule.rateLimit.period} 
          required
        >
      </div>
    </div>
  </div>

  <div class="mb-4">
    <h4 class="text-md font-semibold mb-2">{LABELS.REQUEST_MATCH}</h4>
    {#each rule.requestMatch.conditions as condition, i}
      <Condition bind:condition {i} on:remove={() => rule.requestMatch.conditions = rule.requestMatch.conditions.filter((_, index) => index !== i)} />
    {/each}
    <div class="mt-4">
      <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" on:click={addCondition}>
        Add Condition
      </button>
      <button type="button" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" on:click={addConditionGroup}>
        Add Condition Group
      </button>
    </div>
  </div>

  <div class="mb-6">
    <h4 class="text-md font-semibold mb-2">Action</h4>
    <div class="inline-block bg-gray-50 p-4 rounded-md shadow-sm">
      <div class="mb-4 max-w-md">
        <label class="block text-sm font-medium text-gray-700 mb-1" for="actionType">
          Action Type
        </label>
        <select 
          id="actionType" 
          bind:value={rule.action.type} 
          on:change={updateActionFields}
          class="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        >
          <option value="log">Log</option>
          <option value="simulate">Simulate</option>
          <option value="block">Block (403)</option>
          <option value="rateLimit">Rate Limit (429)</option>
          <option value="customResponse">Custom JSON Response</option>
        </select>
      </div>
      {#if rule.action.type === 'customResponse'}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="customStatusCode">Status Code:</label>
          <input type="number" id="customStatusCode" bind:value={rule.action.statusCode} class="w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="customResponseBody">Response Body (JSON):</label>
          <textarea id="customResponseBody" bind:value={rule.action.body} class="w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white h-24" rows="4" required></textarea>
        </div>
      {:else}
        <div class="text-sm text-gray-600">
          This action will {rule.action.type === 'block' ? 'block the request with a 403 status' : rule.action.type === 'rateLimit' ? 'rate limit the request with a 429 status' : rule.action.type === 'log' ? 'log the request without taking action' : 'simulate rate limiting without actually blocking requests'}.
        </div>
      {/if}
    </div>
  </div>

  <div class="mb-6">
    <h4 class="text-md font-semibold mb-2">{LABELS.FINGERPRINT_PARAMS}</h4>
    <div class="bg-gray-50 p-4 rounded-md shadow-sm">
      <FingerprintParam on:add={addFingerprint} />
      <div class="mt-4 p-2 border rounded min-h-[100px] shadow-inner bg-white">
        {#each rule.fingerprint.parameters as param}
          <div class="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
            <span>{param}</span>
            <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs" on:click={() => rule.fingerprint.parameters = rule.fingerprint.parameters.filter(p => p !== param)}>
              Remove
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="flex items-center justify-between">
    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Save Rule
    </button>
  </div>
</form>
