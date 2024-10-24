'use client'

import React, { useState } from 'react';
import { Search, Loader2, ArrowUpRight, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

export default function FacebookPage() {
  const [pageUrl, setPageUrl] = useState('');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageUrl, query }),
      });
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setPosts(data.posts);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Facebook Explorer
          </h1>
          <p className="mt-3 text-gray-400">Discover and analyze Facebook content with ease</p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12 space-y-4">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              placeholder="Enter Facebook page URL..."
              className="w-full pl-12 pr-32 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchPosts()}
            />
          </div>
          
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keywords (optional)..."
              className="w-full pl-12 pr-32 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchPosts()}
            />
            <button
              onClick={handleFetchPosts}
              disabled={isLoading || !pageUrl}
              className="absolute right-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-gray-100 flex-1">
                    {post.message || post.title}
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

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="mt-4 rounded-lg w-full object-cover max-h-96"
                  />
                )}

                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
                  <span>Posted on {new Date(post.created_time).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={16} />
                    <span>{post.likes || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 size={16} />
                    <span>{post.shares || 0}</span>
                  </div>
                </div>

                {/* Comments Section */}
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MessageSquare size={18} />
                      <h3 className="font-medium">Top Comments</h3>
                    </div>
                    <div className="space-y-3">
                      {post.comments.map((comment, index) => (
                        <div
                          key={comment.id || index}
                          className="p-4 bg-gray-700/30 rounded-lg border border-gray-700/50"
                        >
                          <p className="text-gray-300 text-sm">{comment.message}</p>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                            <span>{comment.from?.name || 'Anonymous'}</span>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <ThumbsUp size={12} />
                                <span>{comment.like_count || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="mt-4 text-gray-400">Analyzing Facebook content...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && !error && (
          <div className="text-center py-20 text-gray-400">
            <p>Enter a Facebook page URL to start exploring</p>
          </div>
        )}
      </div>
    </div>
  );
}