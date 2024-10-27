"use client";

import { useState } from "react";
import { Search ,AlertCircle, Loader2, Clock, ThumbsUp, MessageCircle, ExternalLink,Facebook } from "lucide-react";


function Post({ post }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xl text-gray-100 mb-4">
              {post.content || "No content"}
            </p>
            
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {post.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Post image ${i + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
              </div>
            )}
            
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{post.timestamp}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp size={16} />
                <span>{post.reactions}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={16} />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
          {post.postUrl && (
            <a
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [targetUrl, setTargetUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Facebook className="h-12 w-12" />
            Facebook Content Explorer
          </h1>
          <p className="mt-3 text-gray-400">
            Explore Facebook content with ease and style
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={fetchPosts}>
            <div className="space-y-4">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="Enter Facebook URL..."
                  required
                  className="w-full pl-12 pr-32 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    'Explore'
                  )}
                </button>
              </div>
              <label className="text-gray-400 ml-2 text-sm">
                Eg: https://facebook.com/nasa
              </label>
            </div>
          </form>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {posts.map((post, index) => (
            <Post key={index} post={post} />
          ))}
        </div>

        {loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p className="mt-4 text-gray-400">Fetching Facebook content...</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>Enter a Facebook URL to start exploring</p>
          </div>
        )}
      </div>
    </div>
  );
}