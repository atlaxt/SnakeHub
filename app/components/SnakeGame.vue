<script setup lang="ts">
import { useColorMode } from '#imports'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

// -- Eventler --
const emits = defineEmits<{
  (e: 'update:score', score: number): void
  (e: 'game-state', state: 'playing' | 'gameover' | 'idle'): void
}>()

// -- Ayarlar --
const GRID_SIZE = 25
const TILE_COUNT_X = 32
const TILE_COUNT_Y = 20
const BOARD_WIDTH = TILE_COUNT_X * GRID_SIZE
const BOARD_HEIGHT = TILE_COUNT_Y * GRID_SIZE
const BASE_SPEED = 70

// -- Renkler (Siyah/Beyaz Minimalist) --
const colorMode = useColorMode()
const colors = computed(() => {
  const isDark = colorMode.value === 'dark'
  // Ana renk: Dark ise Beyaz, Light ise Siyah
  const mainColor = isDark ? '#ffffff' : '#000000'

  return {
    bg: 'transparent', // Şeffaf arkaplan
    grid: 'transparent', // Görünmez ızgara
    snake: mainColor,
    food: mainColor,
    text: mainColor,
    // Glow sadece dark modda beyaz için hafifçe olsun
    glowStrength: isDark ? 15 : 0,
    glowColor: isDark ? 'rgba(255,255,255,0.6)' : 'transparent',
  }
})

// -- Değişkenler --
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

interface Point { x: number, y: number }
class Particle {
  x: number; y: number; vx: number; vy: number; life: number; color: string
  constructor(x: number, y: number, color: string) {
    this.x = x; this.y = y
    this.vx = (Math.random() - 0.5) * 10
    this.vy = (Math.random() - 0.5) * 10
    this.life = 1.0
    this.color = color
  }

  update() { this.x += this.vx; this.y += this.vy; this.life -= 0.04 }
}

let snake: Point[] = []
let food: Point = { x: 0, y: 0 }
let velocity: Point = { x: 0, y: 0 }
let nextVelocity: Point = { x: 0, y: 0 }
let particles: Particle[] = []
let score = 0
let gameState: 'idle' | 'playing' | 'gameover' = 'idle'
let lastRenderTime = 0
let snakeMoveTimer = 0

// -- Oyun Mantığı --

// Oyunu Başlat
function initGame() {
  if (gameState === 'playing')
    return

  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
  velocity = { x: 1, y: 0 }
  nextVelocity = { x: 1, y: 0 }
  score = 0
  particles = []
  gameState = 'playing'

  emits('update:score', 0)
  emits('game-state', 'playing')
  spawnFood()
}

// Oyunu Güncelle
function update(dt: number) {
  particles.forEach(p => p.update())
  particles = particles.filter(p => p.life > 0)

  if (gameState !== 'playing')
    return

  snakeMoveTimer += dt
  if (snakeMoveTimer < BASE_SPEED)
    return
  snakeMoveTimer = 0

  velocity = { ...nextVelocity }
  const head = { x: snake[0]!.x + velocity.x, y: snake[0]!.y + velocity.y }

  // --- DUVARLARDAN GEÇME (WRAP) ---
  if (head.x < 0)
    head.x = TILE_COUNT_X - 1
  else if (head.x >= TILE_COUNT_X)
    head.x = 0

  if (head.y < 0)
    head.y = TILE_COUNT_Y - 1
  else if (head.y >= TILE_COUNT_Y)
    head.y = 0
  // --------------------------------

  // Kendine Çarpma Kontrolü
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    return gameOver()
  }

  snake.unshift(head)

  // Yem Yeme
  if (head.x === food.x && head.y === food.y) {
    score += 10
    emits('update:score', score)
    createExplosion(food.x, food.y, colors.value.food)
    spawnFood()
  }
  else {
    snake.pop()
  }
}

function gameOver() {
  gameState = 'gameover'
  createExplosion(snake[0]!.x, snake[0]!.y, colors.value.snake)
  emits('game-state', 'gameover')
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * TILE_COUNT_X),
    y: Math.floor(Math.random() * TILE_COUNT_Y),
  }
  if (snake.some(s => s.x === food.x && s.y === food.y))
    spawnFood()
}

function createExplosion(x: number, y: number, color: string) {
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(x * GRID_SIZE + GRID_SIZE / 2, y * GRID_SIZE + GRID_SIZE / 2, color))
  }
}

// -- Çizim --
function draw() {
  if (!ctx || !canvasRef.value)
    return
  const c = colors.value

  // 1. Temizle (Şeffaf arkaplan için clearRect kullanıyoruz)
  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT)

  // 2. Grid (Rengi transparent olduğu için görünmeyecek)
  ctx.strokeStyle = c.grid
  ctx.lineWidth = 0.5
  ctx.beginPath()
  for (let x = 0; x <= BOARD_WIDTH; x += GRID_SIZE) { ctx.moveTo(x, 0); ctx.lineTo(x, BOARD_HEIGHT) }
  for (let y = 0; y <= BOARD_HEIGHT; y += GRID_SIZE) { ctx.moveTo(0, y); ctx.lineTo(BOARD_WIDTH, y) }
  ctx.stroke()

  // 3. Yem
  const pulse = Math.sin(Date.now() / 200) * 5
  ctx.shadowBlur = c.glowStrength + pulse
  ctx.shadowColor = c.glowColor
  ctx.fillStyle = c.food
  ctx.beginPath()
  ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 - 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // 4. Yılan
  ctx.fillStyle = c.snake
  snake.forEach((seg, i) => {
    const isHead = i === 0
    if (isHead) {
      ctx!.shadowBlur = c.glowStrength
      ctx!.shadowColor = c.glowColor
    }
    // Kare çizimi (hafif padding ile)
    ctx!.fillRect(seg.x * GRID_SIZE + 1, seg.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2)
    ctx!.shadowBlur = 0
  })

  // 5. Partiküller
  particles.forEach((p) => {
    ctx!.globalAlpha = p.life
    ctx!.fillStyle = p.color
    ctx!.beginPath()
    ctx!.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx!.fill()
  })
  ctx.globalAlpha = 1.0

  // 6. UI Mesajları
  if (gameState === 'idle') {
    drawCenterText('CLICK OR PRESS ENTER', 24)
  }
  else if (gameState === 'gameover') {
    drawCenterText('GAME OVER', 32)
    drawSubText('Click to Restart', 16)
  }
}

function drawCenterText(text: string, size: number) {
  ctx!.fillStyle = colors.value.text
  ctx!.font = `bold ${size}px monospace`
  ctx!.textAlign = 'center'
  ctx!.textBaseline = 'middle'
  // Metinlerde de hafif glow olsun dark modda
  ctx!.shadowBlur = colors.value.glowStrength
  ctx!.shadowColor = colors.value.glowColor
  ctx!.fillText(text, BOARD_WIDTH / 2, BOARD_HEIGHT / 2)
  ctx!.shadowBlur = 0
}

function drawSubText(text: string, size: number) {
  ctx!.fillStyle = colors.value.text
  ctx!.font = `${size}px monospace`
  ctx!.textAlign = 'center'
  ctx!.fillText(text, BOARD_WIDTH / 2, BOARD_HEIGHT / 2 + 35)
}

// -- Döngü ve Klavye --
function loop(timestamp: number) {
  const dt = timestamp - lastRenderTime
  lastRenderTime = timestamp
  update(dt)
  draw()
  requestAnimationFrame(loop)
}

function handleKeydown(e: KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault()
  }

  if ((e.key === 'Enter' || e.key === ' ') && gameState !== 'playing') {
    initGame()
    return
  }

  if (gameState !== 'playing')
    return

  switch (e.key) {
    case 'ArrowUp': if (velocity.y === 0)
      nextVelocity = { x: 0, y: -1 }; break
    case 'ArrowDown': if (velocity.y === 0)
      nextVelocity = { x: 0, y: 1 }; break
    case 'ArrowLeft': if (velocity.x === 0)
      nextVelocity = { x: -1, y: 0 }; break
    case 'ArrowRight': if (velocity.x === 0)
      nextVelocity = { x: 1, y: 0 }; break
  }
}

function handleCanvasClick() {
  if (gameState !== 'playing') {
    initGame()
  }
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    // Başlangıçta bir kez çiz ki boş kalmasın
    draw()
    requestAnimationFrame(loop)
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Tema değişince anında yeniden çiz
watch(colorMode, () => {
  draw()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="BOARD_WIDTH"
    :height="BOARD_HEIGHT"
    class="rounded-md block bg-muted cursor-none touch-none w-full h-auto max-w-[800px] select-none border border-default transition-colors"
    @click="handleCanvasClick"
  />
</template>
