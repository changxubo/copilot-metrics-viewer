<template>
  <div class="tiles-container">
    <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card" style="width:420px; height: 125px;">
      <v-card-item>
        <div class="tiles-text">
          <div class="spacing-5" />
          <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
            <template #activator="{ props }">
              <div v-bind="props" class="text-h6 mb-1">Cumulative Number of Turns</div>
            </template>
            <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
              <span class="text-caption" style="font-size: 10px !important;">This metric represents the total number of
                turns
                (interactions) with the Copilot over the past 28 days. A 'turn' includes both user inputs and Copilot's
                responses.</span>
            </v-card>
          </v-tooltip>
          <div class="text-caption">{{ dateRangeDescription }}</div>
          <p class="text-h4">{{ cumulativeNumberTurns }}</p>
        </div>
      </v-card-item>
    </v-card>

    <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card" style="width: 420px; height: 125px;">
      <v-card-item>
        <div class="tiles-text">
          <div class="spacing-5" />
          <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
            <template #activator="{ props }">
              <div v-bind="props" class="text-h6 mb-1">Cumulative Number of Acceptances</div>
            </template>
            <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
              <span class="text-caption" style="font-size: 10px !important;">This metric shows the total number of lines
                of
                code suggested by Copilot that have been accepted by users over the past 28 days.</span>
            </v-card>
          </v-tooltip>
          <div class="text-caption">{{ dateRangeDescription }}</div>
          <p class="text-h4">{{ cumulativeNumberAcceptances }}</p>
        </div>
      </v-card-item>
    </v-card>
  </div>

  <v-main class="tiles-container p-1" style="min-height: 300px;max-width: 100%;">
    <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card"
      style="width: 560px;">
      <v-card-item>
        <v-container style="min-height: 300px;max-width: 100%;" class="px-4 elevation-2">

          <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
            <template #activator="{ props }">
              <h2 v-bind="props" class="mb-1">Total Acceptances | Total Turns Count</h2>
            </template>
            <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
              <span class="text-caption" style="font-size: 10px !important;">This is a chart that displays the total
                number
                of
                turns and acceptances.</span>
            </v-card>
          </v-tooltip>
          <Line :data="totalNumberAcceptancesAndTurnsChartData" :options="chartOptions" />

        </v-container>
      </v-card-item>
    </v-card>
    <v-card elevation="4"  variant="elevated" class="mx-auto my-3 dark-card"
      style="width: 560px; ">
      <v-card-item>
        <v-container style="min-height: 300px;max-width: 100%;" class="px-4 elevation-2">

          <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
            <template #activator="{ props }">
              <h2 v-bind="props" class="mb-1">Total Active Copilot Chat Users</h2>
            </template>
            <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
              <span class="text-caption" style="font-size: 10px !important;">A bar chart that illustrates the total
                number
                of
                users who have actively interacted with Copilot over the past 28 days.</span>
            </v-card>
          </v-tooltip>
          <Bar :data="totalActiveCopilotChatUsersChartData" :options="totalActiveChatUsersChartOptions" />

        </v-container>
      </v-card-item>
    </v-card>

  </v-main>
</template>

<script lang="ts">
import { defineComponent, ref, toRef } from 'vue';
import type { Metrics } from '@/model/Metrics';
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default defineComponent({
  name: 'CopilotChatViewer',
  components: {
    Bar,
    Line
  },
  props: {
    metrics: {
      type: Object,
      required: true
    },
    dateRangeDescription: {
      type: String,
      default: 'Over the last 30 days'
    }
  },
  setup(props) {

    const cumulativeNumberAcceptances = ref(0);

    const cumulativeNumberTurns = ref(0);

    //Total Copilot Chat Active Users
    const totalActiveCopilotChatUsersChartData = ref<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });

    const totalActiveChatUsersChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
        }
      },
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      height: 300,
      width: 300,
      layout: {
        padding: {
          left: 15,
          right: 15,
          top: 2,
          bottom: 4
        }
      },
    };

    //Total Number Acceptances And Turns
    const totalNumberAcceptancesAndTurnsChartData = ref<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });

    const data = toRef(props, 'metrics').value;

    cumulativeNumberTurns.value = 0;
    const cumulativeNumberTurnsData = data.map((m: Metrics) => {
      cumulativeNumberTurns.value += m.total_chat_turns;
      return m.total_chat_turns;
    });

    cumulativeNumberAcceptances.value = 0;
    const cumulativeNumberAcceptancesData = data.map((m: Metrics) => {
      cumulativeNumberAcceptances.value += m.total_chat_acceptances;
      return m.total_chat_acceptances;
    });

    // Accessible, color-blind friendly palette (inspired by ColorBrewer Set1/Set2)
    const palette = {
      acceptances: '#1b9e77', // teal/green
      turns: '#d95f02',       // orange
      activeUsers: '#2171b5'  // blue
    } as const;

    // Helper to convert hex to rgba with desired alpha
    const hexToRgba = (hex: string, alpha: number) => {
      const clean = hex.replace('#', '');
      const bigint = parseInt(clean, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    totalNumberAcceptancesAndTurnsChartData.value = {
      labels: data.map((m: Metrics) => m.day),
      datasets: [
        {
          label: 'Total Acceptances',
          data: cumulativeNumberAcceptancesData,
            backgroundColor: hexToRgba(palette.acceptances, 0.15),
            borderColor: palette.acceptances,
            pointBackgroundColor: palette.acceptances,
            pointBorderColor: '#ffffff',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.25
        },
        {
          label: 'Total Turns',
          data: cumulativeNumberTurnsData,
            backgroundColor: hexToRgba(palette.turns, 0.15),
            borderColor: palette.turns,
            pointBackgroundColor: palette.turns,
            pointBorderColor: '#ffffff',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.25
        }
      ]
    };

    totalActiveCopilotChatUsersChartData.value = {
      labels: data.map((m: Metrics) => m.day),
      datasets: [
        {
          label: 'Total Active Copilot Chat Users',
          data: data.map((m: Metrics) => m.total_active_chat_users),
          backgroundColor: hexToRgba(palette.activeUsers, 0.35),
          borderColor: palette.activeUsers,
          borderWidth: 2,
          hoverBackgroundColor: hexToRgba(palette.activeUsers, 0.55),
          hoverBorderColor: palette.activeUsers
        }
      ]
    };

    return { totalActiveCopilotChatUsersChartData, totalActiveChatUsersChartOptions, cumulativeNumberAcceptances, cumulativeNumberTurns, totalNumberAcceptancesAndTurnsChartData, chartOptions };
  }
});

</script>
