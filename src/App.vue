<template>
  <div class="app-container">
    <NavigationBar />
    <div class="router-view-parent">
      <RouterView />
    </div>
    <AppFooter v-show="!route.meta.hideFooter" />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import NavigationBar from '@/widgets/navBar/NavigationBar.vue';
import AppFooter from '@/widgets/footer/Footer.vue';

const route = useRoute();
</script>

<style>
:root {
  --primary: #219ebc;
  --primary-background: rgba(33, 158, 188, 0.2);
  --primary-light: #8ecae6;
  --primary-light-background: rgba(142, 202, 230, 0.1);
  --primary-dark: #1a7a94;
  --orange: #fb8500;
  --orangeBackground: rgba(251, 133, 0, 0.2);
  --error: #d63340;
  --error-light: #e4606d;
  --error-dark: #c82333;
  --white: #ffffff;
  --light: #f8f9fa;
  --dark: #212529;
  --gray: #6c757d;
  --light-gray: #e9ecef;
  --border-radius: 0.75rem;
  --shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
}

* {
  box-sizing: border-box;
}

#app {
  height: 100%;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.router-view-parent {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>