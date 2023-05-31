import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { IBM_Plex_Sans_KR } from "next/font/google";

const ibmplex = IBM_Plex_Sans_KR({
  // preload: true, 기본값
  subsets: ["latin"], // 또는 preload: false
  weight: ["300", "400", "500", "700"], // 가변 폰트가 아닌 경우, 사용할 fontWeight 배열
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <main className={ibmplex.className}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
}
