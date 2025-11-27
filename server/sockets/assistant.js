import Chat from '../models/Chat.js';
import Book from '../models/Book.js';
import Note from '../models/Note.js';
import { embedText, searchEmbeddings } from '../services/aiRetrieval.js';
import { callLLM } from '../services/llm.js';

export function handleAssistantSocket(io, socket) {
  socket.on('assistant:start', async ({ userId, bookId, chatId }) => {
    socket.join(`chat:${chatId}`);
  });

  socket.on('assistant:ask', async ({ userId, bookId, chatId, question }) => {
    try {
      // Gather context: top passages + user notes
      const qVec = await embedText(question);
      const passages = await searchEmbeddings(bookId, qVec, 8);

      const notes = await Note.find({ userId, bookId }).sort({ createdAt: -1 }).limit(5);
      const book = await Book.findById(bookId).select('title meta characters themes');

      const contextText = [
        `Book: ${book.title} (${book.meta.author})`,
        `Themes: ${book.themes?.join(', ') || 'N/A'}`,
        `Characters: ${book.characters?.map(c => `${c.name}: ${c.traits?.join(', ')}`).join('; ') || 'N/A'}`,
        'Passages:',
        ...passages.map(p => `[Chapter ${p.chapterIndex}] ${p.text}`),
        'Recent Notes:',
        ...notes.map(n => `Note: ${n.content} | Excerpt: ${n.selection?.excerpt || ''}`)
      ].join('\n\n');

      const systemPrompt = `
You are a literature AI assistant. Ground answers in the book's text and student's notes.
- Identify character traits, motivations, and arcs, with direct cited passages.
- Analyze themes, symbols, tone, and narrative techniques.
- When asked for examples, quote or paraphrase brief excerpts with chapter references.
- Be concise but evidence-based. If uncertain, say so and ask for a specific passage.
      `.trim();

      const { streamId } = await callLLM({
        system: systemPrompt,
        context: contextText,
        user: question
      }, (delta) => {
        io.to(`chat:${chatId}`).emit('assistant:stream', { delta });
      });

      // Optionally save message after completion (collect in callLLM)
    } catch (e) {
      io.to(`chat:${chatId}`).emit('assistant:error', { error: 'Assistant failed. Try again.' });
    }
  });
}