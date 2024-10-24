'use client'
import React, { useState } from 'react';
import { Search, Loader2, ArrowUpRight, MessageSquare, ArrowUp } from 'lucide-react';
import getPosts from '../api/reddit/route';

function App() {
  const [subreddit, setSubreddit] = useState('');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getPosts(subreddit);
      setPosts(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Reddit Explorer
          </h1>
          <p className="mt-3 text-gray-400">Discover and explore Reddit content with style</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              placeholder="Enter subreddit name..."
              className="w-full pl-12 pr-32 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchPosts()}
            />
            <button
              onClick={handleFetchPosts}
              disabled={isLoading}
              className="absolute right-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                'Explore'
              )}
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-gray-100 flex-1">
                    {post.title}
                  </h2>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                </div>

                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
                  <span>by {post.author}</span>
                  <div className="flex items-center space-x-1">
                    <ArrowUp size={16} />
                    <span>{post.score}</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MessageSquare size={18} />
                    <h3 className="font-medium">Top Comments</h3>
                  </div>
                  <div className="space-y-3">
                    {post.comments.map(comment => (
                      <div
                        key={comment.id}
                        className="p-4 bg-gray-700/30 rounded-lg border border-gray-700/50"
                      >
                        <p className="text-gray-300 text-sm">{comment.body}</p>
                        <p className="mt-2 text-xs text-gray-400">
                          {comment.author}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p className="mt-4 text-gray-400">Fetching subreddit content...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>Enter a subreddit name to start exploring</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;