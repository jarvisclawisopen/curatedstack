import 'dotenv/config';
// Import 6 apps: Tobira.ai, Zoer.ai, Fastlane, Hynote, Eternity, Videodubber
// Run: node import-6apps.js

const SUPABASE_URL = 'https://jereytrwxnuwcvzvqhbg.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SECRET_KEY

function randomDate() {
  const day = Math.floor(Math.random() * 5) + 20 // 20-24 March 2026
  const hour = Math.floor(Math.random() * 16) + 7
  const min = Math.floor(Math.random() * 60)
  return `2026-03-${String(day).padStart(2,'0')}T${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}:00+00:00`
}

const apps = [
  {
    name: 'Tobira',
    url: 'https://tobira.ai',
    category: 'AI',
    tags: ['ai-agents', 'networking', 'automation', 'b2b', 'discovery'],
    pricing_model: 'Freemium',
    description: 'AI agent network — give your agent a public address so it can find and negotiate with other agents on your behalf.',
    detailed_description: 'Tobira is an open network that gives AI agents a public @handle — like your-agent@tobira.ai — so they can discover, connect, and negotiate with other agents autonomously. Rather than manually networking or cold-emailing, you deploy your agent into Tobira\'s network where it discovers founders, investors, partners, and clients through their own agents. Agents match based on compatibility, initiate structured conversations, and can negotiate preliminary terms — all while the human retains final approval and control over what contact details are shared. Privacy is built-in: everything is anonymous until both sides explicitly approve sharing. The network is agent-first and protocol-open, built on the Tobira Protocol (open-source on GitHub). Tobira is particularly powerful for solo founders, small teams, and indie makers who want 24/7 outreach and matchmaking running in the background without hiring a sales team. Works natively with OpenClaw and other agent frameworks. Think of it as LinkedIn, but your AI rep does the networking for you.',
  },
  {
    name: 'Zoer',
    url: 'https://zoer.ai',
    category: 'Development',
    tags: ['no-code', 'app-builder', 'ai', 'database', 'full-stack'],
    pricing_model: 'Freemium',
    description: 'Turn your database schema into a real web app in minutes — no coding required.',
    detailed_description: 'Zoer is an AI-powered full-stack app generator that transforms database schemas and plain-language ideas into deployed web applications without writing a single line of code. Unlike simple form builders or low-code tools, Zoer generates both the frontend UI and the backend services — complete with API routes and database configuration — from a description of what you want to build. The integrated AI assistant guides users through the process, suggesting schema improvements and UI layouts as it builds. Zoer is designed for startups, entrepreneurs, product managers, and designers who need to move fast from concept to working product. Use cases include internal tools, client portals, dashboards, admin panels, and MVP prototypes. The platform handles deployment automatically so you can share a live URL immediately after generation. For technical users, the generated code is fully accessible and editable, making Zoer a strong starting point that saves hours of boilerplate setup. A modern alternative to hiring a developer for simple but functional web apps.',
  },
  {
    name: 'Fastlane',
    url: 'https://www.usefastlane.ai',
    category: 'Marketing',
    tags: ['content-creation', 'short-form-video', 'social-media', 'ai', 'tiktok', 'reels'],
    pricing_model: 'Paid',
    description: 'AI short-form content engine — remix viral videos into business content for TikTok, Reels, and YouTube Shorts in seconds.',
    detailed_description: 'Fastlane is an AI-powered content creation platform that turns trending viral videos into ready-to-post short-form content for your business — in seconds. Instead of spending hours scripting, filming, and editing, you browse Fastlane\'s trending content library, pick a format (hook + demo, green screen meme, slideshow, AI UGC), and the platform generates business-ready content tailored to your brand. You swipe through options Tinder-style and publish directly to TikTok, Instagram Reels, and YouTube Shorts from within the app. Features include a caption generator, content calendar, analytics dashboard, trending audio library, and a company report. Fastlane also supports hyper-realistic AI UGC (user-generated content) creation — letting brands produce influencer-style videos without actual influencers. The platform is purpose-built for founders, marketers, and small teams who know they need social content but don\'t have the time or resources to produce it consistently. Used by hundreds of businesses to drive organic growth on autopilot through short-form video.',
  },
  {
    name: 'HyNote',
    url: 'https://hynote.ai',
    category: 'Productivity',
    tags: ['note-taking', 'ai', 'meetings', 'transcription', 'summarization'],
    pricing_model: 'Freemium',
    description: 'AI note taker — turn any meeting, audio, or document into clear, actionable notes instantly.',
    detailed_description: 'HyNote is an AI-powered note-taking assistant trusted by over 1 million professionals and students worldwide. It transforms messy inputs — live meeting recordings, uploaded audio files, videos, PDFs, images, and pasted links — into organized, actionable summaries in seconds. Powered by the HyNote AI Core Engine, it handles transcription, summarization, and insight extraction automatically. You can record directly in-browser, upload existing files, or paste a YouTube URL to get a structured summary with key takeaways and action items. HyNote supports multiple content formats and output styles, making it equally useful for business meetings, lectures, podcast review, research papers, and voice memos. The platform is built for speed: one click to capture, one second to summarize. For teams, HyNote enables shared note libraries and collaborative annotations. For individuals, it eliminates the cognitive overhead of manual note-taking so you can stay present in conversations while the AI handles the documentation. A practical productivity multiplier for anyone who deals with information overload.',
  },
  {
    name: 'Eternity',
    url: 'https://witheternity.com',
    category: 'Productivity',
    tags: ['timeline', 'planning', 'visualization', 'project-management', 'history'],
    pricing_model: 'Freemium',
    description: 'Make timelines — beautifully visualize events, projects, and history on interactive timelines.',
    detailed_description: 'Eternity is a timeline creation tool that makes it easy to build, share, and explore interactive timelines for any purpose — project planning, historical research, personal milestones, company roadmaps, or educational content. Unlike Gantt charts or spreadsheet timelines, Eternity focuses on visual clarity and storytelling: events are displayed chronologically with rich context, images, and descriptions. Users can create timelines from scratch or import data, then share them publicly or keep them private. The tool is useful for teachers building history lessons, product teams mapping out feature releases, researchers documenting event sequences, and individuals tracking personal or family history. Eternity\'s clean, distraction-free interface makes timeline creation accessible to non-technical users while offering enough depth for complex, multi-layered projects. Whether you\'re mapping out a business strategy, documenting a historical period, or planning a product launch, Eternity provides the visual structure to make time-based information easy to understand and communicate.',
  },
  {
    name: 'VideoDubber',
    url: 'https://videodubber.ai',
    category: 'AI',
    tags: ['video-dubbing', 'translation', 'voice-cloning', 'multilingual', 'content-creation'],
    pricing_model: 'Freemium',
    description: 'AI video translation & voice dubbing — translate and dub videos in 150+ languages while preserving your original voice.',
    detailed_description: 'VideoDubber is an AI-powered video translation and dubbing platform that lets creators and businesses make their video content available in 150+ languages — while maintaining the speaker\'s original voice through premium voice cloning. Unlike tools that replace your voice with a generic AI voice, VideoDubber clones your voice and applies it to the dubbed version, so international audiences hear content that sounds authentically like you. The workflow is one-click simple: upload a video or paste a URL, choose a target language, and receive a dubbed video with synced subtitles. An advanced editor lets power users fine-tune subtitles, adjust timestamps, and modify translations. VideoDubber supports lip sync, subtitle generation, and instant preview. Pricing starts at $0.09/minute — significantly cheaper than competitors — with unlimited premium voice cloning on paid plans. Used by YouTube creators, businesses with international audiences, and e-learning platforms. Studies cited by the platform show dubbed videos with the creator\'s original voice get 3x more engagement than generic voice-overs, making authentic multilingual content a real competitive advantage.',
  },
]

async function insertApp(app) {
  const payload = {
    ...app,
    upvotes: 0,
    featured: false,
    created_at: randomDate(),
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/apps`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  if (res.ok) {
    const data = JSON.parse(text)
    console.log(`✅ ${app.name} → id=${data[0]?.id}`)
  } else {
    console.error(`❌ ${app.name} FAILED: ${res.status} ${text}`)
  }
}

async function main() {
  console.log(`Inserting ${apps.length} apps...\n`)
  for (const app of apps) {
    await insertApp(app)
  }
  console.log('\nDone.')
}

main()
