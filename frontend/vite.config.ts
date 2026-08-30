import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        medicines: resolve(__dirname, 'medicines.html'),
        sales: resolve(__dirname, 'sales.html'),
        register: resolve(__dirname, 'register.html'),
        printBill: resolve(__dirname, 'print-bill.html'),
        pendingApprovals: resolve(__dirname, 'pending-approvals.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
})