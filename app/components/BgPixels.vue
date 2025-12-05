<script setup lang="ts">
import { useColorMode } from '#imports'
import { onMounted, onUnmounted, ref } from 'vue'

const colorMode = useColorMode()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const GRID_SIZE = 20
const GAP = 4
const SPAWN_RATE = 0.40
const FADE_SPEED = 0.008

class Pixel {
  x: number; y: number; alpha: number; fadingOut: boolean
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.alpha = 0
    this.fadingOut = false
  }
}

let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
const pixels: Pixel[] = []
let animationId: number

function getColor(alpha: number) {
  const isDark = colorMode.value === 'dark'

  const r = isDark ? 100 : 148
  const g = isDark ? 116 : 163
  const b = isDark ? 139 : 184

  return `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`
}

function resize() {
  if (!canvasRef.value)
    return
  width = window.innerWidth
  height = window.innerHeight
  canvasRef.value.width = width
  canvasRef.value.height = height
}

function loop() {
  if (!ctx)
    return
  ctx.clearRect(0, 0, width, height)

  if (Math.random() < SPAWN_RATE) {
    const col = Math.floor(Math.random() * (width / GRID_SIZE))
    const row = Math.floor(Math.random() * (height / GRID_SIZE))
    const x = col * GRID_SIZE
    const y = row * GRID_SIZE

    const exists = pixels.some(p => p.x === x && p.y === y)
    if (!exists) {
      pixels.push(new Pixel(x, y))
    }
  }

  for (let i = pixels.length - 1; i >= 0; i--) {
    const p = pixels[i]!

    if (!p.fadingOut) {
      p.alpha += FADE_SPEED
      if (p.alpha >= 1)
        p.fadingOut = true
    }
    else {
      p.alpha -= FADE_SPEED
      if (p.alpha <= 0) {
        pixels.splice(i, 1)
        continue
      }
    }

    ctx.fillStyle = getColor(p.alpha)
    const size = GRID_SIZE - GAP
    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(p.x + GAP / 2, p.y + GAP / 2, size, size, 3)
      ctx.fill()
    }
    else {
      ctx.fillRect(p.x + GAP / 2, p.y + GAP / 2, size, size)
    }
  }

  animationId = requestAnimationFrame(loop)
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    loop()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none"
  />
</template>
