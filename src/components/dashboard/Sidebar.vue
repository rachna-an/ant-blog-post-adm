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

        <li>
          <details
            :open="
              $route.name === 'article.index' ||
              $route.name === 'article.create' ||
              $route.name === 'article.edit'
            "
          >
            <summary>
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <g clip-path="url(#clip0_901_889)">
                    <path
                      d="M7 25V2.005C7 2.005 7 1 8 1H30C30 1 31 1.005 31 2.005V28.005C31 28.005 31 31 28 31H4C4 31 1 31.005 1 27.005V12.005C1 12.005 1 11 2 11H4M13 7H18M13 11H25M13 15H25M13 19H25M13 23H25"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_901_889">
                      <rect width="32" height="32" fill="white"></rect>
                    </clipPath>
                  </defs>
                </g>
              </svg>
              My Articles
            </summary>
            <ul class="pl-0">
              <li>
                <RouterLink
                  :to="{ name: 'article.index' }"
                  activeClass="menu-active"
                  class="!pl-12"
                  @click="closeDrawer"
                  >All Articles</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  :to="{ name: 'article.index' }"
                  activeClass="menu-active"
                  class="!pl-12"
                  @click="closeDrawer"
                  >Create Article</RouterLink
                >
              </li>
            </ul>
          </details>
        </li>

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
