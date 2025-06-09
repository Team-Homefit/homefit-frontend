import { createApp } from 'vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useKakao } from 'vue3-kakao-maps';
import App from './App.vue'
import router from './routers/index'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

useKakao(import.meta.env.VITE_KAKAO_MAP_JS_KEY, ['clusterer', 'services', 'drawing']);

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app');
