'use client'
import { useState } from 'react';

export default function ScraperForm({ type, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subreddit: '',
    pageUrl: '',
    query: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {type === 'reddit' ? (
        <input
          type="text"
          value={formData.subreddit}
          onChange={(e) => setFormData({ ...formData, subreddit: e.target.value })}
          placeholder="Enter subreddit"
          className="border p-2 mr-2"
          required
        />
      ) : (
        <input
          type="text"
          value={formData.pageUrl}
          onChange={(e) => setFormData({ ...formData, pageUrl: e.target.value })}
          placeholder="Enter Facebook page URL"
          className="border p-2 mr-2 w-64"
          required
        />
      )}
      <input
        type="text"
        value={formData.query}
        onChange={(e) => setFormData({ ...formData, query: e.target.value })}
        placeholder="Search query (optional)"
        className="border p-2 mr-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Loading...' : 'Scrape'}
      </button>
    </form>
  );
}