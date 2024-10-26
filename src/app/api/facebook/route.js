import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const { pageUrl, query } = await request.json();

    // Log the incoming request for debugging
    console.log('Received request:', { pageUrl, query });

    // Check if environment variables are set
    const fbEmail = process.env.FB_EMAIL;
    const fbPassword = process.env.FB_PASSWORD;

    if (!fbEmail || !fbPassword) {
      return NextResponse.json(
        { error: 'Facebook credentials are missing' },
        { status: 500 }
      );
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
    );

    // Navigate to Facebook login page
    await page.goto('https://www.facebook.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Log in to Facebook
    await page.type('#email', fbEmail);
    await page.type('#pass', fbPassword);
    await Promise.all([
      page.click('button[name="login"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
    ]);

    // Ensure that the login was successful by checking for the Facebook logo
    const loggedIn = await page.$('a[aria-label="Facebook"]');
    if (!loggedIn) {
      throw new Error('Login failed. Please check your credentials.');
    }

    // Navigate to the target page after login
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Ensure the page is fully loaded before scraping
    await page.waitForSelector('[role="article"]', { timeout: 30000 });

    // Scrape posts from the page
    const posts = await page.evaluate((searchQuery) => {
      const articles = document.querySelectorAll('[role="article"]');
      return Array.from(articles).map((article) => {
        const text = article.textContent;
        const timeElement = article.querySelector('a[href*="/posts/"]');
        const timestamp = timeElement ? timeElement.textContent : '';
        const postUrl = timeElement ? timeElement.href : '';

        return { text, timestamp, postUrl };
      }).filter(
        (post) =>
          !searchQuery || post.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, query);

    console.log('Scraped posts:', posts);

    await browser.close();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Scraping error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data: ' + error.message },
      { status: 500 }
    );
  }
}
