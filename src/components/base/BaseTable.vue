<template>
  <table class="table">
    <thead>
      <tr class="bg-zinc-100 border-b-base-300">
        <th class="py-4" v-for="column in columns" :key="column.key">
          <span class="!font-bold">
            {{ column.label }}
          </span>
        </th>
        <th class="text-center w-[10%]">Actions</th>
      </tr>
    </thead>

    <!-- Loading Skeleton -->
    <tbody v-if="isLoading" data-testid="table-skeleton">
      <tr v-for="n in 5" :key="n">
        <td :colspan="columns.length + 2">
          <div class="flex items-center gap-4 py-2">
            <div class="flex-1 grid gap-2">
              <div class="skeleton h-3 w-full"></div>
              <div class="skeleton h-3 w-full"></div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>

    <tbody v-else class="text-neutral">
      <!-- No Data -->
      <tr v-if="items.length === 0">
        <td :colspan="columns.length + 2">
          <div class="grid grid-cols-1 place-items-center gap-4 py-14">
            <img src="@/assets/svg/no-data.svg" alt="No data" />
            <p class="text-2xl !font-semibold text-primary">No Data Found</p>
          </div>
        </td>
      </tr>

      <tr v-else v-for="item in items" :key="item.id">
        <td v-for="column in columns" :key="column.key">
          <slot :name="`column-${column.key}`" :item="item" :value="item[column.key]">
            {{ item[column.key] }}
          </slot>
        </td>

        <!-- Actions -->
        <td class="flex items-center gap-4 justify-center">
          <button
            class="btn btn-icon"
            data-testid="btn-delete"
            data-tip="Delete"
            @click="$emit('delete', item.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                stroke="#4A5568"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            class="btn btn-icon"
            data-testid="btn-edit"
            data-tip="Edit"
            @click="$emit('edit', item.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M10.779 17.7792L4.35999 19.9182L6.49999 13.5002M10.779 17.7792L19.143 9.13619C19.5655 8.71276 19.853 8.17364 19.9694 7.58691C20.0857 7.00018 20.0256 6.39214 19.7966 5.83954C19.5677 5.28694 19.1801 4.81456 18.6829 4.48203C18.1857 4.14951 17.6011 3.97175 17.003 3.97119C16.2005 3.97147 15.4308 4.29011 14.863 4.85719L6.49999 13.5002M10.779 17.7792L6.49999 13.5002M8.63899 15.6402L14.852 9.13619M12.75 7.04019L17 11.2802"
                stroke="#4A5568"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <BasePagination
    v-model="currentPage"
    :totalItems="totalItems"
    :perPage="perPage"
    :isLoading="isLoading"
  />
</template>

<script setup>
  import BasePagination from '@/components/base/BasePagination.vue'

  const props = defineProps({
    columns: { type: Array, required: true },
    items: { type: Array, required: true },
    isLoading: { type: Boolean, default: false },
    totalItems: { type: Number, default: 0 },
    perPage: { type: Number, default: 10 },
  })
  const emit = defineEmits(['delete', 'edit'])

  const currentPage = defineModel("currentPage", Number, { default: 1 });

</script>

<style>
  table tr th,
  table tr td {
    padding-inline: 1.5rem !important;
  }

  tbody tr td:first-of-type {
    font-weight: 600 !important;
    color: var(--color-neutral) !important;
  }

  tbody tr td {
    padding-block: 0.5rem !important;
  }
</style>
