<script>
  export let rule;
  export let onClose;
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
  <div class="relative p-8 border w-full max-w-xl shadow-lg rounded-md bg-white">
    <h3 class="text-2xl leading-6 font-medium text-gray-900 mb-4">Rule Details</h3>
    <pre class="text-left whitespace-pre-wrap break-words bg-gray-100 p-4 rounded">{JSON.stringify(rule, null, 2)}</pre>
    <button 
      on:click={onClose}
      class="mt-6 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
    >
      Close
    </button>
  </div>
</div>
