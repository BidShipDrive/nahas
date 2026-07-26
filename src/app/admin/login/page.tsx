import { login } from "@/app/actions/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-bold text-slate-900 text-center">Admin Login</h1>
      <form action={login} className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          autoFocus
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">Incorrect email or password. Try again.</p>}
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
