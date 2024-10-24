import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const { pageUrl, query } = await request.json();

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('[role="article"]');

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
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}