# Judo Flash Cards

A static, privacy-friendly judo study tool published with GitHub Pages at `https://www.judoflashcards.com/`.

## Publish

Upload the contents of this folder to the root of the `main` branch in the `marcusheier/judoflashcards` repository. Keep `CNAME` in the repository root so GitHub Pages continues to use the custom domain.

After publishing:

1. Confirm GitHub Pages still reports **DNS check successful** and **Enforce HTTPS** remains enabled.
2. Open the site in a private browser window and confirm the favicon appears.
3. Test Start, Flip, Previous, Next, belt filters, image dialogs, and the Privacy link.
4. Submit `https://www.judoflashcards.com/sitemap.xml` in Google Search Console.

## Privacy

Google Analytics measurement ID `G-65TKK711NK` is enabled in privacy-restricted Consent Mode. Analytics and advertising storage remain denied, advertising signals are disabled, and local previews are excluded. This provides limited cookieless measurement without a cookie prompt. The Ko-fi integration remains a normal external link rather than an embedded third-party script.

## Source files

- `index.html` – page structure
- `style.css` – visual styles
- `script.js` – flashcard behavior
- `analytics.js` – privacy-restricted Google Analytics setup
- `pictures/` – optimized WebP files and the GIF animations used by the flashcards
- Root favicon files – browser, Apple touch, and Android app icons
