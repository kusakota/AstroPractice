import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import partytown from "@astrojs/partytown";
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
    trailingSlash: 'always',
    integrations: [
        vue(),
        partytown({
            // Adds dataLayer.push as a forwarding-event.
            config: {
                forward: ["dataLayer.push"],
            },
         }),
    ],
});
