import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

const RATE_LIMIT = 5000;
let lastRequest = Date.now() - RATE_LIMIT;

const SELECTORS = {
  // Login related
  LOGIN: {
    EMAIL: '#email',
    PASSWORD: '#pass',
    BUTTON: '[name="login"]',
    ERROR: '[role="alert"], .login_error_box'
  },

  // Cookie consent
  COOKIE_CONSENT: '[data-cookiebanner="accept_button"]',

  // Updated post selectors for better coverage
  POST_CONTAINER: 'div.x1yztbdb:not([aria-hidden="true"])',
  CONTENT: '[data-ad-comet-preview="message"], [data-ad-preview="message"], div[dir="auto"]',
  
  // Engagement metrics with updated selectors
  REACTIONS_CONTAINER: 'span.x16hj40l',
  COMMENTS_CONTAINER: 'span.x193iq5w',
  
  // Media and links
  IMAGES: 'img[src*="scontent"]',
  POST_LINK: 'a[href*="/posts/"], a[href*="/photos/"]',
  
  // Timestamp and metadata
  TIMESTAMP: 'a[role="link"] > span.x4k7w5x',
  
  // Filters
  SPONSORED: '[aria-label="Sponsored"]'
};

export async function POST(request) {
  try {
    const { targetUrl } = await request.json();
    const username = process.env.FB_EMAIL;
    const password = process.env.FB_PASSWORD;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Facebook credentials not found in environment variables" },
        { status: 500 }
      );
    }

    if (!targetUrl?.includes('facebook.com')) {
      return NextResponse.json(
        { error: "Please provide a valid Facebook URL" },
        { status: 400 }
      );
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Configure page
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      page.setDefaultNavigationTimeout(60000);

      // Disable image loading for better performance
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.resourceType() === 'image') {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Login to Facebook
      await page.goto('https://www.facebook.com/', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Handle cookie consent if present
      try {
        await page.waitForSelector(SELECTORS.COOKIE_CONSENT, { timeout: 5000 });
        await page.click(SELECTORS.COOKIE_CONSENT);
        await page.evaluate(() => new Promise((resolve) => setTimeout(() => resolve(), 5000)));  // Waits 5 seconds
      } catch (e) {
        // Continue if no cookie banner
      }

      // Login process
      await page.waitForSelector(SELECTORS.LOGIN.EMAIL, { visible: true });
      await page.type(SELECTORS.LOGIN.EMAIL, username);
      await page.type(SELECTORS.LOGIN.PASSWORD, password);
      
      await Promise.all([
        page.click(SELECTORS.LOGIN.BUTTON),
        page.waitForNavigation({ waitUntil: 'networkidle0' })
      ]);

      // Check for login errors
      const loginError = await page.$(SELECTORS.LOGIN.ERROR);
      if (loginError) {
        const errorText = await page.evaluate(el => el.textContent, loginError);
        throw new Error(`Login failed: ${errorText}`);
      }

      // Navigate to target page
      await page.goto(targetUrl, { waitUntil: 'networkidle0' });
      await page.evaluate(() => new Promise((resolve) => setTimeout(() => resolve(), 5000)));  // Waits 5 seconds

      // Scroll to load more content
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        await page.evaluate(() => new Promise((resolve) => setTimeout(() => resolve(), 5000)));  // Waits 5 seconds
      }

      // Extract posts with improved selectors
      const posts = await page.evaluate((SELECTORS) => {
        const extractText = (element) => element?.textContent?.trim() || '';
        
        // Get all post containers and filter out sponsored content
        const posts = Array.from(document.querySelectorAll(SELECTORS.POST_CONTAINER))
          .filter(post => !post.querySelector(SELECTORS.SPONSORED));

        return posts.map(post => {
          try {
            // Extract content with fallback selectors
            const contentEl = post.querySelector(SELECTORS.CONTENT) || 
                            post.querySelector('div[dir="auto"]');
            const content = contentEl ? extractText(contentEl) : '';

            // Extract engagement metrics
            const reactionsEl = post.querySelector(SELECTORS.REACTIONS_CONTAINER);
            const reactions = reactionsEl ? extractText(reactionsEl).replace(/[^\d]/g, '') || '0' : '0';
            
            const commentsEl = post.querySelector(SELECTORS.COMMENTS_CONTAINER);
            const comments = commentsEl ? extractText(commentsEl).replace(/[^\d]/g, '') || '0' : '0';

            // Extract images with improved selector
            const images = Array.from(post.querySelectorAll(SELECTORS.IMAGES))
              .map(img => img.src)
              .filter(Boolean);

            // Extract post URL and timestamp
            const postLink = post.querySelector(SELECTORS.POST_LINK);
            const postUrl = postLink ? postLink.href : '';
            
            const timestampEl = post.querySelector(SELECTORS.TIMESTAMP);
            const timestamp = timestampEl ? extractText(timestampEl) : '';

            return {
              content,
              timestamp,
              reactions,
              comments,
              postUrl,
              images
            };
          } catch (e) {
            console.error('Error extracting post data:', e);
            return null;
          }
        }).filter(Boolean);
      }, SELECTORS);

      return NextResponse.json({ 
        success: true, 
        posts: posts.filter(post => post.content || post.images?.length)
      });

    } finally {
      await browser.close();
    }

  } catch (error) {
    console.error("Facebook scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape Facebook: " + error.message },
      { status: 500 }
    );
  }
}