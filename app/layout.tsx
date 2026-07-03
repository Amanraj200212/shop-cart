const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className="font-poppins antialiased">
        {children}
      </body>
    </html>
  )
};

export default RootLayout;
