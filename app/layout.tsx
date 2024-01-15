import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

/*
In Next.js, you can use a special layout.tsx file to create UI that is shared between multiple pages

By adding Inter to the <body> element above, the font will be applied throughout your application. 
Here, you're also adding the Tailwind antialiased class which smooths out the font. 
It's not necessary to use this class, but it adds a nice touch.

This is the root layout and is required 
*/