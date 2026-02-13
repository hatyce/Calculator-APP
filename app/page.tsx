import Calculator from "./calculate";
import ThemeProvider from "./theme";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <ThemeProvider>
        <main className="flex w-full max-w-3xl flex-col items-center justify-center py-16 px-8">
          <Calculator />
        </main>
      </ThemeProvider>
    </div>
  );
}
