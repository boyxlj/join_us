

// export const useGetScrollTop = ()=>{
//   const showNavBar = ref(false)
//   onMounted(() => {
//     window.addEventListener("scroll", getScrollTop);
//   });
//   onUnmounted(() => {
//     window.removeEventListener("scroll", getScrollTop);
//   });
  
//   const getScrollTop = () => {
//     const val =  document.documentElement.scrollTop;
//     console.log(val)
//     if(val>=300){
//       showNavBar.value = true
//     }else{
//       showNavBar.value = false
//     }
//   };
//   return showNavBar.value

  
// } 