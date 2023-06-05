/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      orange: {
        light: "#FFA08D",
        DEFAULT: "#FF645C",
        dark: "#D82A2A",
      },
      blue: {
        light: "#9EB6EF",
        DEFAULT: "#7575EA",
        dark: "#4E36C6",
      },

      gray: {
        lightest: "#F3F3F3",
        light: "#D8D8D8",
        DEFAULT: "#B9B9B8",
        dark: "#5B5B5B",
        darkest: "#2A2A2A",
      },
      yellow:{
        DEFAULT : "#FFD400"
      }
    },
    extend: {
      fontFamily: {
        ibm: ["ibmplex", "sans-serif"], // 다음과 같이 배열 안에 string으로 작성합니다.
      },
      maxHeight: {
        25: "25%",
        50: "50%",
        90: "90%",
        10: "10%",
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
