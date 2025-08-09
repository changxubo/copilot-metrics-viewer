<template>
    <div class="tiles-container">
        <v-card elevation="4" variant="elevated" class="mx-auto my-4 dark-card"
            style="width: 260px; height: 155px;background-color:#ff7f0e;width: 280px; height: 175px;">
            <v-card-item class="d-flex justify-center align-center">
                <div class="tiles-text">
                    <div class="text-overline mb-1" style="visibility: hidden;">filler</div>
                    <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
                        <template #activator="{ props }">
                            <div v-bind="props" class="text-h6 mb-1">Total Assigned </div>
                        </template>
                        <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                            <span class="text-caption" style="font-size: 10px !important;">This metric represents the
                                total number of Copilot
                                seats assigned within the current organization/enterprise.</span>
                        </v-card>
                    </v-tooltip>
                    <div class="text-caption">
                        Currently assigned seats
                    </div>
                    <p class="text-h4">{{ totalSeats.length }}</p>
                </div>
            </v-card-item>
        </v-card>

        <v-card elevation="4" variant="elevated" class="mx-auto my-3 dark-card"
            style="width: 260px; height: 155px;background-color:#9467bd;width: 280px; height: 175px;">
            <v-card-item class="d-flex justify-center align-center">
                <div class="tiles-text">
                    <div class="text-overline mb-1" style="visibility: hidden;">filler</div>
                    <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
                        <template #activator="{ props }">
                            <div v-bind="props" class="text-h6 mb-1">Assigned But Never Used</div>
                        </template>
                        <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                            <span class="text-caption" style="font-size: 10px !important;">This metric shows seats that
                                were
                                assigned but never used within the current organization/enterprise. The assigned
                                timestamp is
                                also displayed in the chart.</span>
                        </v-card>
                    </v-tooltip>
                    <div class="text-caption">
                        No show seats
                    </div>
                    <p class="text-h4">{{ noshowSeats }}</p>
                </div>
            </v-card-item>
        </v-card>
        <v-card elevation="4" variant="elevated" class="mx-auto my-4 dark-card"
            style="width: 260px; height: 155px;background-color:#2ca02c;width: 280px; height: 175px;">
            <v-card-item class="d-flex justify-center align-center">
                <div class="tiles-text">
                    <div class="text-overline mb-1" style="visibility: hidden;">filler</div>
                    <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
                        <template #activator="{ props }">
                            <div v-bind="props" class="text-h6 mb-1">No Activity in Last 7 days </div>
                        </template>
                        <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                            <span class="text-caption" style="font-size: 10px !important;">Never used seats or seats
                                used, but
                                with no activity in the past 7 days.</span>
                        </v-card>
                    </v-tooltip>
                    <div class="text-caption">
                        No use in the last 7 days
                    </div>
                    <p class="text-h4">{{ unusedSeatsInSevenDays }}</p>
                </div>
            </v-card-item>
        </v-card>
        <v-card elevation="4" variant="elevated" class="mx-auto my-4 dark-card"
            style="width: 260px; height: 155px;background-color:#1f77b4;width: 280px; height: 175px;">
            <v-card-item class="d-flex justify-center align-center">
                <div class="tiles-text">
                    <div class="text-overline mb-1" style="visibility: hidden;">filler</div>
                    <v-tooltip location="bottom start" open-on-hover open-delay="200" close-delay="200">
                        <template #activator="{ props }">
                            <div v-bind="props" class="text-h6 mb-1">No Activity in Last 30 days </div>
                        </template>
                        <v-card class="pa-2" style="background-color: #f0f0f0; max-width: 350px;">
                            <span class="text-caption" style="font-size: 10px !important;">This metric represents seats
                                with no
                                activity in the last 30 days, including those never used.</span>
                        </v-card>
                    </v-tooltip>
                    <div class="text-caption">
                        No use in the last 30 days
                    </div>
                    <p class="text-h4">{{ unusedSeatsInThirtyDays }}</p>
                </div>
            </v-card-item>
        </v-card>
    </div>

    <div>
        <v-main class="p-1" style="min-height: 300px;">
            <v-container style="min-height: 300px;max-width:100%;color:#fff;" class="px-4 elevation-2">
                <br>
                <h2>All assigned seats </h2>
                <br>
                <v-data-table :headers="headers" :items="totalSeats" :items-per-page="50" class="elevation-2 dark-card">
                    <template #item="{ item, index }">
                        <tr>
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.login }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.team }}</td>
                            <td>{{ formatLastActivity(item.last_activity_at) }}</td>
                            <td>{{ item.last_activity_editor }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-container>
        </v-main>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import type { Seat } from '@/model/Seat';
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
    name: 'SeatsAnalysisViewer',
    props: {
        seats: {
            type: Array as () => Seat[],
            required: true,
            default: () => []
        }
    },
    setup(props) {
        const totalSeats = ref<Seat[]>([]);
        const noshowSeats = ref<number>(0);
        const unusedSeatsInSevenDays = ref<number>(0);
        const unusedSeatsInThirtyDays = ref<number>(0);
        const runtimeConfig = useRuntimeConfig();
        const locale =
          (runtimeConfig.public?.locale as string | undefined) ||
          (process.client ? navigator.language : undefined) ||
          'en-US';
        // Format e.g. "Jan 05, 2025, 14:32"
        const formatLastActivity = (value?: string | null): string => {
            if (!value) return '—';
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return String(value);
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(d);
        };
        let noshowCount = 0;
        let unusedIn7Count = 0;
        let unusedIn30Count = 0;

        watchEffect(() => {
            if (props.seats && Array.isArray(props.seats)) {
                totalSeats.value = props.seats;

                const oneWeekAgo = new Date();
                const thirtyDaysAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                props.seats.forEach(seat => {
                    if (!seat.last_activity_at) {
                        noshowCount++;
                    } else {
                        const lastActivityDate = new Date(seat.last_activity_at);
                        if (lastActivityDate < oneWeekAgo) {
                            unusedIn7Count++;
                        }
                        if (lastActivityDate < thirtyDaysAgo) {
                            unusedIn30Count++;
                        }
                    }
                });

                // to sort totalSeats by last_activity_at
                totalSeats.value.sort((a, b) => {
                    if (a.last_activity_at === null) {
                        return -1;
                    }
                    if (b.last_activity_at === null) {
                        return 1;
                    }
                    return new Date(a.last_activity_at) < new Date(b.last_activity_at) ? 1 : -1;
                });
            } else {
                throw new Error('Invalid number of seats');
            }

        });

        noshowSeats.value = noshowCount;
        unusedSeatsInSevenDays.value = unusedIn7Count;
        unusedSeatsInThirtyDays.value = unusedIn30Count;

        return {
            totalSeats,
            noshowSeats: noshowSeats,
            unusedSeatsInSevenDays: unusedSeatsInSevenDays,
            unusedSeatsInThirtyDays: unusedSeatsInThirtyDays,
            formatLastActivity
        }
    },
    data() {
        return {
            headers: [
                { title: 'No', key: 'serialNumber' },
                { title: 'Login', key: 'login' },
                { title: 'Name', key: 'name' },
                { title: 'Assigning team', key: 'team' },
                { title: 'Last Activity At', key: 'last_activity_at' },
                { title: 'Last Activity Editor', key: 'last_activity_editor' },
            ],
        };
    }

});
</script>
