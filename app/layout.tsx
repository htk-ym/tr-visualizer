"use client"

import { useEffect, useState } from "react";
import "./globals.css";
import { RecoilRoot } from "recoil";


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  const Dynamic = ({ children }: { children: React.ReactNode }) => {
    const [hasMounted, setHasMounted] = useState(false);
  
    useEffect(() => {
      setHasMounted(true);
    }, []);
  
    if (!hasMounted) {
      return null;
    }
  
    return <>{children}</>;
  };

  return (
    <html lang="ja">
      <RecoilRoot>
        <body>
          <Dynamic>{children}</Dynamic>
        </body>
      </RecoilRoot>
    </html>
  );
}
