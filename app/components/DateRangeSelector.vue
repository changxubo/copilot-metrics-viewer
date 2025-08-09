<template>
  <v-card class="pa-1 ma-1 mx-10" elevation="2" style="color:#fff;background-color: rgb(21, 27, 35); border-radius: 0.675rem;">
    <v-card-title class="text-h6 pb-1" style="display:none;">Date Range Filter</v-card-title>
    <v-row align="end" class="pt-2 px-2">
      <v-col cols="6" sm="2">
        <v-card-text class="text-h6 mb-5">
          Date Range
        </v-card-text>
      </v-col>
      <v-col cols="6" sm="2">
        <v-text-field v-model="fromDate" label="From Date" type="date" variant="outlined" density="compact"
          @update:model-value="updateDateRange" />
      </v-col>
      <v-col cols="6" sm="2">
        <v-text-field v-model="toDate" label="To Date" type="date" variant="outlined" density="compact"
          @update:model-value="updateDateRange" />
      </v-col>
      <v-col cols="6" sm="3">
        <v-checkbox v-model="excludeHolidays" label="Exclude holidays" density="compact" />
      </v-col>
      <v-col cols="6" sm="3" class="d-flex align-center justify-start" style="padding-bottom: 35px;">
        <v-btn color="white" size="default" class="mr-3" @click="resetToDefault">
          Last 60 Days
        </v-btn>
        <v-btn color="white" size="default" :loading="loading" @click="applyDateRange">
          Apply
        </v-btn>
      </v-col>
    </v-row>
    <v-card-text class="pt-0" style="display:none;">
      <span class="text-caption text-medium-emphasis">
        {{ dateRangeText }}
      </span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'date-range-changed', value: {
    since?: string;
    until?: string;
    description: string;
    excludeHolidays?: boolean;
  }): void
}

withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// Calculate default dates (last 30 days)
const today = new Date()
const defaultFromDate = new Date(today.getTime() - 59 * 24 * 60 * 60 * 1000) // 29 days ago to include today

const fromDate = ref(formatDate(defaultFromDate))
const toDate = ref(formatDate(today))
const excludeHolidays = ref(false)


function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] || ''
}

function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00.000Z')
}

const dateRangeText = computed(() => {
  if (!fromDate.value || !toDate.value) {
    return 'Select date range'
  }

  const from = parseDate(fromDate.value)
  const to = parseDate(toDate.value)
  const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const withoutHolidays = excludeHolidays.value ? ' (excluding holidays/weekends)' : ''

  if (diffDays === 1) {
    return `For ${from.toLocaleDateString()}${withoutHolidays}`
  } else if (diffDays <= 60 && isLast60Days()) {
    return `Over the last 60 days ${withoutHolidays}`
  } else {
    return `From ${from.toLocaleDateString()} to ${to.toLocaleDateString()} (${diffDays} days)${withoutHolidays}`
  }
})

function isLast60Days(): boolean {
  if (!fromDate.value || !toDate.value) return false

  const today = new Date()
  const expectedFromDate = new Date(today.getTime() - 59 * 24 * 60 * 60 * 1000)

  const from = parseDate(fromDate.value)
  const to = parseDate(toDate.value)

  return (
    from.toDateString() === expectedFromDate.toDateString() &&
    to.toDateString() === today.toDateString()
  )
}

function updateDateRange() {
  // This function is called when dates change, but we don't auto-apply
  // User needs to click Apply button
}

function resetToDefault() {
  const today = new Date()
  const defaultFrom = new Date(today.getTime() - 59 * 24 * 60 * 60 * 1000)

  fromDate.value = formatDate(defaultFrom)
  toDate.value = formatDate(today)
}

function applyDateRange() {
  if (!fromDate.value || !toDate.value) {
    return
  }

  const from = parseDate(fromDate.value)
  const to = parseDate(toDate.value)

  if (from > to) {
    // Swap dates if from is after to
    const temp = fromDate.value
    fromDate.value = toDate.value
    toDate.value = temp
  }

  // Emit the date range change with holiday options
  emit('date-range-changed', {
    since: fromDate.value,
    until: toDate.value,
    description: dateRangeText.value,
    excludeHolidays: excludeHolidays.value,
  })
}

// Initialize with default range on mount
onMounted(() => {
  applyDateRange()
})
</script>