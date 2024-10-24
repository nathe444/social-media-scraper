'use client'

import { useState } from 'react';
import ScraperForm from '../components/ScraperForm';
import PostList from '../components/PostList';

export default function FacebookPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async ({ pageUrl, query }) => {
    try {
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
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Facebook Scraper</h1>
      <ScraperForm type="facebook" onSubmit={handleSubmit} />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <PostList posts={posts} type="facebook" />
    </div>
  );
}
