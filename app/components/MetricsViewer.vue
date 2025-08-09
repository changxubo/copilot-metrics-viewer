<template>
  <div>
    <div class="tiles-container">
      <!-- Acceptance Rate Tile -->
      <!--changed on 2024/11/22 to reorder cards, so the accepance rate by counts are be more focused-->
      <v-card elevation="4" variant="elevated" class="mx-auto my-3"
        style="background-color:#1f77b4;color:#fff;width: 260px; height: 155px;border-radius:0.675rem;transition:transform 0.3s ease-in-out;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
        <v-card-item>
          <div class="tiles-text">
            <div class="spacing-5" />
            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <div v-bind="props" class="text-h6 mb-1" style="max-width: 200px;">Acceptance Rate % (by count)</div>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 250px;">
                <span class="text-caption" style="font-size: 10px !important;">This metric represents the ratio of
                  accepted
                  suggestions to the total suggestions made by GitHub Copilot. This rate indicates the relevance and
                  usefulness of
                  Copilot's suggestions based on the number of prompts, but should be used with caution as developers
                  use Copilot in
                  various ways (research, confirm, verify, etc., not always "inject").</span>
              </v-card>
            </v-tooltip>
            <div class="text-caption">
              {{ dateRangeDescription }}
            </div>
            <p class="text-h4">{{ acceptanceRateAverageByCount.toFixed(2) }}%</p>
          </div>
        </v-card-item>
      </v-card>

      <v-card elevation="4" variant="elevated" class="mx-auto my-3"
        style="background-color:#2ca02c;color:#fff;width: 260px; height: 155px;border-radius:0.675rem;transition:transform 0.3s ease-in-out;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
        <v-card-item>
          <div class="tiles-text">
            <div class="spacing-5" />
            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <div v-bind="props" class="text-h6 mb-1" style="max-width: 200px;">Total Suggestions (prompts count)</div>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 250px;">
                <span class="text-caption" style="font-size: 10px !important;">This chart illustrates the total number
                  of code
                  suggestions made by GitHub Copilot. It offers a view of the tool's activity and its engagement with
                  users
                  over time.</span>
              </v-card>
            </v-tooltip>
            <div class="text-caption">
              {{ dateRangeDescription }}
            </div>
            <p class="text-h4">{{ cumulativeNumberSuggestions }}</p>
          </div>
        </v-card-item>
      </v-card>

      <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card"
        style="background-color:#9467bd;width: 260px; height: 155px; ">
        <v-card-item>
          <div class="spacing-5" />
          <div class="tiles-text">
            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <div v-bind="props" class="text-h6 mb-1" style="max-width: 200px;">Acceptance Rate % (by lines)</div>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 250px;">
                <span class="text-caption" style="font-size: 10px !important;">This metric represents the ratio of
                  accepted
                  lines of code to the total lines suggested by GitHub Copilot. This rate indicates the relevance and
                  usefulness of Copilot's suggestions based on the volume of code, but should be used with caution as
                  developers use Copilot in various ways (research, confirm, verify, etc., not always "inject").</span>
              </v-card>
            </v-tooltip>
            <div class="text-caption">
              {{ dateRangeDescription }}
            </div>
            <p class="text-h4">{{ acceptanceRateAverageByLines.toFixed(2) }}%</p>
          </div>
        </v-card-item>
      </v-card>

      <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card"
        style="background-color:#ff7f0e;width: 260px; height: 155px;">
        <v-card-item>
          <div class="tiles-text">
            <div class="spacing-5" />
            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <div v-bind="props" class="text-h6 mb-1" style="max-width: 200px;">Total Lines of code Suggested</div>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 250px;">
                <span class="text-caption" style="font-size: 10px !important;">Showcases the total number of lines of
                  code
                  suggested by GitHub Copilot. This gives an idea of the volume of code generation and assistance
                  provided.</span>
              </v-card>
            </v-tooltip>
            <div class="text-caption">
              {{ dateRangeDescription }}
            </div>
            <p class="text-h4">{{ totalLinesSuggested }}</p>
          </div>
        </v-card-item>
      </v-card>
    </div>

    <v-main class="tiles-container p-1 " style="min-height: 300px;">
      <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card"
        style="width: 560px;">
        <v-card-item>
          <v-container style="min-height: 180px;" class="px-4 elevation-2">
            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <h2 v-bind="props">Acceptance rate by count (%)</h2>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                <span class="text-caption" style="font-size: 10px !important;">This metric represents the ratio of
                  accepted
                  suggestions to the total suggestions made by GitHub Copilot. This rate indicates the relevance and
                  usefulness of Copilot's suggestions based on the number of prompts, but should be used with caution as
                  developers use Copilot in various ways (research, confirm, verify, etc., not always "inject").</span>
              </v-card>
            </v-tooltip>
            <Bar :data="acceptanceRateByCountChartData" :options="chartOptions" />
          </v-container>
        </v-card-item>
      </v-card>
      <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card"
        style="width: 560px; ">
        <v-card-item>
          <v-container style="min-height: 180px;" class="px-4 elevation-2">

            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <h2 v-bind="props" class="mb-1">Total Suggestions / Acceptances Count</h2>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                <span class="text-caption" style="font-size: 10px !important;">This visualization focuses on the total
                  number of
                  suggestions accepted by users.</span>
              </v-card>
            </v-tooltip>
            <Line :data="totalSuggestionsAndAcceptanceChartData" :options="chartOptions" />
          </v-container>
        </v-card-item>
      </v-card>
      <v-card elevation="4"  variant="elevated" class="mx-auto my-3 dark-card"
        style="width: 560px; ">
        <v-card-item>
          <v-container style="min-height: 180px;" class="px-4 elevation-2">


            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <h2 v-bind="props" class="mb-1">Total Lines Suggested / Accepted</h2>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                <span class="text-caption" style="font-size: 10px !important;">As the name suggests, the total lines of
                  code
                  accepted by users (full acceptances) offering insights into how much of the suggested code is actually
                  being
                  utilized and incorporated into the codebase.</span>
              </v-card>
            </v-tooltip>
            <Line :data="chartData" :options="chartOptions" />
          </v-container>
        </v-card-item>
      </v-card>
      <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card"
        style="width: 560px; ">
        <v-card-item>
          <v-container style="min-height: 180px;" class="px-4 elevation-2">


            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <h2 v-bind="props">Acceptance rate by lines (%)</h2>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                <span class="text-caption" style="font-size: 10px !important;">This metric represents the ratio of
                  accepted
                  lines of code to the total lines suggested by GitHub Copilot. This rate indicates the relevance and
                  usefulness
                  of Copilot's suggestions based on the volume of code, but should be used with caution as developers
                  use
                  Copilot in various ways (research, confirm, verify, etc., not always "inject").</span>
              </v-card>
            </v-tooltip>
            <Bar :data="acceptanceRateByLinesChartData" :options="chartOptions" />
          </v-container>
        </v-card-item>
      </v-card>
      <v-card elevation="4"  variant="elevated" class="mx-auto my-3 dark-card"
        style="width: 680px;">
        <v-card-item>
          <v-container style="min-height: 180px;" class="px-4 elevation-2">



            <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
              <template #activator="{ props }">
                <h2 v-bind="props" class="mb-1">Total Active Users</h2>
              </template>
              <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                <span class="text-caption" style="font-size: 10px !important;">Represents the number of active users
                  engaging
                  with GitHub Copilot. This helps in understanding the user base growth and adoption rate.</span>
              </v-card>
            </v-tooltip>
            <Bar :data="totalActiveUsersChartData" :options="totalActiveUsersChartOptions" />
          </v-container>
        </v-card-item>
      </v-card>

    </v-main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRef, watchEffect } from 'vue';
import type { Metrics } from '@/model/Metrics';
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

import { Line, Bar } from 'vue-chartjs'

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
  name: 'MetricsViewer',
  components: {
    Line,
    Bar
  }
  ,
  props: {
    metrics: {
      type: Array as PropType<Metrics[]>,
      required: true
    },
    dateRangeDescription: {
      type: String,
      default: 'Over the last 28 days'
    }
  },
  setup(props) {

    //Tiles
    const acceptanceRateAverageByLines = ref(0);
    const acceptanceRateAverageByCount = ref(0);
    const cumulativeNumberSuggestions = ref(0);
    const cumulativeNumberAcceptances = ref(0);
    const cumulativeNumberLOCAccepted = ref(0);
    const totalLinesSuggested = ref(0);

    //Acceptance Rate by lines
    const acceptanceRateByLinesChartData = ref<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });

    //Acceptance Rate by count
    const acceptanceRateByCountChartData = ref<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });

    //Total Suggestions Count | Total Acceptance Counts
    const totalSuggestionsAndAcceptanceChartData = ref<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });

    //Total Lines Suggested | Total Lines Accepted
    const chartData = ref<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });

    //Total Active Users
    const totalActiveUsersChartData = ref<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      height: 150,
      width: 300,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 2,
          bottom: 4
        }
      },
    };

    const totalActiveUsersChartOptions = {
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

    // Unified color theme (ColorBrewer / D3 inspired) for consistency & accessibility
    const chartColors = {
      suggestions: { border: '#1f77b4', bg: 'rgba(31,119,180,0.15)' },      // blue
      acceptances: { border: '#ff7f0e', bg: 'rgba(255,127,14,0.18)' },      // orange
      linesSuggested: { border: '#2ca02c', bg: 'rgba(44,160,44,0.15)' },    // green
      linesAccepted: { border: '#d62728', bg: 'rgba(214,39,40,0.18)' },     // red
      acceptanceRateLines: { border: '#9467bd', bg: 'rgba(148,103,189,0.30)' }, // purple
      acceptanceRateCount: { border: '#8c564b', bg: 'rgba(140,86,75,0.30)' },   // brown
  // Updated active users color to a deeper base for improved contrast; individual bars will be shaded dynamically
  activeUsers: { border: '#005f73', bg: 'rgba(0,95,115,0.30)' }       // deep teal
    };

    // Watch for changes in metrics prop and recalculate all data
    watchEffect(() => {
      const data = toRef(props, 'metrics').value;

      if (!data || data.length === 0) {
        return;
      }

      cumulativeNumberSuggestions.value = 0;
      const cumulativeSuggestionsData = data.map((m: Metrics) => {
        cumulativeNumberSuggestions.value += m.total_suggestions_count;
        return m.total_suggestions_count;
      });

      cumulativeNumberAcceptances.value = 0;
      const cumulativeAcceptancesData = data.map((m: Metrics) => {
        cumulativeNumberAcceptances.value += m.total_acceptances_count;
        return m.total_acceptances_count;
      });

      totalSuggestionsAndAcceptanceChartData.value = {
        labels: data.map((m: Metrics) => m.day),
        datasets: [
          {
            label: 'Total Suggestions',
            data: cumulativeSuggestionsData,
            backgroundColor: chartColors.suggestions.bg,
            borderColor: chartColors.suggestions.border,
            fill: true,
            tension: 0.25,
            pointRadius: 2,
            pointHoverRadius: 5

          },
          {
            label: 'Total Acceptance',
            data: cumulativeAcceptancesData,
            backgroundColor: chartColors.acceptances.bg,
            borderColor: chartColors.acceptances.border,
            fill: true,
            tension: 0.25,
            pointRadius: 2,
            pointHoverRadius: 5
          },

        ]
      };

      cumulativeNumberLOCAccepted.value = 0;
      const cumulativeLOCAcceptedData = data.map((m: Metrics) => {
        const total_lines_accepted = m.total_lines_accepted;
        cumulativeNumberLOCAccepted.value += total_lines_accepted;
        return total_lines_accepted;
      });

      chartData.value = {
        labels: data.map((m: Metrics) => m.day),
        datasets: [
          {
            label: 'Total Lines Suggested',
            data: data.map((m: Metrics) => m.total_lines_suggested),
            backgroundColor: chartColors.linesSuggested.bg,
            borderColor: chartColors.linesSuggested.border,
            fill: true,
            tension: 0.25,
            pointRadius: 2,
            pointHoverRadius: 5

          },
          {
            label: 'Total Lines Accepted',
            data: cumulativeLOCAcceptedData,
            backgroundColor: chartColors.linesAccepted.bg,
            borderColor: chartColors.linesAccepted.border,
            fill: true,
            tension: 0.25,
            pointRadius: 2,
            pointHoverRadius: 5
          }
        ]
      };

      const acceptanceRatesByLines = data.map((m: Metrics) => {
        const rate = m.total_lines_suggested !== 0 ? (m.total_lines_accepted / m.total_lines_suggested) * 100 : 0;
        return rate;
      });

      const acceptanceRatesByCount = data.map((m: Metrics) => {
        const rate = m.total_suggestions_count !== 0 ? (m.total_acceptances_count / m.total_suggestions_count) * 100 : 0;
        return rate;
      });

      acceptanceRateByLinesChartData.value = {
        labels: data.map((m: Metrics) => m.day),
        datasets: [
          {
            type: 'line', // This makes the dataset a line in the chart
            label: 'Acceptance Rate by Lines',
            data: acceptanceRatesByLines,
            backgroundColor: chartColors.acceptanceRateLines.bg,
            borderColor: chartColors.acceptanceRateLines.border,
            fill: true,
            tension: 0.3,
            pointRadius: 2,
            pointHoverRadius: 5
          }
        ]
      };

      acceptanceRateByCountChartData.value = {
        labels: data.map((m: Metrics) => m.day),
        datasets: [
          {
            type: 'line', // This makes the dataset a line in the chart
            label: 'Acceptance Rate by Count',
            data: acceptanceRatesByCount,
            backgroundColor: chartColors.acceptanceRateCount.bg,
            borderColor: chartColors.acceptanceRateCount.border,
            fill: true,
            tension: 0.3,
            pointRadius: 2,
            pointHoverRadius: 5
          }
        ]
      };

      totalLinesSuggested.value = data.reduce((sum: number, m: Metrics) => sum + m.total_lines_suggested, 0);

      if (totalLinesSuggested.value === 0) {
        acceptanceRateAverageByLines.value = 0;
      } else {
        acceptanceRateAverageByLines.value = cumulativeNumberLOCAccepted.value / totalLinesSuggested.value * 100;
      }

      // Calculate acceptanceRateAverageByCount
      if (cumulativeNumberSuggestions.value === 0) {
        acceptanceRateAverageByCount.value = 0;
      } else {
        acceptanceRateAverageByCount.value = cumulativeNumberAcceptances.value / cumulativeNumberSuggestions.value * 100;
      }

      // Dynamic color scaling for Total Active Users (higher values = darker, more saturated)
      const activeUsersValues = data.map((m: Metrics) => m.total_active_users);
      const maxActive = Math.max(...activeUsersValues);
      const minActive = Math.min(...activeUsersValues);
      const activeUsersColors = activeUsersValues.map(v => {
        const norm = maxActive === minActive ? 0.5 : (v - minActive) / (maxActive - minActive); // 0..1
        const hue = 190 - norm * 40;      // shift slightly toward cyan for higher values
        const saturation = 70 + norm * 20; // 70%..90%
        const lightness = 78 - norm * 38; // 78%..40%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      });

      totalActiveUsersChartData.value = {
        labels: data.map((m: Metrics) => m.day),
        datasets: [
          {
            label: 'Total Active Users',
            data: activeUsersValues,
            backgroundColor: activeUsersColors,
            borderColor: chartColors.activeUsers.border,
            borderWidth: 1,
            hoverBackgroundColor: activeUsersColors.map(c => c.replace(/hsl\(([^)]+)\)/, (match, inner) => {
              // Slightly darken on hover: reduce lightness by 10%
              const parts = inner.split(',').map((p: string) => p.trim());
              const lIndex = 2;
              const h = parts[0];
              const s = parts[1];
              let l = parseFloat(parts[lIndex]);
              l = Math.max(20, l - 10);
              return `hsl(${h}, ${s}, ${l}%)`;
            })),
            barPercentage: 0.7,
            categoryPercentage: 0.6
          }
        ]
      };

    }); // end of watchEffect

    return {
      totalSuggestionsAndAcceptanceChartData, chartData,
      chartOptions, totalActiveUsersChartData,
      totalActiveUsersChartOptions, acceptanceRateByLinesChartData, acceptanceRateByCountChartData, acceptanceRateAverageByLines, acceptanceRateAverageByCount, cumulativeNumberSuggestions,
      cumulativeNumberAcceptances, cumulativeNumberLOCAccepted, totalLinesSuggested
    };
  },
  data() {
    return {
      data: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },

});
</script>
