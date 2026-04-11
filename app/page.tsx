import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex flex-col items-center justify-center text-white">
      <div className="text-center px-6">
        <div className="text-6xl mb-4">🧭</div>
        <h1 className="text-5xl font-bold mb-4">TalentCompass</h1>
        <p className="text-xl text-blue-200 mb-2">Your AI-powered job search companion</p>
        <p className="text-md text-slate-400 mb-10">Built for senior tech professionals navigating Sydney&apos;s job market</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          
          <Link href="/leads" className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition cursor-pointer block">
            <div className="text-3xl mb-2">⚡</div>
            <h2 className="text-lg font-semibold">Quick Capture</h2>
            <p className="text-sm text-slate-300 mt-1">Save job leads instantly before they slip away</p>
          </Link>

          <Link href="/applications" className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition cursor-pointer block">
            <div className="text-3xl mb-2">📋</div>
            <h2 className="text-lg font-semibold">Application Tracker</h2>
            <p className="text-sm text-slate-300 mt-1">Track every application through to offer</p>
          </Link>

          <div className="bg-white/10 rounded-2xl p-6 opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-2">🏢</div>
            <h2 className="text-lg font-semibold">Company Discovery</h2>
            <p className="text-sm text-slate-300 mt-1">Find top tech companies with open QA roles</p>
            <span className="text-xs text-blue-300 mt-2 block">Coming soon</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-2">📊</div>
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-sm text-slate-300 mt-1">Your job search at a glance</p>
            <span className="text-xs text-blue-300 mt-2 block">Coming soon</span>
          </div>
        </div>
      </div>
    </main>
  );
}