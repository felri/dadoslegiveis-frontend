import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), pluginRewriteAll(), glsl()],
  server: {
      host: true,
      port: 8080
  },
  assetsInclude: ['src/assets']
})
