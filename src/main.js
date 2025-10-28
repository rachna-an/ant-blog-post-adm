import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/app.css'


import App from './App.vue'
import router from './router'
import BaseInput from './components/base/BaseInput.vue'
import BaseButton from './components/base/BaseButton.vue'
import ConfirmationModal from './components/common/ConfirmationModal.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('BaseInput', BaseInput)
app.component('BaseButton', BaseButton)
app.component('ConfirmationModal', ConfirmationModal)

app.mount('#app')
