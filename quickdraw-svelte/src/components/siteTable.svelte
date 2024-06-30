<script lang="ts">
  import { onMount } from 'svelte'

  let sites: {name: string}[] = []

  onMount(() => {
    chrome.storage.sync.get(['sites', 'hotkeyBindings'], (result) => {
      sites = result.sites || []
      console.log('sites :>> ', sites);
      // const hotkeyBindings = result.hotkeyBindings || []
    })
  })


</script>


<div>
  {#if sites}
  <ul>
    {#each sites as site}
    <li>
      <span>{site.name}</span>
      {#each site.urls as urls}
      <span>{JSON.stringify(Object.keys(urls))}</span>
      {/each}
    </li> 
  {/each}
  </ul>
  {:else}
  <div>
    <span>No sites configured</span>
  </div>
  {/if}
</div>
