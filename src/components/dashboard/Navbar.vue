<template>
  <nav
    class="navbar min-h-[62px] bg-base-100 border-b border-base-300 sticky top-0 z-10 shadow-2xs"
  >
    <div class="navbar-start">
      <div class="!h-[61px] w-[10px] bg-white absolute -left-1.5"></div>

      <label for="my-drawer" class="btn btn-square bg-transparent border-0 drawer-button lg:hidden">
        <svg
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </label>
    </div>

    <!-- Profile -->
    <div class="navbar-end py-0 my-0">
      <div class="flex gap-2">
        <div class="flex flex-col items-end justify-center gap-1/2">
          <h1 class="text-neutral !text-base !font-bold">
            {{ user.firstName }} {{ user.lastName }}
          </h1>
          <span
            class="block text-xs text-neutral !font-medium truncate max-w-[200px] sm:max-w-full"
            >{{ user.email }}</span
          >
        </div>
        <div class="dropdown dropdown-end dropdown-hover">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="Profile Picture" :src="user.avatar" />
            </div>
          </div>
          <ul
            :class="[
              'dropdown-content menu menu-sm bg-base-100 border border-base-300 rounded-xl w-55 z-1 px-0 mt-[6px]! shadow',
              hideDropdown && 'hidden',
            ]"
            tabindex="0"
          >
            <div class="w-55 h-10 absolute -top-8"></div>

            <li>
              <RouterLink :to="{ name: 'dashboard' }" class="gap-2" @click="closeDropdownMenu">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17V18C7 18.2652 7.10536 18.5196 7.29289 18.7071C7.48043 18.8946 7.73478 19 8 19H16C16.2652 19 16.5196 18.8946 16.7071 18.7071C16.8946 18.5196 17 18.2652 17 18V17C17 16.2044 16.6839 15.4413 16.1213 14.8787C15.5587 14.3161 14.7956 14 14 14H10C9.20435 14 8.44129 14.3161 7.87868 14.8787C7.31607 15.4413 7 16.2044 7 17ZM15 8C15 8.79565 14.6839 9.55871 14.1213 10.1213C13.5587 10.6839 12.7956 11 12 11C11.2044 11 10.4413 10.6839 9.87868 10.1213C9.31607 9.55871 9 8.79565 9 8C9 7.20435 9.31607 6.44129 9.87868 5.87868C10.4413 5.31607 11.2044 5 12 5C12.7956 5 13.5587 5.31607 14.1213 5.87868C14.6839 6.44129 15 7.20435 15 8Z"
                    stroke="#114E5E"
                    stroke-width="2"
                  />
                </svg>
                My Profile
              </RouterLink>
            </li>

            <li>
              <a class="gap-2" @click="showLogoutModal">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 12H8M20 12L16 16M20 12L16 8M9 4H7C6.20435 4 5.44129 4.31607 4.87868 4.87868C4.31607 5.44129 4 6.20435 4 7V17C4 17.7956 4.31607 18.5587 4.87868 19.1213C5.44129 19.6839 6.20435 20 7 20H9"
                    stroke="#BB2124"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- Logout modal -->
  <ConfirmationModal
    v-model:visible="isLogout"
    title="Logout"
    message="Are you sure you want to logout?"
    :loading="authStore.isLoggingOut"
    :buttonText="authStore.isLoggingOut ? 'Logging out' : 'Logout'"
    @confirm="handleLogout"
  />
</template>
<script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  import { ref, computed } from 'vue'

  const authStore = useAuthStore()
  const router = useRouter()

  const isLogout = ref(false)
  const hideDropdown = ref(false)
  const user = computed(() => authStore.getUser)

  const showLogoutModal = () => {
    isLogout.value = true
  }
  const handleLogout = async () => {
    await authStore.logout()
    router.push({ name: 'login' })
  }

  const closeDropdownMenu = () => {
    hideDropdown.value = true
    setTimeout(() => {
      hideDropdown.value = false
    }, 300)
  }
</script>
