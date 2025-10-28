import { h, render } from 'vue'
import SuccessToast from '@/components/common/SuccessToast.vue'
import ErrorToast from '@/components/common/ErrorToast.vue'

export function useToast() {
  const showToast = (component, props = {}, duration = 3000) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    let timeoutId

    const removeToast = () => {
      render(null, container)
      document.body.removeChild(container)
    }

    const vnode = h(component, {
      ...props,
      onMouseEnter: () => {
        clearTimeout(timeoutId)
      },
      onMouseLeave: () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          if (vnode.component?.exposed?.visible) {
            vnode.component.exposed.visible.value = false
          }
        }, 1000)
      },
      onAfterLeave: () => {
        removeToast()
      },
    })

    render(vnode, container)

    timeoutId = setTimeout(() => {
      if (vnode.component?.exposed?.visible) {
        vnode.component.exposed.visible.value = false
      }
    }, duration)
  }

  const showSuccess = (message) => showToast(SuccessToast, { message }, 3000)
  const showError = (message) => showToast(ErrorToast, { message }, 3000)

  return { showSuccess, showError }
}
