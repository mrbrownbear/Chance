# Ricardo Chance local site

## Run

On Windows, install Node.js 18 or newer and double click START.bat.

On any supported computer, run `npm start` in this folder and open http://localhost:8080.

No npm install, build, remote API, CDN or original site connection is required. Serve the folder from the root of a static hosting domain. Do not open index.html directly with file://. A Vercel static configuration is included.

## Repairs

Restored the full HTML documents for Home, About and Work. The supplied homepage had been overwritten with a Next.js prefetch response. Added local English URL aliases and static document navigation. Removed server dependent prefetching, replaced the Next.js image service with bundled source images and repaired serialized React text record lengths. Preserved the captured JavaScript, WebGL code, animations, styles, fonts, images and videos. Added missing icon sizes using supplied artwork, removed deployment feedback injection and removed broken capture artifacts.

The content security policy restricts automatic asset and connection requests to this origin. Original site resource fetches are mapped locally. Explicit social and project links remain outbound links and require internet when clicked. This package does not copy those separate websites.

## Contact

The original contact server action and mail credentials were not included. The form validates the fields and opens a populated draft in the visitor's configured email application. It does not automatically send mail or report that mail has been delivered. Fields remain available if no email application is configured. Sending email requires an email application and connection.

## Capture limits

The archive only contained English documents. The broken Spanish language selector was removed. Original Spanish content is not included.

This is a repaired compiled capture, not the original Next.js source repository. Original build sources and backend services were not supplied.

## Verification

Run `npm test`. The included checks cover six document routes, 43 local asset references, CSS dependencies, dynamic media paths, JavaScript syntax, serialized React text lengths, HTTP asset responses, video byte ranges, missing resource responses and method restrictions.

Browser rendering and interactive animation tests could not be completed in this environment because the browser could not access the local server. Visual fidelity, mobile interactions and WebGL compatibility are therefore not certified. This is not a claim of 100 percent browser verification.
