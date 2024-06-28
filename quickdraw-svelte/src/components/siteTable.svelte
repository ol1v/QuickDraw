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
  {#each sites as site}
    <div>
      <span>{JSON.stringify(site)}</span>
    </div> 
  {/each}
</div>
