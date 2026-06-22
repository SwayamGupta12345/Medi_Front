// "use client";

// import { useState, useRef, useEffect, use } from "react";
// import {
//   Upload,
//   Send,
//   Menu,
//   FileX,
//   User,
//   ScanText,
//   SunMoon,
// } from "lucide-react";
// import axios from "axios";
// import ReactFlow, { Background, Controls } from "reactflow";
// import "reactflow/dist/style.css";
// import Modal from "react-modal";
// import { useRouter } from "next/navigation";

// // const API_BASE = "http://localhost:8000"
// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// const generateBookColorMap = (results) => {
//   const uniqueBooks = [...new Set(results.map((r) => r.book))];
//   const colors = [
//     "#e0f7fa",
//     "#fce4ec",
//     "#fff9c4",
//     "#f3e5f5",
//     "#e8f5e9",
//     "#ede7f6",
//     "#ffebee",
//     "#e1f5fe",
//     "#fbe9e7",
//     "#f9fbe7",
//   ];
//   const map = {};
//   uniqueBooks.forEach((book, index) => {
//     map[book] = colors[index % colors.length];
//   });
//   return map;
// };

// export default function PDFChatAssistant() {
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [uploadedTitles, setUploadedTitles] = useState([]);
//   const [pendingFiles, setPendingFiles] = useState([]); // store selected but not yet uploaded files
//   const [question, setQuestion] = useState("");
//   const [results, setResults] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [querying, setQuerying] = useState(false);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedText, setSelectedText] = useState("");
//   const [graphModalOpen, setGraphModalOpen] = useState(false);
//   const [graphData, setGraphData] = useState([]); // data for selected message

//   const router = useRouter();
//   const bookColorMap = generateBookColorMap(results);
//   const verticalSpacing = 150;
//   const horizontalSpacing = 250;

//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);

// //   const themes = {
// //     teal: "bg-teal-500 hover:bg-teal-600 text-white",
// //     pink: "bg-pink-600 hover:bg-pink-700 text-white",
// //     green: "bg-green-500 hover:bg-green-600 text-white",
// //     blue: "bg-blue-500 hover:bg-blue-600 text-white",
// //     purple: "bg-purple-600 hover:bg-purple-700 text-white",
// //     orange: "bg-orange-500 hover:bg-orange-600 text-white",
// //     Dark: "bg-gray-800 hover:bg-gray-900 text-white",
// //     Light: "bg-gray-100 hover:bg-gray-200 text-gray-800",
// //   };
// // const [themeKey, setThemeKey] = useState("teal");
// //  const theme = themes[themeKey];
// //   const cycleThemes = () => {
// //   const keys = Object.keys(themes);
// //   const currentIndex = keys.indexOf(themeKey);
// //   const nextIndex = (currentIndex + 1) % keys.length;
// //   setThemeKey(keys[nextIndex]);
// // };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // const handleFileUpload = async (files) => {
//   //   if (!files || files.length === 0) return;

//   //   const formData = new FormData();
//   //   Array.from(files).forEach((file) => formData.append("files", file));

//   //   const newFiles = Array.from(files)
//   //     .filter((file) => file.type === "application/pdf")
//   //     .map((file) => ({
//   //       name: file.name,
//   //       size: file.size,
//   //       id: Math.random().toString(36).substr(2, 9),
//   //     }));
//   //   setUploadedFiles((prev) => [...prev, ...newFiles]);

//   //   setUploading(true);
//   //   try {
//   //     const res = await axios.post(`${API_BASE}/upload/`, formData);
//   //     setUploadedTitles(res.data.uploaded_titles || []);
//   //     alert(res.data.message || "Uploaded successfully");
//   //   } catch (err) {
//   //     alert("Error uploading PDFs.");
//   //   }
//   //   setUploading(false);
//   // };
//   const handleUploadSubmit = async () => {
//     if (pendingFiles.length === 0) return;

//     const formData = new FormData();
//     pendingFiles.forEach((entry) => formData.append("files", entry.file));

//     setUploading(true);
//     try {
//       const res = await axios.post(`${API_BASE}/upload/`, formData);
//       setUploadedTitles(res.data.uploaded_titles || []);
//       setUploadedFiles((prev) => [...prev, ...pendingFiles]);
//       setPendingFiles([]); // Clear after upload
//       alert(res.data.message || "Uploaded successfully");
//     } catch (err) {
//       alert("Error uploading PDFs.");
//     }
//     setUploading(false);
//   };

//   const handleSingleUpload = async (fileObj) => {
//     const formData = new FormData();
//     formData.append("files", fileObj.file); // still use 'files' for consistency

//     setUploading(true);
//     try {
//       const res = await axios.post(`${API_BASE}/upload/`, formData);

//       // Update uploaded files
//       setUploadedFiles((prev) => [...prev, fileObj]);
//       setUploadedTitles((prev) => [
//         ...prev,
//         ...(res.data.uploaded_titles || []),
//       ]);

//       // Remove from pending list
//       setPendingFiles((prev) => prev.filter((f) => f.id !== fileObj.id));

//       alert(res.data.message || `Uploaded "${fileObj.name}"`);
//     } catch (err) {
//       alert(`Error uploading "${fileObj.name}".`);
//     }
//     setUploading(false);
//   };

//   const handleFileSelect = (files) => {
//     if (!files || files.length === 0) return;

//     const validFiles = Array.from(files).filter(
//       (file) => file.type === "application/pdf"
//     );

//     const existingFileKeys = new Set(pendingFiles.map((f) => f.name + f.size));

//     const newPendingFiles = validFiles
//       .filter((file) => !existingFileKeys.has(file.name + file.size))
//       .map((file) => ({
//         file,
//         name: file.name,
//         size: file.size,
//         id: Math.random().toString(36).substr(2, 9),
//       }));

//     if (newPendingFiles.length < validFiles.length) {
//       alert("Some files were already added and skipped.");
//     }

//     setPendingFiles((prev) => [...prev, ...newPendingFiles]);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };
//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   };
//   // const handleDrop = (e) => {
//   //   e.preventDefault();
//   //   handleFileUpload(e.dataTransfer.files);
//   // };
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     handleFileSelect(e.dataTransfer.files);
//   };

//   const Sidebar = () => {
//     return (
//       <div className="h-full bg-white border-r border-gray-200 flex flex-col">
//         <div className="p-6 border-b border-gray-100">
//           {/* <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">📤 Upload PDFs</h2> */}
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
//             <span className="flex items-center gap-2">📤 Upload PDFs</span>
//             <button
//               onClick={() => setIsSidebarOpen(false)} // Define this function based on what you want the close to do
//               className="text-gray-500 hover:text-gray-800"
//               aria-label="Close Upload Section"
//             >
//               ✖
//             </button>
//           </h2>
//           <div
//             className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
//               isDragOver
//                 ? "border-blue-400 bg-blue-50"
//                 : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//             }`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
//             <p className="text-sm text-gray-600">
//               Drag & drop PDFs here or click to browse
//             </p>
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               accept="application/pdf"
//               className="hidden"
//               // onChange={(e) => handleFileUpload(e.target.files)}
//               onChange={(e) => handleFileSelect(e.target.files)} // ✅ USE THIS
//             />
//           </div>
//           {pendingFiles.length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">
//                 📦 Pending Files
//               </h3>
//               <ul className="space-y-2">
//                 {pendingFiles.map((fileObj) => {
//                   const fileURL = URL.createObjectURL(fileObj.file);

//                   return (
//                     <li
//                       key={fileObj.id}
//                       className="flex items-center justify-between p-3 border rounded bg-yellow-50 text-gray-800 shadow-sm group"
//                     >
//                       <div className="flex items-center justify-between w-full gap-3">
//                         {/* Clickable file name */}
//                         <a
//                           href={fileURL}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex-1 text-sm text-blue-600 hover:underline truncate"
//                           title="Click to open in new tab"
//                         >
//                           {fileObj.name}
//                         </a>

//                         {/* File size */}
//                         <span className="text-xs text-gray-500">
//                           {(fileObj.size / (1024 * 1024)).toFixed(2)} MB
//                         </span>

//                         {/* Buttons */}
//                         <div className="flex gap-2 ml-2">
//                           <button
//                             className="p-2  rounded border border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
//                             onClick={() => handleSingleUpload(fileObj)}
//                             disabled={uploading}
//                             title="Upload this file"
//                           >
//                             <Upload className="w-4 h-4" />
//                           </button>
//                           <button
//                             className="p-2 rounded border border-red-200  text-red-600 hover:bg-red-50 hover:text-red-800 transition"
//                             onClick={() =>
//                               setPendingFiles((prev) =>
//                                 prev.filter((f) => f.id !== fileObj.id)
//                               )
//                             }
//                             title="Remove file"
//                           >
//                             <FileX className="w-4 h-4 text-red-600 group-hover:scale-200 transition-transform" />
//                           </button>
//                         </div>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           )}

//           {/* Submit Button */}
//           {/* <button
//             onClick={() => handleFileUpload(fileInputRef.current?.files)}
//             disabled={uploading || !fileInputRef.current?.files?.length}
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {uploading ? "Uploading..." : "📤 Submit Files"}
//           </button> */}
//           <button
//             onClick={handleUploadSubmit}
//             disabled={uploading || pendingFiles.length === 0}
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {uploading ? "Uploading..." : "📤 Submit All Files"}
//           </button>
//         </div>

//         <div className="p-6 border-b border-gray-100">
//           <h3 className="text-sm font-medium text-gray-700 mb-3">
//             📄 Select PDF
//           </h3>
//           <select
//             value={selectedFile}
//             onChange={(e) => setSelectedFile(e.target.value)}
//             className="w-full py-2 pl-4 pr-10  text-sm border border-gray-300 rounded-lg appearance-none bg-white text-gray-700"
//           >
//             <option value="">All uploaded files</option>
//             <hr className="my-1" />
//             {uploadedFiles.map((file) => (
//               <option key={file.id} value={file.name}>
//                 {file.name}
//               </option>
//             ))}
//           </select>
//           {/* Lucide ChevronDown icon */}
//           {/* <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
//             <ChevronDown className="w-4 h-4" />
//           </div> */}

//           {uploadedFiles.length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">
//                 📄 Uploaded Files Preview
//               </h3>
//               <ul className="space-y-1">
//                 {uploadedFiles.map((file) => (
//                   <li
//                     key={file.id}
//                     className="flex items-center justify-between p-2 border rounded bg-gray-50 text-gray-800 shadow-sm"
//                   >
//                     <span className="truncate">{file.name}</span>
//                     <span className="text-xs text-gray-500">
//                       {(file.size / (1024 * 1024)).toFixed(2)} MB
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const handleSendMessage = async () => {
//     if (!inputValue.trim()) return;

//     const userMessage = {
//       id: Math.random().toString(36).substr(2, 9),
//       type: "user",
//       content: inputValue,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setQuerying(true);
//         console.log("Sending query:", inputValue, "for books:", uploadedFiles);

//     try {
//       const res = await axios.post(`${API_BASE}/queryme/`, {
//         question: inputValue,
//        book_names: uploadedFiles.map(fileObj => fileObj.name)

//       });

//       const assistantMessage = {
//         id: Math.random().toString(36).substr(2, 9),
//         type: "assistant",
//         content: `Here are the results for your question: "${inputValue}"`,
//         timestamp: new Date(),
//         results: res.data.results, // store result in message
//       };

//       setMessages((prev) => [...prev, assistantMessage]);
//     } catch (err) {
//       alert("Query failed",err);
//     }

//     setQuerying(false);
//   };

//   const generateGraphNodes = (results) => {
//     if (!results) return [];

//     const verticalSpacing = 150;
//     const horizontalSpacing = 250;
//     const colorMap = generateBookColorMap(results);

//     const rootNode = {
//       id: "0",
//       data: { label: "📌 Query" },
//       position: { x: 300, y: 0 },
//       style: {
//         background: "#FFD700",
//         color: "#000",
//         fontWeight: "bold",
//         padding: 10,
//         borderRadius: 10,
//       },
//     };

//     const nodes = results.map((res, index) => ({
//       id: `${index + 1}`,
//       data: {
//         label: `${res.book}: "${res.text.slice(0, 50)}..."`,
//         fullText: res.text,
//       },
//       position: {
//         x: (index % 3) * horizontalSpacing + 100,
//         y: Math.floor(index / 3) * verticalSpacing + 100,
//       },
//       style: {
//         padding: 10,
//         border: "1px solid #ccc",
//         borderRadius: 10,
//         background: colorMap[res.book],
//         fontSize: 12,
//         cursor: "pointer",
//       },
//     }));

//     return [rootNode, ...nodes];
//   };

//   const generateGraphEdges = (results) => {
//     if (!results) return [];
//     return results.map((_, index) => ({
//       id: `e0-${index + 1}`,
//       source: "0",
//       target: `${index + 1}`,
//     }));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleNodeClick = (event, node) => {
//     if (node.data.fullText) {
//       setSelectedText(node.data.fullText);
//       setModalIsOpen(true);
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024,
//       sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return (
//       Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//     );
//   };

//   const nodes = results.map((res, index) => ({
//     id: `${index + 1}`,
//     data: {
//       label: `${res.book}: \"${res.text.slice(0, 50)}...\"`,
//       fullText: res.text,
//     },
//     position: {
//       x: (index % 3) * horizontalSpacing + 100,
//       y: Math.floor(index / 3) * verticalSpacing + 100,
//     },
//     style: {
//       padding: 10,
//       border: "1px solid #ccc",
//       borderRadius: 10,
//       background: bookColorMap[res.book],
//       fontSize: 12,
//       cursor: "pointer",
//     },
//   }));

//   const edges = results.map((res, index) => ({
//     id: `e0-${index + 1}`,
//     source: "0",
//     target: `${index + 1}`,
//   }));

//   const rootNode = {
//     id: "0",
//     data: { label: "📌 Query" },
//     position: { x: 300, y: 0 },
//     style: {
//       background: "#FFD700",
//       color: "#000",
//       fontWeight: "bold",
//       padding: 10,
//       borderRadius: 10,
//     },
//   };

//   const allNodes = [rootNode, ...nodes];

//   return (
//     <div className="h-screen bg-[#f0f2f5] flex overflow-hidden">
//       {/* Sidebar - toggleable width */}
//       <div
//         className={`transition-all duration-300 bg-white border-r border-gray-200
//       ${isSidebarOpen ? "w-80" : "w-0 overflow-hidden"}
//     `}
//       >
//         <Sidebar />
//       </div>

//       {/* Main Area */}
//       <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button
//               className="p-2 text-gray-700 focus:outline-none"
//               onClick={() => setIsSidebarOpen((prev) => !prev)}
//             >
//               <Menu className="h-6 w-6" />
//             </button>

//             <h1 className="text-xl font-bold text-gray-800">
//               📚 PDF Intelligence Assistant
//             </h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               className={`p-2 flex items-center gap-2 rounded transition text-black border border-gray-300 hover:bg-gray-100`}

//               // className={`p-2 flex items-center gap-2 rounded transition text-black ${theme}`}
//               onClick={() => router.push("/")}
//             >
//               <ScanText className="h-6 w-6" />
//               <span>Talk with all PDF</span>
//             </button>
//             <button
//               className="p-2 text-gray-700 focus:outline-none border border-gray-300"
//               onClick={() => setIsSidebarOpen((prev) => !prev)}
//             >
//               <User className="h-6 w-6" />
//             </button>
//             {/* <button
//               className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition border border-gray-300"
//               onClick={cycleThemes}
//               title="Change Theme"
//             >
//               <SunMoon className="h-5 w-5 text-gray-800" />
//             </button> */}
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${
//                 message.type === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[90%] w-fit p-4 rounded-2xl shadow-sm ${
//                   message.type === "user"
//                     ? "bg-blue-500 text-white"
//                     : "bg-white text-gray-800 border"
//                 }`}
//               >
//                 <p className="text-sm leading-relaxed">{message.content}</p>
//                 {/* <p className="text-xs mt-2 text-gray-500">
//                   {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </p> */}

//                 {/* If assistant and has results */}
//                 {/* {message.type === "assistant" && message.results && (
//                   <div className="mt-4 space-y-2">
//                     {message.results.map((res, idx) => ( */}
//                 {message.type === "assistant" &&
//                   Array.isArray(message.results) && (
//                     <div className="mt-4 space-y-2">
//                       {message.results.length === 0 ? (
//                         <p>No summarized responses were generated.</p>
//                       ) : (
//                         message.results.map((res, idx) => (
//                           <div
//                             key={idx}
//                             className="p-2 border rounded bg-gray-100 text-sm"
//                           >
//                             <p>
//                               <strong>📘 Book:</strong> {res.book}
//                             </p>
//                             <p>
//                               <strong>🧠 Score:</strong> {res.score.toFixed(3)}
//                             </p>
//                             {/* <p><strong>📄 Text:</strong> {res.text.slice(0, 300)}{res.text.length > 300 ? "..." : ""}</p> */}
//                             <p>
//                               <strong>📄 Text:</strong> {res.text}
//                             </p>
//                           </div>
//                         ))
//                       )}
//                       {/* 👇 ADD THIS BUTTON BELOW THE TEXT RESPONSES */}
//                       <button
//                         onClick={() => {
//                           setGraphData(message.results);
//                           setGraphModalOpen(true);
//                         }}
//                         className="mt-2 px-4 py-2 bg-indigo-500 text-black rounded hover:bg-indigo-600"
//                       >
//                         📊 View Graph
//                       </button>
//                     </div>
//                   )}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//         <div className="border-t border-gray-200 bg-white px-4 py-3">
//           <div className="flex items-center gap-4">
//             <textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask your question here..."
//               className="flex-1 p-3 border border-gray-300 rounded-lg resize-none"
//               rows={1}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={!inputValue.trim()}
//               className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
//             >
//               <Send className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//         {results.length > 0 && (
//           <div className="p-6">
//             <h2 className="text-lg font-semibold mb-2">🔍 Results</h2>
//             {results.map((res, index) => (
//               <div
//                 key={index}
//                 className="p-2 border rounded bg-white shadow mb-2"
//               >
//                 <p>
//                   <strong>📘 Book:</strong> {res.book}
//                 </p>
//                 <p>
//                   <strong>🧠 Score:</strong> {res.score.toFixed(3)}
//                 </p>
//                 <p>
//                   <strong>📄 Text:</strong> {res.text.slice(0, 300)}
//                   {res.text.length > 300 ? "..." : ""}
//                 </p>
//               </div>
//             ))}
//             <div style={{ width: "100%", height: "600px" }}>
//               <ReactFlow
//                 nodes={allNodes}
//                 edges={edges}
//                 fitView
//                 onNodeClick={handleNodeClick}
//               >
//                 <Background />
//                 <Controls />
//               </ReactFlow>
//             </div>
//           </div>
//         )}
//         <Modal
//           isOpen={graphModalOpen}
//           onRequestClose={() => setGraphModalOpen(false)}
//           contentLabel="Graph View"
//           ariaHideApp={false} 
//           style={{
//             content: {
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               width: "90%",
//               maxWidth: "1000px",
//               height: "80%",
//               padding: "20px",
//             },
//           }}
//         >
//           <h2 className="text-lg font-semibold mb-4">📈 Graph Visualization</h2>
//           <div style={{ width: "100%", height: "100%" }}>
//             <ReactFlow
//               nodes={generateGraphNodes(graphData)}
//               edges={generateGraphEdges(graphData)}
//               fitView
//               onNodeClick={handleNodeClick}
//             >
//               <Background />
//               <Controls />
//             </ReactFlow>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={() => setGraphModalOpen(false)}
//               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               Close
//             </button>
//           </div>
//         </Modal>
//         <Modal
//           isOpen={modalIsOpen}
//           onRequestClose={() => setModalIsOpen(false)}
//           contentLabel="Full Snippet"
//           ariaHideApp={false} 
//           style={{
//             content: {
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               maxWidth: "600px",
//               padding: "20px",
//             },
//           }}
//         >
//           <h2>📘 Full Snippet</h2>
//           <p>{selectedText}</p>
//           <button onClick={() => setModalIsOpen(false)}>Close</button>
//         </Modal>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Send, Menu, FileX, User, ScanText, File } from "lucide-react";
import axios from "axios";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import Modal from "react-modal";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const BOOK_COLORS = [
  { bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF" },
  { bg: "#F0FDF4", border: "#BBF7D0", text: "#166534" },
  { bg: "#FFF7ED", border: "#FED7AA", text: "#9A3412" },
  { bg: "#FDF4FF", border: "#E9D5FF", text: "#6B21A8" },
  { bg: "#FEFCE8", border: "#FEF08A", text: "#854D0E" },
];

const generateBookColorMap = (results) => {
  const uniqueBooks = [...new Set(results.map((r) => r.book))];
  const map = {};
  uniqueBooks.forEach((book, i) => {
    map[book] = BOOK_COLORS[i % BOOK_COLORS.length];
  });
  return map;
};

export default function PDFChatAssistant() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedTitles, setUploadedTitles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [querying, setQuerying] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [graphModalOpen, setGraphModalOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);

  const router = useRouter();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter((f) => f.type === "application/pdf");
    const existingKeys = new Set(pendingFiles.map((f) => f.name + f.size));
    const newFiles = validFiles
      .filter((f) => !existingKeys.has(f.name + f.size))
      .map((f) => ({ file: f, name: f.name, size: f.size, id: Math.random().toString(36).substr(2, 9) }));
    if (newFiles.length < validFiles.length) alert("Some files were already added.");
    setPendingFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSingleUpload = async (fileObj) => {
    const formData = new FormData();
    formData.append("files", fileObj.file);
    setUploading(true);
    try {
      const res = await axios.post(`${API_BASE}/upload/`, formData);
      setUploadedFiles((prev) => [...prev, fileObj]);
      setUploadedTitles((prev) => [...prev, ...(res.data.uploaded_titles || [])]);
      setPendingFiles((prev) => prev.filter((f) => f.id !== fileObj.id));
    } catch {
      alert(`Error uploading "${fileObj.name}".`);
    }
    setUploading(false);
  };

  const handleUploadSubmit = async () => {
    if (pendingFiles.length === 0) return;
    const formData = new FormData();
    pendingFiles.forEach((e) => formData.append("files", e.file));
    setUploading(true);
    try {
      const res = await axios.post(`${API_BASE}/upload/`, formData);
      setUploadedTitles(res.data.uploaded_titles || []);
      setUploadedFiles((prev) => [...prev, ...pendingFiles]);
      setPendingFiles([]);
    } catch {
      alert("Error uploading PDFs.");
    }
    setUploading(false);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragOver(false); handleFileSelect(e.dataTransfer.files); };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = { id: Math.random().toString(36).substr(2, 9), type: "user", content: inputValue, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setQuerying(true);
    try {
      const res = await axios.post(`${API_BASE}/query/`, { question: inputValue });
      const assistantMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: "assistant",
        content: `Results for: "${userMessage.content}"`,
        timestamp: new Date(),
        results: res.data.results,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      alert("Query failed");
    }
    setQuerying(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const generateGraphNodes = (results) => {
    const colorMap = generateBookColorMap(results);
    const root = {
      id: "0", data: { label: "Query" },
      position: { x: 300, y: 0 },
      style: { background: "#1E40AF", color: "#fff", fontWeight: 600, padding: 10, borderRadius: 8, border: "none" },
    };
    const nodes = results.map((res, i) => ({
      id: `${i + 1}`,
      data: { label: `${res.book}: "${res.text.slice(0, 45)}..."`, fullText: res.text },
      position: { x: (i % 3) * 260 + 60, y: Math.floor(i / 3) * 150 + 120 },
      style: {
        padding: 10, border: `1px solid ${colorMap[res.book]?.border || "#e5e7eb"}`,
        borderRadius: 8, background: colorMap[res.book]?.bg || "#f9fafb",
        fontSize: 11, cursor: "pointer", color: colorMap[res.book]?.text || "#111",
      },
    }));
    return [root, ...nodes];
  };

  const generateGraphEdges = (results) =>
    results.map((_, i) => ({ id: `e0-${i + 1}`, source: "0", target: `${i + 1}`, style: { stroke: "#94a3b8" } }));

  const handleNodeClick = (_, node) => {
    if (node.data.fullText) { setSelectedText(node.data.fullText); setModalIsOpen(true); }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: isSidebarOpen ? 272 : 0,
        minWidth: isSidebarOpen ? 272 : 0,
        overflow: "hidden",
        transition: "width 0.25s ease, min-width 0.25s ease",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Drop zone */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            Upload PDFs
          </p>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `1.5px dashed ${isDragOver ? "#3b82f6" : "#cbd5e1"}`,
              borderRadius: 10,
              padding: "20px 12px",
              textAlign: "center",
              cursor: "pointer",
              background: isDragOver ? "#eff6ff" : "#f8fafc",
              transition: "all 0.15s",
            }}
          >
            <Upload size={20} color={isDragOver ? "#3b82f6" : "#94a3b8"} style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>Drag & drop PDFs<br />or click to browse</p>
            <input ref={fileInputRef} type="file" multiple accept="application/pdf" style={{ display: "none" }} onChange={(e) => handleFileSelect(e.target.files)} />
          </div>
        </div>

        {/* Pending files */}
        {pendingFiles.length > 0 && (
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
              Pending · {pendingFiles.length}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pendingFiles.map((f) => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8 }}>
                  <File size={14} color="#d97706" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: "#92400e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: "#b45309", flexShrink: 0 }}>{formatSize(f.size)}</span>
                  <button onClick={() => handleSingleUpload(f)} disabled={uploading} title="Upload this file"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", color: "#2563eb" }}>
                    <Upload size={13} />
                  </button>
                  <button onClick={() => setPendingFiles((prev) => prev.filter((x) => x.id !== f.id))} title="Remove"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", color: "#dc2626" }}>
                    <FileX size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleUploadSubmit} disabled={uploading}
              style={{
                marginTop: 10, width: "100%", padding: "8px 0", borderRadius: 8,
                background: uploading ? "#e2e8f0" : "#2563eb", color: uploading ? "#94a3b8" : "#fff",
                border: "none", fontSize: 12, fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
              <Upload size={13} /> {uploading ? "Uploading..." : "Submit all files"}
            </button>
          </div>
        )}

        {/* Uploaded files */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {uploadedFiles.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                Uploaded · {uploadedFiles.length}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                {uploadedFiles.map((f) => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8 }}>
                    <File size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, color: "#14532d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                    <span style={{ fontSize: 11, color: "#15803d", flexShrink: 0 }}>{formatSize(f.size)}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Filter by file</p>
              <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)}
                style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#374151", outline: "none" }}>
                <option value="">All uploaded files</option>
                {uploadedFiles.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
              </select>
            </>
          )}
          {uploadedFiles.length === 0 && pendingFiles.length === 0 && (
            <p style={{ fontSize: 12, color: "#cbd5e1", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
              No files yet.<br />Upload a PDF to get started.
            </p>
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ height: 56, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0 }}>
          <button onClick={() => setIsSidebarOpen((p) => !p)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", color: "#64748b" }}>
            <Menu size={20} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", flex: 1 }}>PDF Intelligence Assistant</span>
          <button onClick={() => router.push("/Myfiles")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 20, fontSize: 13, color: "#374151", background: "#fff", cursor: "pointer", fontWeight: 500 }}>
            <ScanText size={15} /> Talk with my PDF
          </button>
          <button style={{ background: "none", border: "1px solid #e2e8f0", cursor: "pointer", padding: 7, borderRadius: 8, display: "flex", color: "#64748b" }}>
            <User size={18} />
          </button>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 0" }}>
          {messages.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, paddingBottom: 60 }}>
              <div style={{ width: 48, height: 48, background: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ScanText size={24} color="#2563eb" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>Ask anything about your PDFs</p>
              <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
                Upload documents from the sidebar, then type your question below.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 24 }}>
              {messages.map((msg) => {
                const bookColorMap = generateBookColorMap(msg.results || []);
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.type === "user" ? "flex-end" : "flex-start", gap: 10 }}>
                    {msg.type === "assistant" && (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <ScanText size={14} color="#2563eb" />
                      </div>
                    )}
                    <div style={{ maxWidth: "78%" }}>
                      <div style={{
                        padding: "10px 14px",
                        borderRadius: msg.type === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: msg.type === "user" ? "#2563eb" : "#ffffff",
                        border: msg.type === "assistant" ? "1px solid #e2e8f0" : "none",
                        color: msg.type === "user" ? "#fff" : "#1e293b",
                        fontSize: 13,
                        lineHeight: 1.55,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      }}>
                        {msg.content}
                      </div>

                      {/* Result cards */}
                      {msg.type === "assistant" && Array.isArray(msg.results) && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                          {msg.results.length === 0 ? (
                            <p style={{ fontSize: 12, color: "#94a3b8" }}>No results found.</p>
                          ) : (
                            msg.results.map((res, idx) => {
                              const c = bookColorMap[res.book] || BOOK_COLORS[0];
                              return (
                                <div key={idx} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                                      {res.book}
                                    </span>
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Score: {res.score.toFixed(3)}</span>
                                  </div>
                                  <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{res.text}</p>
                                </div>
                              );
                            })
                          )}
                          {msg.results.length > 0 && (
                            <button onClick={() => { setGraphData(msg.results); setGraphModalOpen(true); }}
                              style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 20, fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer", fontWeight: 500 }}>
                              📊 View knowledge graph
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {msg.type === "user" && (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <User size={14} color="#fff" />
                      </div>
                    )}
                  </div>
                );
              })}
              {querying && (
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ScanText size={14} color="#2563eb" />
                  </div>
                  <div style={{ padding: "12px 16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "18px 18px 18px 4px", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 0.15, 0.3].map((d, i) => (
                      <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#cbd5e1", display: "inline-block", animation: `pulse 1.2s ${d}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div style={{ padding: "16px 24px 20px", background: "#fff", borderTop: "1px solid #f1f5f9", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "10px 12px 10px 16px", transition: "border-color 0.15s" }}>
            <textarea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your documents..."
              rows={1}
              style={{ flex: 1, border: "none", outline: "none", resize: "none", fontSize: 13, background: "transparent", color: "#1e293b", fontFamily: "inherit", lineHeight: 1.6, maxHeight: 120 }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || querying}
              style={{
                padding: "8px 16px", borderRadius: 10, border: "none",
                background: inputValue.trim() && !querying ? "#2563eb" : "#e2e8f0",
                color: inputValue.trim() && !querying ? "#fff" : "#94a3b8",
                cursor: inputValue.trim() && !querying ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, flexShrink: 0, transition: "all 0.15s",
              }}>
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      </div>

      {/* ── Graph Modal ── */}
      <Modal isOpen={graphModalOpen} onRequestClose={() => setGraphModalOpen(false)} contentLabel="Knowledge Graph"
        style={{
          overlay: { background: "rgba(15,23,42,0.5)", zIndex: 1000 },
          content: { top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "90%", maxWidth: 1000, height: "80%", padding: 0, borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" },
        }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Knowledge Graph</p>
            <button onClick={() => setGraphModalOpen(false)}
              style={{ padding: "5px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, background: "#fff", cursor: "pointer", color: "#374151", fontWeight: 500 }}>
              Close
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <ReactFlow nodes={generateGraphNodes(graphData)} edges={generateGraphEdges(graphData)} fitView onNodeClick={handleNodeClick}>
              <Background color="#f1f5f9" gap={20} />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </Modal>

      {/* ── Snippet Modal ── */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Full Snippet"
        style={{
          overlay: { background: "rgba(15,23,42,0.5)", zIndex: 1000 },
          content: { top: "50%", left: "50%", transform: "translate(-50%,-50%)", maxWidth: 560, width: "90%", padding: 0, borderRadius: 14, border: "1px solid #e2e8f0" },
        }}>
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 12 }}>Full snippet</p>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{selectedText}</p>
          <button onClick={() => setModalIsOpen(false)}
            style={{ marginTop: 20, padding: "7px 18px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#fff", cursor: "pointer", fontWeight: 500, color: "#374151" }}>
            Close
          </button>
        </div>
      </Modal>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        textarea::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}