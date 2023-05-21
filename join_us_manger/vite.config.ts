import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import AutoImport from "unplugin-auto-import/vite"
import VueComponents from "unplugin-vue-components/vite"
import { ArcoResolver } from "unplugin-vue-components/resolvers"
// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [
        ArcoResolver()
      ]
    }),
    VueComponents({
      resolvers: [
        ArcoResolver({importStyle:"less"})
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
        less: {
          modifyVars: {
            'arcoblue-6': '#62D8F5',
          },
          javascriptEnabled: true,
        }
    }
  }
})
