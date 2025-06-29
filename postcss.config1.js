export default {
  plugins: {
    autoprefixer: {},
    // Probar esto porque para tailwindcss no se usa autoprefixer: {} y tailwindcss: {}
    // https://aabidk.dev/blog/building-modern-cross-browser-web-extensions-content-scripts-and-ui/
    "@thedutchcoder/postcss-rem-to-px": {},
    tailwindcss: {},
  },
};