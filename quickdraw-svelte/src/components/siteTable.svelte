<script lang="ts">
  import { onMount } from 'svelte'
  import '../app.css';

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
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>Name</th>
          <th>IOCs</th>
          <th>Edit/Delete</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
         {#if sites}
         {#each sites as site}
        <tr>
          <th>{site.name}</th>
          <td><div class="badge badge-accent badge-outline">{Object.keys(site.urls)}</div></td>
          <td>
            <button class="btn btn-xs btn-outline btn-accent">Edit</button>
            <button class="btn btn-xs btn-outline btn-error">Delete</button>
          </td>
        </tr>
        {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
