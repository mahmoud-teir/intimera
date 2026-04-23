import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts'],
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'src/e2e/**', // Playwright files — run via `npm run test:e2e`
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/lib/**', 'src/actions/**'],
			exclude: [
				'src/lib/__mocks__/**',
				'src/lib/auth.ts',
				'src/lib/auth-client.ts',
				'src/lib/db.ts',
				'src/lib/stripe.ts',
			],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
