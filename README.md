# lit-tutor

Architecture and key features
Core features
- Homepage with library: Browse and select literature books to read, with filters and search.
- Reader + review workspace: Read the book, highlight passages, annotate, create review notes, and ask the AI assistant questions in real time; AI cites passages and explains character traits/themes.
- Oral literature: A learning page with curated oral literature materials (proverbs, folktales, riddles, songs) and structured lessons.
- Poetry lab: Upload poems and generate poems via AI; includes scansion helper and figurative language hints.
- User profiles: Track reading progress, highlights, notes, saved reviews, and generated content.
- Real-time AI assistant: Socket-based chat that accesses the chosen book content, user highlights/notes, and your review outline to give grounded, example-rich answers.
Tech stack
- Frontend: React (Vite or CRA), React Router, Redux Toolkit or Zustand, Tailwind or MUI.
- Backend: Node.js, Express, Socket.IO, MongoDB Atlas (Mongoose).
- AI layer: Server-side LLM integration with document parsing, chunking, and retrieval (embeddings + semantic search) to answer questions grounded in book text and user notes.
- Auth: JWT, bcrypt, role-based access for admins/teachers.
- Storage: MongoDB Atlas (books, chapters, embeddings, user notes, poems, oral literature lessons, generated content). Book files stored as text/HTML or PDF with server-side extraction.

Data models (MongoDB Atlas)
Use Mongoose models. These cover users, books, chapters, embeddings, notes, reviews, oral literature, poems, and chat sessions/messages.

Implementation notes and best practices
Retrieval-augmented assistant
- Chunking: Split chapters into overlapping chunks (e.g., 800 chars, 200 overlap) to preserve context.
- Embeddings: Embed each chunk and store vectors in MongoDB. For larger corpora, consider a dedicated vector store; for Atlas, keep vector length modest and index by bookId/chapterIndex.
- Ranking: Compute cosine similarity server-side to select top-k passages; send those to the LLM with the user’s notes and review thesis for grounded responses.
- Citations: Include chapter indices and brief excerpts in assistant messages to show evidence. Store them under message.citations.


Next steps
- Provision MongoDB Atlas: Create cluster, network access, .env with MONGODB_URI and JWT_SECRET.
- Integrate an LLM provider: Set API key in server .env; implement embedText and callLLM with real endpoints.
- Seed content: Add a few books (classic novels), oral literature lessons relevant to Kenya (e.g., Kikuyu proverbs), and sample poems.
- Polish UI: Add typography controls, highlight selection-to-note creation, and citation badges in assistant replies.
- Deploy: Backend on a Node host; frontend on a static host; configure CORS and environment variables.
If you want, I can tailor this to specific books you plan to include and set up seed scripts so your library loads cleanly on first run.

Landing page & routing (added)
--------------------------------
I've added a simple landing page to the frontend (client) with a hero, features section, testimonials, and footer. The contents are implemented in React under `client/src/pages/Landing.jsx` and the app routing now includes a landing route and concise navigation links.

Landing page structure (JSX)

hero section:
```
<section className="hero bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-12 text-center">
	<h1 className="text-4xl font-bold mb-4">Learn Literature with AI Assistance</h1>
	<p className="text-lg mb-6">Read, review, and explore oral traditions and poetry with real‑time guidance.</p>
	<button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold">Start Reading</button>
</section>
```

features section:
```
<section className="features grid grid-cols-1 md:grid-cols-3 gap-6 p-12">
	...
</section>
```

testimonials and footer:
```
<section className="reviews bg-gray-100 p-12">...</section>
<footer className="bg-indigo-600 text-white p-6 text-center">...</footer>
```

Routing / links (how the landing page connects to the MERN backend)
- Books → /books — client page `client/src/pages/Home.jsx` (fetches books; server: /api/books)
- AI Assistant → /read/:id — client page `client/src/pages/Read.jsx` (connects to assistant via Socket.IO on server)
- Oral Literature → /oral — client page `client/src/pages/Oral.jsx` (fetches data from /api/oral)
- Poetry Lab → /poetry — client page `client/src/pages/Poetry.jsx` (fetches poems from /api/poems)
- Reviews → /reviews — client page `client/src/pages/Reviews.jsx` (fetches /api/reviews)

Notes:
- I added a few small CSS fallbacks so the page looks presentable without Tailwind installed; if you'd like Tailwind  or MUI for exact spacing and responsive utilities, I can wire that up next.
- `react-router-dom` was added to `client/package.json` and the app uses a BrowserRouter + Routes in `client/src/App.jsx` / `main.jsx`.

Seeding the database (development)
---------------------------------
I added a dev seed script at `server/scripts/seed.js` that creates a sample user, a short sample book with two chapters, a review, a poem and an oral lesson. To run it locally set your `MONGODB_URI` in the server environment and run:

```powershell
cd server
pnpm install
pnpm run seed
```

Tailwind (optional)
-------------------
Tiny steps added so you can enable Tailwind quickly if you want production-like layout:

- Files added: `client/tailwind.config.cjs`, `client/postcss.config.cjs`, and the Tailwind directives were added to `client/src/index.css` for building.
- To enable Tailwind run inside `client/`:

```powershell
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
pnpm dev
```

The current landing JSX uses Tailwind class names; I also left small fallback CSS in `client/src/App.css` so the page looks presentable while Tailwind is optional.
