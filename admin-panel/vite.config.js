// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5174,
//     proxy: {
//       "/api": "http://localhost:5000", // 👈 Backend address
//     },
//   },
// });



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  build: {
    outDir: "dist", // default hota hai dist
  },
  base: "/", // 👈 ye important hai
});
