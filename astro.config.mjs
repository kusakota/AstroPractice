import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
// https://astro.build/config
export default defineConfig({
    css: ["@/styles/style.scss","@/styles/reset.scss"],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                // importしたいファイルを記載 
                additionalData: `@import "src/styles/_mixin.scss";`
            }
          }
        }
    },
    integrations: [vue()],
});
