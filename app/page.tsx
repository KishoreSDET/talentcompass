export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex flex-col items-center justify-center text-white">
      <div className="text-center px-6">
        <div className="text-6xl mb-4">🧭</div>
        <h1 className="text-5xl font-bold mb-4">TalentCompass</h1>
        <p className="text-xl text-blue-200 mb-2">Your AI-powered job search companion</p>
        <p className="text-md text-slate-400 mb-10">Built for senior tech professionals navigating Sydney&apos;s job market</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition">
            <div className="text-3xl mb-2">🏢</div>
            <h2 className="text-lg font-semibold">Company Discovery</h2>
            <p className="text-sm text-slate-300 mt-1">Find top tech companies with open QA roles</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition">
            <div className="text-3xl mb-2">📋</div>
            <h2 className="text-lg font-semibold">Application Tracker</h2>
            <p className="text-sm text-slate-300 mt-1">Track every application and follow-up</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition">
            <div className="text-3xl mb-2">🤖</div>
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <p className="text-sm text-slate-300 mt-1">Tailor resumes and prep for interviews</p>
          </div>
        </div>

        <div className="mt-10">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full text-lg transition">
            Get Started →
          </button>
        </div>
      </div>
    </main>
  );
}