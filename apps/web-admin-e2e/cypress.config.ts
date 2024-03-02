import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'nx run web-admin:serve',
        production: 'nx run web-admin:preview',
      },
      ciWebServerCommand: 'nx run web-admin:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
