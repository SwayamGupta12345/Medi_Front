# PDF Intelligence Assistant Frontend

A Next.js-based frontend chatbot interface for querying content from uploaded PDFs (such as medical research papers, books, and articles). This project is designed for medical or academic professionals, students, and researchers who want to interactively search, explore, and visualize information extracted from complex documents.

---

## Features

- **PDF Upload:** Easily upload PDF documents (research papers, books, etc.) through the web UI.
- **Natural Language Chatbot:** Ask questions in plain language and receive contextually relevant answers, powered by a backend extraction and retrieval system.
- **Source Citations:** Each answer includes citations and references to the specific documents and sections used.
- **Mindmap-Style Visualization:** Visualize the relationships between your question, the answer snippets, and their sources as a dynamic mindmap graph.
- **Relevancy Scores:** Results are sorted by relevancy as determined by the backend, helping you focus on the most pertinent information.
- **Responsive & Modern UI:** Built with Next.js and React, featuring an intuitive chat interface with sidebar navigation and modals for deep dives into content.
- **File Management:** View, select, and manage uploaded PDFs, including titles and file sizes.

---

## How It Works

1. **Upload PDFs:** Drag and drop or select PDF files to upload. The backend processes your documents for extraction and indexing.
2. **Ask Questions:** Use the chat interface to ask queries in natural language.
3. **Get Contextual Answers:** The assistant replies with answers, each linked to the specific source (book/paper) and a relevancy score.
4. **Visualize Results:** Click "View Graph" to see a mindmap of answer snippets and their relationships to your query.
5. **Explore Sources:** Click on graph nodes to read full text snippets from the source documents.

---

## Technologies Used

- **Next.js / React**: UI and frontend logic.
- **ReactFlow**: Mindmap/graph visualization.
- **Axios**: API requests to backend.
- **Tailwind CSS**: UI styling.
- **PDF.js (via backend)**: PDF parsing and extraction (handled server-side).
- **Backend (not included)**: Handles PDF ingestion, semantic search, and answer retrieval.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Backend service that implements `/upload/` and `/query/` endpoints (see API section).

### Installation

```bash
git clone https://github.com/SwayamGupta12345/Medi_Front.git
cd Medi_Front
npm install
```

### Environment Variables

Create a `.env.local` file with your backend API base URL:

```
NEXT_PUBLIC_API_BASE=https://your-backend-api-url.com
```

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## API Reference

- `POST /upload/` — Upload PDFs for extraction and indexing.
- `POST /query/` — Pass `{ question: "your question" }` to receive results in the format:
  ```json
  [
    {
      "book": "Document Title",
      "text": "Relevant snippet",
      "score": 0.95
    }
  ]
  ```

---

## Project Structure

- `app/page.jsx` — Main chatbot UI.
- `app/Myfiles/page.jsx` — File management and alternate chat view.
- `components/Sidebar.jsx` — Sidebar navigation.
- `public/` — Static assets (images, icons, etc.).

---

## Customization

- **Styling:** Uses Tailwind CSS; you can easily modify colors, themes, and layouts.
- **Graph Visualization:** Powered by ReactFlow; you can extend node/edge styling and interactivity.
- **Backend:** You must provide a backend that supports PDF ingestion and semantic query endpoints.

---

## Contributing

Contributions welcome! Please open issues or submit pull requests for features, bug fixes, or improvements.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- Inspired by modern AI-powered document search tools.
- Thanks to the open-source Next.js and ReactFlow communities.

---

## Contact

Questions or feedback? Reach out via [GitHub Issues](https://github.com/SwayamGupta12345/Medi_Front/issues).
