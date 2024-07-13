import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: "#c75e6d",
        pink: {
          500: "#c75e6d",
        },
      },
    },
  },
};
