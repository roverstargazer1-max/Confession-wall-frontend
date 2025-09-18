import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// vueDevTools is not used in your config, but I'll leave it in case you need it.
// import vueDevTools from 'vite-plugin-vue-devtools' 
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'i',
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  // --- 添加下面的 resolve 配置 ---
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

