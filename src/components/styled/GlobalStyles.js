import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
  *{
    padding:0;
    margin:0;
    box-sizing: border-box;
  }
  html{
    font-family: Arial, Helvetica, sans-serif;
    color: white;
  }
  body{
      min-height:100vh;
      width:100%;
  }
`;
export default GlobalStyles;
