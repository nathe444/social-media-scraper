import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const { pageUrl, query } = await request.json();

    // Launch Puppeteer with extra arguments for performance optimization
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    // Set user agent to avoid being blocked as a bot
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Ensure the page is fully loaded before scraping
    await page.waitForSelector('[role="article"]', { timeout: 30000 });

    const posts = await page.evaluate((searchQuery) => {
      const articles = document.querySelectorAll('[role="article"]');
      return Array.from(articles).map(article => {
        const text = article.textContent;
        const timeElement = article.querySelector('a[href*="/posts/"]');
        const timestamp = timeElement ? timeElement.textContent : '';
        
        return { text, timestamp };
      }).filter(post => !searchQuery || post.text.toLowerCase().includes(searchQuery.toLowerCase()));
    }, query);

    await browser.close();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
