import Logo from "./components/logo/Logo";
import ContinueToLoginButton from "./components/ContinueToLoginButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-24 p-24">
      <Logo />

      <div className="flex flex-col gap-16 items-center">
        <h1 className="text-8xl text-foreground font-bold text-pretty max-w-xl text-center ">Grey Cloud Technology</h1>

        <ContinueToLoginButton />
      </div>
    </main>
  );
}
