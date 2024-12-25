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
                    //api: 'modern-compiler',
                    additionalData: `
                        @use "src/styles/_mixin.scss" as *;
                        @use "src/styles/_variables" as *;
                    `,
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
