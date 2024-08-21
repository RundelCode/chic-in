import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/authContext'
import { ProviderProvider } from './context/providerContext'
import { ServiceProvider } from "./context/serviceContext";
import ReduxProvider from "./GlobalContext/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chic In",
  description: "Workshop de servicios de belleza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <ServiceProvider>
              <ProviderProvider>
                {children}
              </ProviderProvider>
            </ServiceProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
