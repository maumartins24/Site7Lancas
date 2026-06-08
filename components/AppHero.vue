<template>
  <section class="hero-section">

    <!-- ══ VÍDEO DE FUNDO ══ -->
    <!-- 🔧 Coloque o arquivo em public/videos/hero.mp4 -->
    <div class="video-wrap">
      <video
        v-if="videoLoaded"
        autoplay
        muted
        loop
        playsinline
        class="hero-video"
        @canplay="videoReady = true"
        :class="{ 'opacity-0': !videoReady, 'opacity-100': videoReady }"
      >
        <source :src="videoSrc" type="video/mp4" />
      </video>

      <!-- Fallback enquanto não tem vídeo -->
      <div v-if="!videoReady" class="video-fallback" />
    </div>

    <!-- ══ CAMADAS DE OVERLAY ══ -->

    <!-- 1. Escurecimento geral para o vídeo não competir com o texto -->
    <div class="overlay-dark" />

    <!-- 2. Padrão Adinkra por cima do vídeo -->
    <div class="overlay-adinkra" />

    <!-- 3. Gradiente lateral esquerdo — faz o texto se destacar -->
    <div class="overlay-left" />

    <!-- 4. Gradiente inferior — ancora o conteúdo -->
    <div class="overlay-bottom" />

    <!-- 5. Triângulos geométricos decorativos nos cantos -->
    <svg class="geo-tl" viewBox="0 0 300 300" preserveAspectRatio="none">
      <polygon points="0,0 180,0 0,180" fill="rgba(212,160,23,0.06)" />
      <polygon points="0,0 100,0 0,100" fill="none" stroke="rgba(212,160,23,0.15)" stroke-width="1" />
    </svg>
    <svg class="geo-br" viewBox="0 0 300 300" preserveAspectRatio="none">
      <polygon points="300,300 120,300 300,120" fill="rgba(192,57,43,0.06)" />
      <polygon points="300,300 200,300 300,200" fill="none" stroke="rgba(212,160,23,0.12)" stroke-width="1" />
    </svg>

    <!-- Símbolo Adinkra decorativo canto superior direito -->
    <svg class="adinkra-symbol" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke="#D4A017" stroke-width="1"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#C0392B" stroke-width="0.7"/>
      <circle cx="50" cy="50" r="16" fill="none" stroke="#D4A017" stroke-width="1"/>
      <line x1="50" y1="6"  x2="50" y2="94" stroke="#D4A017" stroke-width="0.6"/>
      <line x1="6"  y1="50" x2="94" y2="50" stroke="#D4A017" stroke-width="0.6"/>
      <line x1="19" y1="19" x2="81" y2="81" stroke="#C0392B" stroke-width="0.4"/>
      <line x1="81" y1="19" x2="19" y2="81" stroke="#C0392B" stroke-width="0.4"/>
    </svg>

    <!-- ══ CONTEÚDO ══ -->
    <div class="hero-content">
      <div class="hero-inner">

        <!-- Label -->
        <div class="hero-label fade-up">
          <div class="kente-thin-bar" />
          <span>Templo Umbandista</span>
        </div>

        <!-- Título -->
        <h1 class="hero-title fade-up fade-up-1">
          Terreiro<br>
          <span class="hero-title-gold">Ogum</span><br>
          7 Lanças
        </h1>

        <!-- Subtítulo -->
        <p class="hero-sub fade-up fade-up-2">
          ⚔️ Umbanda, cultura negra de terreiro.<br>
          Sr. Ogum Sete Lanças e Pai João de Aruanda.
        </p>

        <!-- CTAs -->
        <div class="hero-ctas fade-up fade-up-3">
          <a href="#sobre" class="btn-primary">Conheça o Terreiro</a>
          <NuxtLink to="/arrecadacao" class="btn-outline">Apoiar a Campanha 💛</NuxtLink>
        </div>

      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-hint fade-up fade-up-3">
      <span>Role</span>
      <div class="scroll-line" />
    </div>

    <!-- Faixa kente na base -->
    <div class="kente-bottom" />

  </section>
</template>

<script setup lang="ts">
const videoLoaded = ref(false)
const videoReady  = ref(false)
const videoSrc    = ref('')

onMounted(() => {
  // String atribuída em runtime — Rollup não tenta resolver como módulo
  videoSrc.value    = '/videos/hero.mp4'
  videoLoaded.value = true
})
</script>

<style scoped>
/* ── SEÇÃO ── */
.hero-section {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0d0b08;
}

/* ── VÍDEO ── */
.video-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 1.2s ease;
}
.video-fallback {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 60% 40%, #1c1812 0%, #0d0b08 70%);
}

/* ── OVERLAYS ── */
.overlay-dark {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(13, 11, 8, 0.55);
}
.overlay-adinkra {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32,5 59,32 32,59 5,32' fill='none' stroke='%23D4A017' stroke-width='0.7' opacity='0.18'/%3E%3Cline x1='32' y1='5' x2='32' y2='59' stroke='%23C0392B' stroke-width='0.3' opacity='0.1'/%3E%3Cline x1='5' y1='32' x2='59' y2='32' stroke='%23C0392B' stroke-width='0.3' opacity='0.1'/%3E%3C/svg%3E");
  pointer-events: none;
}
.overlay-left {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: linear-gradient(
    105deg,
    rgba(13,11,8,0.90) 0%,
    rgba(13,11,8,0.70) 35%,
    rgba(13,11,8,0.20) 65%,
    rgba(13,11,8,0.00) 100%
  );
  pointer-events: none;
}
.overlay-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  z-index: 3;
  background: linear-gradient(to top, rgba(13,11,8,0.85) 0%, transparent 100%);
  pointer-events: none;
}

/* ── GEOMETRIA DECORATIVA ── */
.geo-tl {
  position: absolute;
  top: 0; left: 0;
  width: 280px; height: 280px;
  z-index: 4;
  pointer-events: none;
}
.geo-br {
  position: absolute;
  bottom: 0; right: 0;
  width: 320px; height: 320px;
  z-index: 4;
  pointer-events: none;
}
.adinkra-symbol {
  position: absolute;
  top: 28px; right: 40px;
  width: 100px; height: 100px;
  z-index: 4;
  opacity: 0.18;
  pointer-events: none;
}
@media (max-width: 768px) {
  .adinkra-symbol { width: 64px; height: 64px; top: 16px; right: 16px; }
  .geo-tl, .geo-br { width: 180px; height: 180px; }
}

/* ── CONTEÚDO ── */
.hero-content {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 5rem;
}
.hero-inner {
  max-width: 80rem;
  margin: 0 auto;
  width: 100%;
  padding: 0 1.5rem;
}
@media (min-width: 768px) {
  .hero-inner { padding: 0 2.5rem; }
}

/* Label */
.hero-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #D4A017;
  margin-bottom: 1.5rem;
}
.kente-thin-bar {
  width: 32px;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    #D4A017 0, #D4A017 10px,
    #C0392B 10px, #C0392B 13px,
    #D4A017 13px, #D4A017 20px,
    #0d0b08 20px, #0d0b08 22px
  );
}

/* Título */
.hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(3.5rem, 9vw, 7rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 0.92;
  letter-spacing: -2px;
  margin-bottom: 1.5rem;
  /* Sombra sutil para destacar do vídeo */
  text-shadow: 0 2px 40px rgba(0,0,0,0.6), 0 0 80px rgba(0,0,0,0.4);
}
.hero-title-gold {
  color: #D4A017;
  font-style: italic;
}

/* Subtítulo */
.hero-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.15rem);
  color: #c8bfb0;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 28rem;
  text-shadow: 0 1px 12px rgba(0,0,0,0.8);
}

/* CTAs */
.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 14px 28px;
  background: #D4A017;
  color: #0d0b08;
  text-decoration: none;
  transition: all 0.25s;
  clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
}
.btn-primary:hover { background: #e6b320; }
.btn-outline {
  display: inline-flex;
  align-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 13px 28px;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.35);
  text-decoration: none;
  transition: all 0.25s;
}
.btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }

/* ── SCROLL HINT ── */
.scroll-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.3);
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
}
.scroll-line {
  width: 1px;
  height: 36px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.35), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50%       { opacity: 0.8; transform: scaleY(1.1); }
}

/* ── KENTE BASE ── */
.kente-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 5px;
  z-index: 11;
  background: repeating-linear-gradient(
    90deg,
    #D4A017 0,   #D4A017 20px,
    #C0392B 20px, #C0392B 27px,
    #D4A017 27px, #D4A017 40px,
    #0d0b08 40px, #0d0b08 44px
  );
}

/* ── ANIMAÇÕES ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up   { animation: fadeUp 0.8s ease both; }
.fade-up-1 { animation-delay: 0.12s; }
.fade-up-2 { animation-delay: 0.24s; }
.fade-up-3 { animation-delay: 0.38s; }
</style>
