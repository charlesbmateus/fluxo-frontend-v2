<template>
  <div>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface Props {
  type: 'line' | 'bar' | 'pie' | 'doughnut'
  data: any
  options?: any
}

const props = defineProps<Props>()

const chartRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

const initChart = () => {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartRef.value, {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      ...props.options,
    },
  })
}

watch(
  () => [props.data, props.type],
  () => {
    initChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
