const state = ref(false)
export const useUserLoginState = () => {
  const res = localStorage.getItem('token')
  if (!res) {
    state.value = false
  } else {
    state.value = true
  }
  return state.value
}