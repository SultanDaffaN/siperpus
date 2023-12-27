module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        pGreen1: "#539275",
        pGreen2: "#43816F",
        pGreen3: "#2F6C69", 
        pBlue1: "#2567A4",
        pBlue2: "#004C92",
        pBlue3: "#022A76",
        pGray1: "#A8AFB2",
        pGray2: "#8B9397",
        pGray3: "#767C80",

        // Text Color
        tBlack: "#000000",
        tGreen: "#2F6C69",
        tBrown: "#5E5E5E",
        tBlackLight: "#353535",
        tGray: "#8B9397",
        tWhite: "#FFFFFF",

        // Indicator Color  
        iGreen1: "#87DCCF",
        iGreen2: "#53BEB3",
        iGreen3: "#3FAE9D",
        iRed1: "#FD8C7E",
        iRed2: "#FF5353",
        iRed3: "#F44236",
        iYellow1: "#FFD455",
        iYellow2: "#FEBF07",
        iYellow3: "#FF9F02",
      },
      fontFamily: {
        averta: ["AvertaStd-Regular"],
        avertaSemiBold: ["AvertaStd-Semibold"],
        avertaBold: ["AvertaStd-Bold"],
        avertaExtraBold: ["AvertaStd-ExtraBold"],
        avertaBlack: ["AvertaStd-Black"],
        avertaItalic: ["AvertaStd-RegularItalic"]
      },
    },
  },
  plugins: [],
}
