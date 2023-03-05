import { useLayoutEffect, useState } from "react";

const isDarkSystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultTheme = isDarkSystem ? "dark" : "light";

const useTheme = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || defaultTheme
  );

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  localStorage.setItem("theme", theme);

  return { theme, setTheme };
};

export default useTheme;
