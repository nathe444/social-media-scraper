export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Social Media Scrapers</h1>
      <div className="grid gap-4">
        <a 
          href="/reddit" 
          className="p-6 border rounded-lg hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Reddit Scraper</h2>
          <p className="text-gray-600">Scrape and analyze Reddit posts from any subreddit</p>
        </a>
        <a 
          href="/facebook" 
          className="p-6 border rounded-lg hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Facebook Scraper</h2>
          <p className="text-gray-600">Scrape and analyze Facebook posts from public pages</p>
        </a>
      </div>
    </div>
  );
}