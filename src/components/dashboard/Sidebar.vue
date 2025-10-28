<template>
  <div class="drawer-side border-r border-base-300 z-50 lg:z-auto">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <aside class="bg-white w-[230px]">
      <!-- Logo -->
      <RouterLink
        :to="{ name: 'dashboard' }"
        class="h-[62px] flex items-center gap-2 px-4 border-b border-base-300 p-3 shadow-2xs"
      >
        <img class="w-[40px] h-[40px]" src="@/assets/images/logo.png" />
        <span class="text-[22px] text-primary font-extrabold!"> Blog Post </span>
      </RouterLink>

      <ul class="menu menu-sidebar text-base-content min-h-screen lg:min-h-auto py-4 px-0 w-full">
        <li>
          <RouterLink
            :to="{ name: 'dashboard' }"
            exactActiveClass="menu-active"
            @click="closeDrawer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12M21 12C21 7.02944 16.9706 3 12 3M21 12H19M3 12C3 7.02944 7.02944 3 12 3M3 12H5M12 3V5M13.3229 10.5C12.9703 10.1888 12.5072 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 11.4027 13.7381 10.8665 13.3229 10.5ZM13.3229 10.5L15.8229 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            Dashboard
          </RouterLink>
        </li>

        <!-- <li>
          <details
            :open="
              $route.name === 'PostList' ||
              $route.name === 'PostCreate' ||
              $route.name === 'PostEdit' ||
              $route.name === 'CategoryList'
            "
          >
            <summary>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 5V4C18 3.73478 17.8946 3.48043 17.7071 3.29289C17.5196 3.10536 17.2652 3 17 3H8.914C8.6488 3.00006 8.39449 3.10545 8.207 3.293L4.293 7.207C4.10545 7.39449 4.00006 7.64881 4 7.914V20C4 20.2652 4.10536 20.5196 4.29289 20.7071C4.48043 20.8946 4.73478 21 5 21H17C17.2652 21 17.5196 20.8946 17.7071 20.7071C17.8946 20.5196 18 20.2652 18 20V15M9 3V7C9 7.26522 8.89464 7.51957 8.70711 7.70711C8.51957 7.89464 8.26522 8 8 8H4M15.383 8.772L18.128 11.518M19.343 7.612C19.7344 8.00371 19.9542 8.53478 19.9542 9.0885C19.9542 9.64222 19.7344 10.1733 19.343 10.565L12.693 17.211L9 17.95L9.739 14.258L16.385 7.612C16.5789 7.41722 16.8094 7.26267 17.0632 7.15721C17.317 7.05175 17.5892 6.99746 17.864 6.99746C18.1388 6.99746 18.411 7.05175 18.6648 7.15721C18.9186 7.26267 19.1491 7.41722 19.343 7.612Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Post
            </summary>
            <ul class="pl-0">
              <li>
                <RouterLink
                  :to="{ name: 'PostList' || 'PostCreate' || 'PostEdit' }"
                  activeClass="menu-active"
                  class="!pl-17"
                  @click="closeDrawer"
                  >All Posts</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  :to="{ name: 'CategoryList' }"
                  activeClass="menu-active"
                  class="!pl-17"
                  @click="closeDrawer"
                  >All Categories</RouterLink
                >
              </li>
            </ul>
          </details>
        </li> -->

        <li>
          <RouterLink :to="{ name: 'category.index' }" activeClass="menu-active">
            <div class="mx-[2px]!">
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M17 22H19C21 22 22 21 22 19V17C22 15 21 14 19 14H17C15 14 14 15 14 17V19C14 21 15 22 17 22Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
            Category
          </RouterLink>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
  import { RouterLink } from 'vue-router'

  const closeDrawer = () => {
    const drawer = document.getElementById('my-drawer')
    if (drawer && drawer.checked) {
      drawer.checked = false
    }
  }
</script>

<style scoped>
  .drawer-side {
    min-height: calc(100vh - 62px);
    scrollbar-width: none;
  }
</style>
