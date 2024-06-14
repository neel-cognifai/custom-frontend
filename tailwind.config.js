/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  theme: {
    extend: {
      colors:{
        eyeWhite: "rgb(255,255,255, 0)",
        whitesmoke: "#faf7f5",
        violet: "#667acd",
        gray: "#101010",
        lightslategray: "#8e939c",
        silver: "#c4c9cf",
        dimgray: "#646a73",
        white: "#fff",
        lightsteelblue: "rgba(200, 211, 255, 0.20000000298023224)",
        gray: "rgba(0, 0, 0, 0.1)",
        cornflowerblue: "#667acd",
        ghostwhite: "#f5f7ff",
        'black-rgba': 'rgba(0, 0, 0, 0.54)',
        yellow:' #F39200',
        white:'#FFFFFF',
        black:'#101010',
        buttonGray:'#646A73',
        whiteGray: '#F1F1F1',
        tabColor:'#F1F1F1',
        tabText:'#8E939C',
        cyanBlue: '#E6E9ED',
        brickRed: '#D03743',
        fuchsia: '#CD66B0',
        darkOrchid: '#8D37D0',
        shamrock: '#37D087',
        snowWhite: '#FAFAFA',
        red:'#FF0000',
        darkBlue:'#5f6b9d',
      },
      fontFamily: {
        archivo: "Archivo",
      },
      borderRadius: {
        "8xs": "5px",
      },
      width: {
        '459': '459.055px',
      },
      height: {
        '429': '429.712px',
      },
      marginTop: {
        "21": '21rem'
      },
      text: {
        DEFAULT: "#1F2937",
        light: "#6C7281",
      },
      light: {
        DEFAULT: "#FAFBFC",
        lighter: "#F3F4F6",
      },
      borderRadius: {
        "8xs": "5px",
        "10xs": "3px",
        mini: "15px",
        "10xs-5": "2.5px",
      },    
    },
    fontSize: {
      base: "1rem",
      lg: "1.13rem",
      xl: "1.25rem",
      "5xl": "1.5rem",
    },
    fontWeight: {
      thin: '100',
      hairline: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      'extra-bold': '800',
      black: '900',
    }
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('flowbite/plugin')
  ]
};
