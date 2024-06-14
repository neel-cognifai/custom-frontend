import "./globals.scss";
import { Providers } from "@/redux/provider";
import Authguard from "@/components/auth/Authguard";
import Layout from "@/components/layout/layout";

export const metadata = {
  title: "CoVigilAI",
  description: "CoVigilAI",
};

export default function RootLayout(  {
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>        
        <Providers>
          <Layout>         
            <Authguard>{children}</Authguard>
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
