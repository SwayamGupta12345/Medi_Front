"use client"

import { useState, useRef, useEffect } from "react"
import { createRoot } from "react-dom/client"
import axios from "axios"
import "./App.css"
import "reactflow/dist/style.css"

// Import Tailwind CSS
import "./index.css"

// const API_BASE = "http://localhost:8000"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const generateBookColorMap = (results) => {
  const uniqueBooks = [...new Set(results.map((r) => r.book))]
  const colors = [
    "#e0f7fa",
    "#fce4ec",
    "#fff9c4",
    "#f3e5f5",
    "#e8f5e9",
    "#ede7f6",
    "#ffebee",
    "#e1f5fe",
    "#fbe9e7",
    "#f9fbe7",
  ]
  const map = {}
  uniqueBooks.forEach((book, index) => {
    map[book] = colors[index % colors.length]
  })
  return map
}

function App() {
  // State for uploaded files
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  // State for chat
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")

  // State for responsive design
  const [isMobileView, setIsMobileView] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  const [uploadedTitles, setUploadedTitles] = useState([])
  const [selectedTitle, setSelectedTitle] = useState("")
  const [question, setQuestion] = useState("")
  const [results, setResults] = useState([])
  const [uploading, setUploading] = useState(false)
  const [querying, setQuerying] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const bookColorMap = generateBookColorMap(results)
  const verticalSpacing = 150 // increase this for more vertical space
  const horizontalSpacing = 250 // optional: if you want more horizontal spread

  // Refs
  const fileInputRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
      setShowSidebar(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)

    // Process uploaded files
    const newUploadedFiles = selectedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      id: Math.random().toString(36).substring(2, 11),
    }))

    setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
  }

  // Handle file upload button click
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select PDF files to upload")
      return
    }

    // In a real app, you would upload the files to a server here
    // For now, we'll just show a success message
    //alert(`${files.length} file(s) uploaded successfully!`);
    //setFiles([]);
    if (files.length === 0) return alert("Please select PDF files to upload.")
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    setUploading(true)
    try {
      const res = await axios.post(`${API_BASE}/upload/`, formData)
      setUploadedTitles(res.data.uploaded_titles)
      alert(res.data.message)
    } catch (err) {
      alert("Error uploading PDFs.")
    }
    setUploading(false)
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf")

      if (droppedFiles.length > 0) {
        setFiles(droppedFiles)

        // Process uploaded files
        const newUploadedFiles = droppedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          id: Math.random().toString(36).substring(2, 11),
        }))

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
      } else {
        alert("Please upload PDF files only")
      }
    }
  }

  // Handle chat input
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate assistant response after a short delay
    // setTimeout(() => {
    //   const assistantMessage = {
    //     id: Date.now() + 1,
    //     text: `I've analyzed your question about "${inputValue}" in the context of ${selectedFile || 'all uploaded PDFs'}. This is a simulated response that would normally contain information extracted from your documents.`,
    //     sender: 'assistant',
    //     timestamp: new Date().toLocaleTimeString()
    //   };

    //   setMessages(prev => [...prev, assistantMessage]);
    // }, 1000);
    setQuerying(true)
    try {
      const res = await axios.post(`${API_BASE}/query/`, { question: inputValue })
      setResults(res.data)
      const assistantMessage = {
        id: Date.now() + 1,
        text: `Here are the results for your question: "${inputValue}"`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      alert(err)
    }
    setQuerying(false)
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleQuery = async () => {
    if (!question.trim()) return alert("Please enter a question.")
    setQuerying(true)
    try {
      const res = await axios.post(`${API_BASE}/query/`, { question })
      setResults(res.data)
    } catch (err) {
      alert(err)
    }
    setQuerying(false)
  }

  const handleNodeClick = (event, node) => {
    if (node.data.fullText) {
      setSelectedText(node.data.fullText)
      setModalIsOpen(true)
    }
  }
  const nodes = results.map((res, index) => ({
    id: `${index + 1}`,
    data: {
      label: `${res.book}: "${res.text.slice(0, 50)}..."`,
      fullText: res.text,
    },
    position: {
      x: (index % 3) * horizontalSpacing + 100,
      y: Math.floor(index / 3) * verticalSpacing + 100,
    },
    style: {
      padding: 10,
      border: "1px solid #ccc",
      borderRadius: 10,
      background: bookColorMap[res.book],
      fontSize: 12,
      cursor: "pointer",
    },
  }))

  const edges = results.map((res, index) => ({
    id: `e0-${index + 1}`,
    source: "0",
    target: `${index + 1}`,
  }))

  const rootNode = {
    id: "0",
    data: { label: "📌 Query" },
    position: { x: 300, y: 0 },
    style: {
      background: "#FFD700",
      color: "#000",
      fontWeight: "bold",
      padding: 10,
      borderRadius: 10,
    },
  }

  const allNodes = [rootNode, ...nodes]
  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Mobile Toggle Button */}
        {isMobileView && (
          <button
            className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-md"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? "✕" : "☰"}
          </button>
        )}

        {/* Sidebar */}
        <div
          className={`
          ${showSidebar ? "block" : "hidden"} 
          w-full md:w-[30%] bg-white p-6 shadow-md
          ${isMobileView ? "absolute z-40 top-0 left-0 right-0 h-auto" : "h-screen overflow-y-auto"}
        `}
        >
          <h1 className="text-2xl font-bold mb-6 text-gray-800">📚 PDF Intelligence Assistant</h1>

          {/* Upload Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">📤 Upload PDFs</h2>
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
                transition-all duration-200
              `}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <p className="text-gray-500 mb-2">Drag & drop PDFs here or click to browse</p>
              {files.length > 0 && <p className="text-sm text-blue-500">{files.length} file(s) selected</p>}
            </div>

            {files.length > 0 && (
              <button
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow transition-colors duration-200"
                onClick={handleUpload}
              >
                Upload Files
              </button>
            )}
          </div>

          {/* PDF Selection Dropdown */}
          {uploadedFiles.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">📄 Select PDF</h2>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
              >
                <option value="">All uploaded files</option>
                {uploadedFiles.map((file) => (
                  <option key={file.id} value={file.name}>
                    {file.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Uploaded Files</h2>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="mr-3 text-red-500">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen">
          {/* Chat Container */}
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-xl">No messages yet</p>
                  <p className="mt-2">Upload PDFs and ask questions about them</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[80%] p-4 rounded-lg shadow-sm
                        ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }
                      `}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`
                          text-xs mt-1 text-right
                          ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}
                        `}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ask your question here..."
                value={inputValue}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200"
                disabled={!inputValue.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
      {/*
      <div className="pdf-query-app">
        <h1 className="title">📚 PDF Intelligence Assistant</h1>

        <div className="card upload-card">
          <h2><span role="img" aria-label="upload">📤</span> Upload PDFs</h2>
          <input type="file" multiple accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {uploadedTitles.length > 0 && (
          <div className="card">
            <h2>📄 Uploaded PDFs</h2>
            <select
              className="dropdown"
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
            >
              <option value="">-- All Uploaded Files --</option>
              {uploadedTitles.map((title, idx) => (
                <option key={idx} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="card query-card">
          <h2>❓ Ask a Question</h2>
          <input
            type="text"
            placeholder="Ask something like: What are the benefits of Aloe Vera?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleQuery} disabled={querying}>
            {querying ? "Searching..." : "Ask"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="card results-card">
            <h2>📖 Top Results</h2>
            {results.map((res, index) => (
              <div className="result" key={index}>
                <h3 className="black">📘 Book: {res.book}</h3>
                <p className="black"><strong>Score:</strong> {res.score.toFixed(3)}</p>
                <p className="snippet">📝 {res.text.slice(0, 1000)}{res.text.length > 1000 && '...'}</p>
              </div>
            ))}
          </div>
        )}
        <div style={{ width: '100%', height: '800px', justifyContent: "top" }}>
          <ReactFlow
            nodes={allNodes}
            edges={edges}
            fitView
            onNodeClick={handleNodeClick}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Full Snippet"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '600px',
              padding: '20px',
              fontFamily: 'sans-serif',
            }
          }}
        >
          <h2 className='black'>📘 Full Snippet</h2>
          <p className='black'>{selectedText}</p>
          <button onClick={() => setModalIsOpen(false)}>Close</button>
        </Modal>
      </div>
      */}
    </div>
  )
}

export default App

// For rendering the app
if (typeof document !== "undefined") {
  const container = document.getElementById("root")
  const root = createRoot(container)
  root.render(<App />)
}
