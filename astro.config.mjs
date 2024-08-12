import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
// https://astro.build/config
export default defineConfig({
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                // importしたいファイルを記載 
                additionalData: `@import "src/styles/_mixin.scss","src/styles/_variables";`
            }
          }
        }
    },
    integrations: [vue()],
});
