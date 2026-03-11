import { TheamProvider as NextThemeProvider} from "next-themes";

export default function ThemeProvider({ children,
    ...NextThemeProvider
 }) {
return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}