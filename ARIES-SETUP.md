# Aries chat setup

The chat widget is installed on every page. To activate AI answers, run the included Node server with your OpenAI API key as a private environment variable. Requires Node.js 20 or newer. No npm packages are needed.

## Run locally

**macOS / Linux:**

```sh
export OPENAI_API_KEY='your-key-here'
node server.mjs
```

**Windows PowerShell:**

```powershell
$env:OPENAI_API_KEY = 'your-key-here'
node server.mjs
```

Open `http://localhost:3000`. You may set `PORT` and `OPENAI_MODEL` as environment variables if needed. The default model is `gpt-4.1-mini`. Do not paste a real key into an HTML, JavaScript, or CSS file, a ZIP shared publicly, or a chat message.

## Put it online

Host this folder on a platform that runs Node.js, start it with `node server.mjs`, and configure `OPENAI_API_KEY` as a server-side secret in that platform's settings. Point the domain to that running server. A static-only host can display the widget but cannot run its `/api/aries` endpoint; the widget will then show a call-us fallback.

### GoDaddy Node.js Hosting with GitHub

The included `package.json` supplies the build and start scripts GoDaddy requires. Put `package.json`, `server.mjs`, `index.html`, and the `CSS`, `JS`, and `Images` folders at the top level of your GitHub repository. In GoDaddy **Node.js Hosting**, choose **Connect GitHub**, select the repository and branch, and choose **Import & Deploy**. In the deployment setup, choose **I need to add secrets for my app to boot** and add `OPENAI_API_KEY` with your private API key. You can also add it later under the app's **Settings → Manage secrets**. Test the preview URL, then use **Publish Now** and attach your domain in Settings. Never add the key to GitHub. If your GoDaddy product only publishes static files or uses another hosting workflow, this Node.js setup may be a separate hosting product; you can instead host the entire site on a Node host and point the GoDaddy domain there.

The server currently limits an IP address to twelve chat requests per minute and keeps at most ten prior messages in each browser tab. For a public high-traffic launch, add platform-level abuse protection and a spending limit to your OpenAI project. API usage is billed through your OpenAI account. Aries doesn't take payments, complete bookings, or provide veterinary diagnoses.

## Update business answers

Edit the `facts` and `instructions` constants at the top of `server.mjs` when services, prices, hours, phone, or policies change. Restart the server afterward. The consent forms card is a placeholder: when your DocuSign URL is ready, link it in `ff_contact.html` and update the facts in `server.mjs`.
