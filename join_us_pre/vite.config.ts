import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import path from "path"
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    },
  },

  plugins: [
    vue(),
    AutoImport({
      resolvers: [AntDesignVueResolver()],
      imports: [
        'vue',
        'vue-router',
        'pinia'
      ]
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({ importStyle: "less" }),
      ],
    }),
    
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#7546C9',
          'link-color': '#1DA57A',
          'border-radius-base': '8px',
        },
        javascriptEnabled: true,
      },
    }
  }
  
})
