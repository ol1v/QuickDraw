<script>
  import SiteTable from "../components/siteTable.svelte"
  import AddHotkey from "../components/addHotkey.svelte"

</script>
<div>
  <h1>Settings page</h1>
  <p>Settings page content</p>
  <div class="bg-base-200 collapse collapse-arrow w-2/3 p-8">
    <input type="checkbox" class="peer" />
    <div
      class="collapse-title bg-primary/30 text-xl font-medium peer-checked:bg-secondary peer-checked:text-secondary-content">
      Configured sites
    </div>
    <div
      class="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
      <SiteTable class="w-2/3"/>
    </div>
  </div>
  <AddHotkey />
</div>
