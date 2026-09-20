import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            record_video_dir="/home/jules/verification/videos"
        )
        page = await context.new_page()

        # Serve app from local path
        abs_path = os.path.abspath("index.html")
        await page.goto(f"file://{abs_path}")
        await page.wait_for_timeout(1000)

        # Check total cards in timeline and gallery
        timeline_cards = await page.locator(".timeline-card").count()
        gallery_cards = await page.locator(".gallery-card").count()
        print(f"Timeline photo cards count: {timeline_cards}")
        print(f"Gallery photo cards count: {gallery_cards}")

        # Check audio element src
        audio_src = await page.get_attribute("#bgMusic", "src")
        print(f"Audio element src: {audio_src}")

        # Click page to test interaction music auto-play trigger
        await page.click("body")
        await page.wait_for_timeout(500)

        # Take main verification screenshot
        await page.screenshot(path="/home/jules/verification/screenshots/verification.png", full_page=True)

        await context.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
