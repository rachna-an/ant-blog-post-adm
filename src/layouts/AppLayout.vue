<template>
  <div class="bg-white drawer lg:drawer-open" id="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content h-full! bg-[#F8F9FC]">
      <!-- <DashboardNavbar /> -->

      <!-- Page content  -->
      <main class="p-6! pt-4!">
        <RouterView />
      </main>
    </div>

    <!-- <DashboardSidebar /> -->
  </div>
</template>

<script setup>
  //   import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
  //   import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
</script>

<style scoped>
  .drawer-content {
    min-height: 100vh;
  }
</style>
