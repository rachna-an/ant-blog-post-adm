<template>
  <div class="bg-white drawer lg:drawer-open" id="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content h-full! bg-[#F8F9FC]">
      <Navbar />

      <!-- Page content  -->
      <main class="p-6! pt-4!">
        <RouterView />
      </main>
    </div>

    <Sidebar />
  </div>
</template>

<script setup>
  import Navbar from '@/components/dashboard/Navbar.vue'
  import Sidebar from '@/components/dashboard/Sidebar.vue'
</script>

<style scoped>
  .drawer-content {
    min-height: 100vh;
  }
</style>
