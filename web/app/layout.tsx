import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import MainLayout from '../components/MainLayout';
import theme from '../theme';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Dokzly",
  description: "Generated vector storage and document management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <MainLayout list={[
              {
                items: [
                  { text: 'Dashboard', href: '/', icon: <DashboardIcon /> },
                  { text: 'Vector Storage', href: '/vector-storage', icon: <StorageIcon /> }
                ],
              }
            ]}>
              {children}
            </MainLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
