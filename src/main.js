import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/app.css'


import App from './App.vue'
import router from './router'
import BaseInput from './components/base/BaseInput.vue'
import BaseButton from './components/base/BaseButton.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('BaseInput', BaseInput)
app.component('BaseButton', BaseButton)

app.mount('#app')
