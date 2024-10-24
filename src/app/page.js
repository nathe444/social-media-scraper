import { Facebook, MessageCircleMore } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Social Media Explorer
          </h1>
          <p className="mt-3 text-gray-400">Discover and analyze content across multiple platforms</p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Reddit Card */}
          <a 
            href="/reddit" 
            className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 p-8"
          >
            <div className="flex items-center space-x-4 mb-4">
              <MessageCircleMore size={32} className="text-purple-400" />
              <h2 className="text-2xl font-semibold text-gray-100">Reddit Explorer</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Discover trending posts and discussions from any subreddit. Analyze comments, upvotes, and community engagement in real-time.
            </p>
            <div className="flex items-center text-purple-400 group-hover:translate-x-2 transition-transform duration-300">
              <span className="font-medium">Explore Reddit</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </a>

          {/* Facebook Card */}
          <a 
            href="/facebook" 
            className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 p-8"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Facebook size={32} className="text-blue-400" />
              <h2 className="text-2xl font-semibold text-gray-100">Facebook Explorer</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Analyze public Facebook pages, track engagement metrics, and monitor social media performance with advanced insights.
            </p>
            <div className="flex items-center text-blue-400 group-hover:translate-x-2 transition-transform duration-300">
              <span className="font-medium">Explore Facebook</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>Choose a platform to begin your social media analysis journey</p>
        </div>
      </div>
    </div>
  );
}