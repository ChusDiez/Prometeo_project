declare namespace React {
    interface CSSProperties {
      [key: `--${string}`]: string | number;
    }
  }
  
  // Extiende tus temas y variables CSS globales
  interface DefaultTheme {
    colors: {
      primary: string;
      background: string;
      border: string;
      text: string;
    };
  }