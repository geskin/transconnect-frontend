// import { defineConfig } from "vitest/config";

// export default defineConfig({
//     test: {
//         environment: "jsdom",
//     },
// });

// import { defineConfig } from 'vitest/config';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//     plugins: [react()],
//     test: {
//         globals: true,
//         setupFiles: ['./src/tests/setupTests.js'],
//     },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
    },
});