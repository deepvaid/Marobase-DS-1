<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'

const router = useRouter()

// To look like a dedicated marketing landing page, we want a dark motif.
// But we'll mostly handle this via scoped CSS to not mess up the global state permanently.
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// Video assets from public folder
const assets = {
  copilot: '/da-vinci-media/purple_theme_verify_1774558182854.webp',
  builder: '/da-vinci-media/theme_builder_demo_1774557744799.webp',
  marketing: '/da-vinci-media/da_vinci_demo_1774554648320.webp',
  insights: '/da-vinci-media/verify_chart_update_1774555539585.webp',
}
</script>

<template>
  <div class="da-vinci-discover" :class="{ 'scrolled': scrolled }">
    <!-- Top Nav specific to this landing page -->
    <div class="landing-nav">
      <div class="d-flex align-center gap-3">
        <v-btn icon variant="text" size="small" color="white" @click="router.back()"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <div class="text-subtitle-2 font-weight-bold text-white d-flex align-center gap-2">
          <v-icon size="20" color="purple-lighten-2">mdi-creation</v-icon>
          Da Vinci AI
        </div>
      </div>
      <div>
        <v-btn color="white" variant="outlined" size="small" class="text-none mr-3" to="/dashboard">Back to App</v-btn>
        <v-btn color="purple" variant="flat" size="small" class="text-none font-weight-bold" append-icon="mdi-arrow-right" @click="router.push('/commerce/themes/builder')">Try it now</v-btn>
      </div>
    </div>

    <!-- ─── HERO SECTION ─── -->
    <section class="hero-section text-center">
      <div class="hero-bg-glow"></div>
      <div class="hero-content">
        <div class="mb-4">
          <v-chip color="purple-lighten-2" variant="tonal" class="font-weight-bold mb-6 text-caption py-4 px-4" style="border: 1px solid rgba(168, 85, 247, 0.3);">
            <v-icon start size="16">mdi-sparkles</v-icon> Introducing the future of commerce
          </v-chip>
        </div>
        <h1 class="hero-title font-weight-black mb-6">
          Meet <span class="gradient-text">Da Vinci.</span><br />
          Your intelligent commerce assistant.
        </h1>
        <p class="hero-subtitle text-medium-emphasis mb-10 mx-auto" style="max-width: 600px;">
          From building your dream storefront to writing campaigns that convert, Da Vinci helps you start, run, and grow your business faster than ever before.
        </p>
        <v-btn size="x-large" color="purple" variant="flat" class="text-none font-weight-bold px-8 hero-cta" rounded="pill" append-icon="mdi-arrow-right" @click="router.push('/commerce/stores/themes')">
          Get Started
        </v-btn>
      </div>
    </section>

    <!-- ─── METRICS STRIP ─── -->
    <section class="metrics-section py-12 border-y">
      <div class="metrics-grid">
        <div class="metric-item text-center">
          <div class="text-h3 font-weight-black gradient-text-alt mb-2">15+ hrs</div>
          <div class="text-subtitle-1 text-medium-emphasis">Saved per week on store ops</div>
        </div>
        <div class="metric-item text-center">
          <div class="text-h3 font-weight-black gradient-text-alt mb-2">3x faster</div>
          <div class="text-subtitle-1 text-medium-emphasis">Campaign & content creation</div>
        </div>
        <div class="metric-item text-center">
          <div class="text-h3 font-weight-black gradient-text-alt mb-2">+24%</div>
          <div class="text-subtitle-1 text-medium-emphasis">Avg. lift in email conversions</div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURE 1: COPILOT ─── -->
    <section class="feature-section right-align">
      <div class="feature-container">
        <div class="feature-text">
          <div class="d-flex align-center gap-2 mb-4">
            <div class="icon-bulb">
              <v-icon color="purple-lighten-2">mdi-robot-outline</v-icon>
            </div>
            <span class="text-purple-lighten-2 font-weight-bold text-uppercase text-caption" style="letter-spacing: 1px;">Intelligent Copilot</span>
          </div>
          <h2 class="section-title">Always by your side.</h2>
          <p class="section-desc">
            Ask questions, automate tasks, and get deep insights into your store's performance. The Da Vinci Copilot understands your context and acts on your behalf across the entire Maropost platform.
          </p>
          <ul class="feature-list mt-6">
            <li><v-icon color="purple" size="20" class="mr-2">mdi-check-circle</v-icon> Instant deep insights from dashboard data</li>
            <li><v-icon color="purple" size="20" class="mr-2">mdi-check-circle</v-icon> Natural language navigation and setup</li>
            <li><v-icon color="purple" size="20" class="mr-2">mdi-check-circle</v-icon> Proactive growth recommendations</li>
          </ul>
        </div>
        <div class="feature-visual relative">
          <div class="glass-orb glow-orb-1" style="background: #a855f7;"></div>
          <div class="mac-window dark-theme shadow-2xl skew-left">
            <div class="mac-header">
              <div class="mac-dots"><span/><span/><span/></div>
              <div class="mac-title">Da Vinci Copilot</div>
            </div>
            <img :src="assets.copilot" class="w-100 preview-video" alt="Da Vinci Copilot Demo" />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURE 2: THEME BUILDER ─── -->
    <section class="feature-section left-align">
      <div class="feature-container reverse-layout">
        <div class="feature-text text-left">
          <div class="text-overline tracking-widest text-pink-lighten-2 mb-2"><v-icon size="small" class="mr-1">mdi-pencil-ruler</v-icon> STORE DESIGN</div>
          <h2 class="text-h3 font-weight-black text-white mb-6" style="line-height: 1.1;">Build your dream store in seconds.</h2>
          <p class="text-h6 text-medium-emphasis text-body-1 font-weight-regular">
            Stop dragging and dropping. Simply describe the layout you want, like "Add a summer sale hero banner," and Da Vinci generates a fully configured, responsive block directly into your theme.
          </p>
        </div>
        <div class="feature-visual">
          <div class="mac-window skew-right">
            <div class="mac-header">
              <span class="dot bg-red"></span><span class="dot bg-yellow"></span><span class="dot bg-green"></span>
              <span class="mac-title">Theme Builder</span>
            </div>
            <img src="/da-vinci-media/theme_builder_demo_1774557744799.webp" alt="Theme Builder Demo" class="w-100" />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURE 3: SHOPPING ASSISTANT & CHATBOT ─── -->
    <section class="feature-section right-align mt-16">
      <div class="feature-container">
        <div class="feature-text text-left pl-md-12">
          <div class="text-overline tracking-widest text-light-blue-lighten-2 mb-2"><v-icon size="small" class="mr-1">mdi-forum-outline</v-icon> CUSTOMER EXPERIENCE</div>
          <h2 class="text-h3 font-weight-black text-white mb-6" style="line-height: 1.1;">Shopping assistant & service chatbot.</h2>
          <p class="text-h6 text-medium-emphasis text-body-1 font-weight-regular">
            Deploy a fully autonomous Da Vinci agent to your storefront. It helps users find products, answers shipping questions based on your policies, and guides them securely to checkout 24/7.
          </p>
        </div>
        <div class="feature-visual pl-md-8">
          <div class="mac-window skew-left">
            <div class="mac-header">
              <span class="dot bg-red"></span><span class="dot bg-yellow"></span><span class="dot bg-green"></span>
              <span class="mac-title">Storefront Assistant</span>
            </div>
            <img src="/da-vinci-media/da_vinci_customer_bot_1774554758872.png" alt="Customer Bot Interface" class="w-100" />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURE 4: WORKFLOW BUILDER ─── -->
    <section class="feature-section left-align mt-16">
      <div class="feature-container reverse-layout">
        <div class="feature-text text-left pr-md-12">
          <div class="text-overline tracking-widest text-green-lighten-2 mb-2"><v-icon size="small" class="mr-1">mdi-graph</v-icon> JOURNEY AUTOMATION</div>
          <h2 class="text-h3 font-weight-black text-white mb-6" style="line-height: 1.1;">Journeys that build themselves.</h2>
          <p class="text-h6 text-medium-emphasis text-body-1 font-weight-regular">
            Describe your goal—"Recapture VIPs who abandoned carts"—and the Da Vinci Workflow Builder plots the optimal sequence of emails, SMS, and WhatsApp messages, complete with conditional splits.
          </p>
        </div>
        <div class="feature-visual pr-md-8">
          <div class="mac-window skew-right" style="overflow: hidden; max-height: 480px;">
            <div class="mac-header">
              <span class="dot bg-red"></span><span class="dot bg-yellow"></span><span class="dot bg-green"></span>
              <span class="mac-title">Workflow Builder</span>
            </div>
            <img src="/da-vinci-media/davinci_journeys_ui_verification_1774860726901.png" alt="Journey Workflow Builder" class="w-100" style="object-position: top; object-fit: cover;" />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURE 5: AI PERSONALIZATION ─── -->
    <section class="feature-section right-align mt-16">
      <div class="feature-container">
        <div class="feature-text text-left pl-md-12">
          <div class="text-overline tracking-widest text-orange-lighten-2 mb-2"><v-icon size="small" class="mr-1">mdi-account-star-outline</v-icon> PREDICTIVE INTELLIGENCE</div>
          <h2 class="text-h3 font-weight-black text-white mb-6" style="line-height: 1.1;">AI Personalization & Product Recommendations.</h2>
          <p class="text-h6 text-medium-emphasis text-body-1 font-weight-regular">
            Make every shopper feel like your only shopper. Da Vinci's machine learning dynamically updates hero banners, adjusts discounting logic, and recommends products based on real-time browsing ML.
          </p>
        </div>
        <div class="feature-visual pl-md-8">
          <div class="mac-window skew-left" style="overflow: hidden; max-height: 480px;">
            <div class="mac-header">
              <span class="dot bg-red"></span><span class="dot bg-yellow"></span><span class="dot bg-green"></span>
              <span class="mac-title">Live Storefront Preview</span>
            </div>
            <img src="/da-vinci-media/davinci_personalization_ui_verification_1774860744783.png" alt="AI Personalization Hub" class="w-100" style="object-position: top; object-fit: cover;" />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── BENTO: CAMPAIGN GEN & INSIGHTS ─── -->
    <section class="split-bento mt-16">
      <div class="text-center mb-16 mx-auto" style="max-width: 800px;">
        <h2 class="text-h3 font-weight-black text-white mb-4">Marketing that writes itself.</h2>
        <p class="text-h6 text-medium-emphasis font-weight-regular">Generate high-converting subject lines, email body copy, SMS campaigns, and segment definitions instantly. Just look for the <strong class="text-white">Sparkle <v-icon size="small" color="purple">mdi-auto-fix</v-icon></strong> icon to unlock magic inside any text field.</p>
      </div>

      <div class="bento-grid">
        <!-- Marketing asset card -->
        <div class="bento-card bento-large group">
          <div class="bento-content pa-8">
            <div class="text-h5 font-weight-bold text-white mb-2">Campaign Content Generator</div>
            <div class="text-body-2 text-medium-emphasis mb-6">Break through writer's block with context-aware copy variations.</div>
            <div class="mac-window shadow-xl border-soft">
              <img :src="assets.marketing" class="w-100 preview-video" style="object-position: left top" alt="Marketing Generation" />
            </div>
          </div>
        </div>

        <!-- Insights card -->
        <div class="bento-card bento-small group">
          <div class="bento-content pa-8">
            <div class="text-h5 font-weight-bold text-white mb-2">Dashboard Insights</div>
            <div class="text-body-2 text-medium-emphasis mb-6">Turn charts into human-readable action plans.</div>
            <div class="mac-window shadow-xl border-soft crop-insight mt-4">
              <img :src="assets.insights" class="w-100 preview-video" alt="Dashboard Insights overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── MERCHANT BUSINESS VALUE ─── -->
    <section class="business-value-section">
      <div class="text-center mb-16 mx-auto" style="max-width: 800px;">
        <h2 class="section-title">Built for Merchant Growth</h2>
        <p class="section-desc">Da Vinci isn't just a chatbot—it's an embedded intelligence layer designed specifically to solve complex merchant problems, drive revenue, and scale your operations without scaling your headcount.</p>
      </div>

      <div class="value-grid">
        <div class="value-card">
          <div class="value-icon"><v-icon color="purple-lighten-2" size="28">mdi-chart-timeline-variant-shimmer</v-icon></div>
          <h3 class="text-h5 font-weight-bold mb-3 text-white">Actionable Analytics</h3>
          <p class="text-medium-emphasis">Instead of staring at dashboards wondering why sales dropped, Da Vinci analyzes your metrics in real-time. It identifies the root cause (like an abandoned cart spike) and instantly suggests the exact automated journey needed to fix it.</p>
        </div>
        <div class="value-card">
          <div class="value-icon"><v-icon color="pink-lighten-2" size="28">mdi-account-group-outline</v-icon></div>
          <h3 class="text-h5 font-weight-bold mb-3 text-white">Smarter Segmentation</h3>
          <p class="text-medium-emphasis">Describe your target audience in plain English. "Find VIP customers who bought shoes in the last 6 months but haven't ordered recently." Da Vinci builds the complex query logic and instantly recalculates the segment.</p>
        </div>
        <div class="value-card">
          <div class="value-icon"><v-icon color="blue-lighten-2" size="28">mdi-pencil-ruler</v-icon></div>
          <h3 class="text-h5 font-weight-bold mb-3 text-white">Zero-Code Storefronts</h3>
          <p class="text-medium-emphasis">Stop hiring expensive agencies for minor theme tweaks. Merchants can generate responsive, SEO-ready layout blocks simply by typing what they want. It empowers marketing teams to run seasonal promos instantly.</p>
        </div>
        <div class="value-card">
          <div class="value-icon"><v-icon color="orange-lighten-2" size="28">mdi-shield-check-outline</v-icon></div>
          <h3 class="text-h5 font-weight-bold mb-3 text-white">Brand Integrity</h3>
          <p class="text-medium-emphasis">Da Vinci's content generator is context-aware. It learns your brand voice from your existing campaign history, ensuring that every AI-generated email subject line or SMS text sounds exactly like your brand.</p>
        </div>
      </div>
    </section>

    <!-- ─── HOW IT WORKS WORKFLOW ─── -->
    <section class="workflow-section">
      <div class="workflow-container">
        <h2 class="section-title text-center mb-16">Intelligence across the entire funnel.</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-dot">1</div>
            <div class="timeline-content">
              <h4 class="text-h6 font-weight-bold text-white mb-2">Discover</h4>
              <p class="text-medium-emphasis text-body-2">Da Vinci natively monitors your Maropost commerce data, campaign performance, and customer behavior, seeking optimization opportunities.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">2</div>
            <div class="timeline-content">
              <h4 class="text-h6 font-weight-bold text-white mb-2">Execute</h4>
              <p class="text-medium-emphasis text-body-2">Via the Copilot or inline Sparkle buttons, you issue a command in natural language. The AI interprets your merchant intent.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">3</div>
            <div class="timeline-content">
              <h4 class="text-h6 font-weight-bold text-white mb-2">Automate</h4>
              <p class="text-medium-emphasis text-body-2">Da Vinci outputs actual configuration—be it a drafted email, a baked JSON layout block, or a defined segment list, ready for approval.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FOOTER CTA ─── -->
    <section class="cta-section text-center">
      <div class="cta-inner">
        <v-icon size="64" color="purple-lighten-2" class="mb-6 spin-slow">mdi-creation</v-icon>
        <h2 class="text-h3 font-weight-black text-white mb-6">Ready to experience magic?</h2>
        <div class="d-flex justify-center gap-4">
          <v-btn size="x-large" color="purple" variant="flat" class="text-none font-weight-bold px-8" rounded="pill" to="/commerce/store-setup">Manage Stores</v-btn>
          <v-btn size="x-large" color="white" variant="outlined" class="text-none font-weight-bold px-8" rounded="pill" to="/dashboard">Go to Dashboard</v-btn>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Base Dark Theme for the page */
.da-vinci-discover {
  background-color: #0b0f19;
  min-height: 100vh;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
}

/* Typography Overrides */
.text-medium-emphasis {
  color: #94a3b8 !important;
}

/* Nav */
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 100;
  transition: all 0.3s ease;
  background: transparent;
}
.landing-nav.scrolled {
  background: rgba(11, 15, 25, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 200px 32px 140px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.hero-bg-glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(ellipse at center, rgba(168, 85, 247, 0.25) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%);
  filter: blur(60px);
  z-index: 0;
}
.hero-content {
  position: relative;
  z-index: 2;
  animation: fadeUp 1s ease forwards;
}
.hero-title {
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: white;
}
.gradient-text {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.gradient-text-alt {
  background: linear-gradient(135deg, #38bdf8 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
}

/* Feature Sections */
.feature-section {
  padding: 120px 5%;
  position: relative;
}
.feature-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}
.feature-container.reverse-layout {
  grid-template-columns: 1.3fr 1fr;
}
.section-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  color: white;
}
.section-desc {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #94a3b8;
}
.icon-bulb {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(168, 85, 247, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}
.feature-list {
  list-style: none;
  padding: 0;
}
.feature-list li {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 500;
  color: #e2e8f0;
}

/* Visuals & Mac Windows */
.mac-window {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  transition: transform 0.5s ease;
}
.mac-window.dark-theme {
  background: #1e1e24;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.mac-window.light-theme {
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.mac-header {
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
  position: relative;
}
.mac-window.dark-theme .mac-header { background: #2a2a32; }
.mac-window.light-theme .mac-header { background: #e2e8f0; }
.mac-dots {
  display: flex;
  gap: 6px;
}
.mac-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.mac-dots span:nth-child(1) { background: #ff5f56; }
.mac-dots span:nth-child(2) { background: #ffbd2e; }
.mac-dots span:nth-child(3) { background: #27c93f; }
.mac-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  color: #888;
}

.preview-video {
  display: block;
  object-fit: cover;
  object-position: top center;
}
.mac-window:hover {
  transform: translateY(-8px) scale(1.02);
}

/* Skews and Orbs for depth */
.skew-left {
  transform: perspective(1000px) rotateY(-8deg) rotateX(4deg);
  box-shadow: -20px 20px 60px rgba(0,0,0,0.5);
}
.skew-right {
  transform: perspective(1000px) rotateY(6deg) rotateX(2deg);
  box-shadow: 20px 20px 60px rgba(0,0,0,0.5);
}
.skew-right:hover, .skew-left:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.03);
}
.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  opacity: 0.5;
}
.glow-orb-1 {
  width: 400px;
  height: 400px;
  bottom: -10%;
  right: -10%;
}
.glow-orb-2 {
  width: 500px;
  height: 500px;
  top: 20%;
  left: -20%;
}

/* Bento Grid */
.split-bento {
  padding: 80px 5% 100px;
}
.bento-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}
.bento-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}
.bento-card:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(168, 85, 247, 0.3);
}
.bento-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.border-soft {
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px 8px 0 0;
  border-bottom: none;
}
.crop-insight img {
  transform: scale(1.2) translateY(-10%);
}

/* Metrics & Value Props */
.border-y {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
}

.business-value-section {
  padding: 120px 5%;
  background: #0b0f19;
}
.value-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}
.value-card {
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  transition: transform 0.3s, background 0.3s;
}
.value-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.04);
}
.value-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.workflow-section {
  padding: 120px 5%;
  background: radial-gradient(ellipse at bottom, rgba(168, 85, 247, 0.1) 0%, #0b0f19 70%);
}
.workflow-container {
  max-width: 1000px;
  margin: 0 auto;
}
.timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding-top: 20px;
}
.timeline::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
  z-index: 0;
}
.timeline-item {
  position: relative;
  z-index: 1;
  width: 28%;
  text-align: center;
}
.timeline-dot {
  width: 44px;
  height: 44px;
  margin: 0 auto 24px;
  background: #0b0f19;
  border: 2px solid #a855f7;
  color: #a855f7;
  font-weight: bold;
  font-size: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
}

/* CTA Footer */
.cta-section {
  padding: 120px 0;
  background: linear-gradient(to top, rgba(168, 85, 247, 0.1), transparent);
}
.cta-inner {
  max-width: 800px;
  margin: 0 auto;
}
.spin-slow {
  animation: spin 10s linear infinite;
}

/* Animations */
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 960px) {
  .feature-container, .feature-container.reverse-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .feature-container.reverse-layout .feature-visual {
    order: 2;
  }
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .skew-left, .skew-right { transform: none; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
  .skew-left:hover, .skew-right:hover { transform: translateY(-5px); }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .value-grid {
    grid-template-columns: 1fr;
  }
  .timeline {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
  .timeline::before {
    display: none;
  }
  .timeline-item {
    width: 100%;
  }
}
</style>
