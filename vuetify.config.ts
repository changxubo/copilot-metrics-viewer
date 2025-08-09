import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  // Vuetify theme configuration (light + dark)
  // You can switch themes at runtime with: useVuetify().theme.global.name.value = 'dark' | 'light'
  theme: {
    defaultTheme: 'dark', // keep dark as default (can be changed to 'light' if preferred)
    themes: {
      dark: {
        colors: {
          // Brand / semantic
            primary: '#1f6feb', // GitHub blue-ish
            secondary: '#30363d',
            accent: '#82B1FF',
            error: '#f85149',
            info: '#4493f8',
            success: '#3fb950',
            warning: '#d29922',
          // Surfaces (adjusted for dark mode)
            background: '#0d1117',
            surface: '#161b22',
            'surface-variant': '#1e242b',
            border: '#30363d',
            'on-surface': '#e6edf3',
        },
      },
      light: {
        colors: {
          // Brand / semantic (light counterparts)
            primary: '#0969da',
            secondary: '#57606a',
            accent: '#0a84ff',
            error: '#cf222e',
            info: '#1b7fff',
            success: '#1a7f37',
            warning: '#9a6700',
          // Surfaces
            background: '#ffffff',
            surface: '#ffffff',
            'surface-variant': '#f6f8fa',
            border: '#d0d7de',
            'on-surface': '#24292f',
        },
      },
    },
  },
})
