<script>
  import { createEventDispatcher } from 'svelte';
  import { LABELS, REQUEST_MATCH_FIELDS, REQUEST_MATCH_OPERATORS, LOGICAL_OPERATORS, FINGERPRINT_PARAMS } from '../lib/config-variables';

  export let rule = {
    name: '',
    description: '',
    rateLimit: { limit: '', period: '' },
    action: { type: 'rateLimit' },
    fingerprint: { parameters: [] },
    requestMatch: { conditions: [] }
  };
  export let index = undefined;

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch('save', { rule, index });
  }

  function addCondition() {
    rule.requestMatch.conditions = [...rule.requestMatch.conditions, { type: 'single', conditions: [{}] }];
  }

  function addConditionGroup() {
    rule.requestMatch.conditions = [...rule.requestMatch.conditions, {
      type: 'group',
      conditions: [{}] // Initialize with one empty condition
    }];
  }

  function addConditionToGroup(groupIndex) {
    rule.requestMatch.conditions[groupIndex].conditions = [...rule.requestMatch.conditions[groupIndex].conditions, {}];
  }

  function removeCondition(index) {
    rule.requestMatch.conditions = rule.requestMatch.conditions.filter((_, i) => i !== index);
  }

  function removeConditionFromGroup(groupIndex, conditionIndex) {
    rule.requestMatch.conditions[groupIndex].conditions = rule.requestMatch.conditions[groupIndex].conditions.filter((_, i) => i !== conditionIndex);
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

  function removeFingerprint(param) {
    rule.fingerprint.parameters = rule.fingerprint.parameters.filter(p => p !== param);
  }

  let selectedFingerprintParam = FINGERPRINT_PARAMS[0].value;
  let headerName = '';
  let headerValue = '';
  let bodyField = '';

  function handleAddFingerprint() {
    let paramValue = selectedFingerprintParam;

    if (selectedFingerprintParam === 'headers.name') {
      if (!headerName) {
        alert('Please enter a header name.');
        return;
      }
      paramValue = `headers.name:${headerName}`;
    } else if (selectedFingerprintParam === 'headers.nameValue') {
      if (!headerName || !headerValue) {
        alert('Please enter both header name and value.');
        return;
      }
      paramValue = `headers.nameValue:${headerName}:${headerValue}`;
    } else if (selectedFingerprintParam === 'body.custom') {
      if (!bodyField) {
        alert('Please enter a body field.');
        return;
      }
      paramValue = `body.custom:${bodyField}`;
    }

    addFingerprint(paramValue);

    // Reset fields
    headerName = '';
    headerValue = '';
    bodyField = '';
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div class="mb-4">
    <h3 class="text-lg font-semibold">Rule {index !== undefined ? index + 1 : '1'}</h3>
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
      {#if i > 0}
        <div class="my-2 flex justify-end">
          <select bind:value={condition.operator} class="w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            {#each LOGICAL_OPERATORS as op}
              <option value={op.value}>{op.label}</option>
            {/each}
          </select>
        </div>
      {/if}
{#if condition.type === 'group'}
  <div class="border-2 border-gray-300 rounded-lg p-4 mb-4">
    <h5 class="text-lg font-semibold text-gray-700 mb-2">Condition Group</h5>
    {#each condition.conditions as groupCondition, j}
      {#if j > 0}
        <div class="my-2 flex justify-end">
          <select bind:value={groupCondition.operator} class="w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            {#each LOGICAL_OPERATORS as op}
              <option value={op.value}>{op.label}</option>
            {/each}
          </select>
        </div>
      {/if}
      <div class="mb-4 p-4 border rounded">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for={`group-${i}-field-${j}`}>{LABELS.CONDITION_FIELD}</label>
            <select id={`group-${i}-field-${j}`} bind:value={groupCondition.field} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              {#each REQUEST_MATCH_FIELDS as field}
                <option value={field.value}>{field.label}</option>
              {/each}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for={`group-${i}-operator-${j}`}>{LABELS.CONDITION_OPERATOR}</label>
            <select id={`group-${i}-operator-${j}`} bind:value={groupCondition.comparator} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              {#each REQUEST_MATCH_OPERATORS as op}
                <option value={op.value}>{op.label}</option>
              {/each}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for={`group-${i}-value-${j}`}>{LABELS.CONDITION_VALUE}</label>
            <input id={`group-${i}-value-${j}`} bind:value={groupCondition.value} class="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-md" type="text">
          </div>
        </div>
        <div class="mt-2 flex justify-end">
          <button type="button" on:click={() => removeConditionFromGroup(i, j)} class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Remove Condition
          </button>
        </div>
      </div>
    {/each}
    <div class="flex justify-end">
      <button type="button" on:click={() => addConditionToGroup(i)} class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add Condition to Group
      </button>
    </div>
  </div>
      {:else}
        <div class="mb-4 p-4 border rounded">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for={`condition-${i}-field`}>{LABELS.CONDITION_FIELD}</label>
              <select id={`condition-${i}-field`} bind:value={condition.field} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                {#each REQUEST_MATCH_FIELDS as field}
                  <option value={field.value}>{field.label}</option>
                {/each}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for={`condition-${i}-operator`}>{LABELS.CONDITION_OPERATOR}</label>
              <select id={`condition-${i}-operator`} bind:value={condition.comparator} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                {#each REQUEST_MATCH_OPERATORS as op}
                  <option value={op.value}>{op.label}</option>
                {/each}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for={`condition-${i}-value`}>{LABELS.CONDITION_VALUE}</label>
              <input id={`condition-${i}-value`} bind:value={condition.value} class="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-md" type="text">
            </div>
          </div>
          <div class="mt-2 flex justify-end">
            <button type="button" on:click={() => removeCondition(i)} class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Remove Condition
            </button>
          </div>
        </div>
      {/if}
    {/each}
    <div class="mt-4 flex justify-end space-x-2">
      <button type="button" on:click={addCondition} class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add Condition
      </button>
      <button type="button" on:click={addConditionGroup} class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
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
      <div class="flex flex-wrap items-end space-x-4 mb-4">
        <div class="flex-grow">
          <label for="fingerprintParam" class="block text-sm font-medium text-gray-700 mb-1">Parameter Type</label>
          <select 
            id="fingerprintParam"
            bind:value={selectedFingerprintParam}
            class="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          >
            {#each FINGERPRINT_PARAMS as param}
              <option value={param.value}>{param.label}</option>
            {/each}
          </select>
        </div>
        
        {#if selectedFingerprintParam === 'headers.name' || selectedFingerprintParam === 'headers.nameValue'}
          <div class="flex-grow">
            <label for="headerName" class="block text-sm font-medium text-gray-700 mb-1">Header Name</label>
            <input 
              id="headerName"
              type="text" 
              bind:value={headerName}
              class="w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white"
            >
          </div>
          {#if selectedFingerprintParam === 'headers.nameValue'}
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
        {:else if selectedFingerprintParam === 'body.custom'}
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
        
        <div class="flex-shrink-0">
          <button 
            type="button" 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md"
            on:click={handleAddFingerprint}
          >
            Add Parameter
          </button>
        </div>
      </div>
      <div class="mt-4 p-2 border rounded min-h-[100px] shadow-inner bg-white">
        {#each rule.fingerprint.parameters as param}
          <div class="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
            <span>{param}</span>
            <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs" on:click={() => removeFingerprint(param)}>
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
