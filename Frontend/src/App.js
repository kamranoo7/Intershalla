import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleForm from './components/ArticleForm';
import ArticleList from './components/ArticleList'; // Assuming your Phase 3 UI is in this component
import './App.css';


function App() {
 const [articles, setArticles] = useState([]);
 const [isModalOpen, setModalOpen] = useState(false);
 const [currentArticle, setCurrentArticle] = useState(null);
 const [viewArticle, setViewArticle] = useState(null);
  // NEW: State to toggle between assignments
 const [activeAssignment, setActiveAssignment] = useState('moderate');


 const fetchArticles = async () => {
   try {
     const res = await axios.get('https://intershalla-3.onrender.com/api/articles');
     setArticles(res.data);
   } catch (err) {
     console.error("Error fetching data:", err);
   }
 };


 useEffect(() => { fetchArticles(); }, []);


 const openEditModal = (article) => {
   setCurrentArticle(article);
   setModalOpen(true);
 };


 const deleteArticle = async (id) => {
   await axios.delete(`https://intershalla-3.onrender.com/api/articlesdelete/${id}`);
   fetchArticles();
 };


 return (
   <div className="App">
     {/* --- Assignment Toggle Navigation --- */}
     <nav className="assignment-nav">
       <button
         className={activeAssignment === 'moderate' ? 'nav-btn active' : 'nav-btn'}
         onClick={() => setActiveAssignment('moderate')}
       >
         Phase 1: Moderate
       </button>
       <button
         className={activeAssignment === 'easy' ? 'nav-btn active' : 'nav-btn'}
         onClick={() => setActiveAssignment('easy')}
       >
         Phase 3: Easy
       </button>
     </nav>


     <header style={{ padding: '20px', textAlign: 'center' }}>
       <h1 className="glitch-text">BEYONDCHATS_OS v1.0</h1>
     </header>


     {/* --- MODERATE ASSIGNMENT VIEW (Phase 1 CRUD) --- */}
     {activeAssignment === 'moderate' && (
       <div className="article-container">
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
           <h2 style={{ color: 'var(--neon-cyan)' }}>Moderate: CRUD Control Panel</h2>
           <button className="btn-initiate" onClick={() => { setCurrentArticle(null); setModalOpen(true); }}>
             Initiate New Article Protocol
           </button>
         </div>
         <table className="cyber-table">
           <thead>
             <tr>
               <th>Title</th>
               <th>Author</th>
               <th>Date</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody>
             {articles.map((art) => (
               <tr key={art._id}>
                 <td onClick={() => setViewArticle(art)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                   {art.title}
                 </td>
                 <td style={{ color: 'var(--neon-cyan)' }}>{art.author}</td>
                 <td>{art.date}</td>
                 <td>
                   <button onClick={() => openEditModal(art)} className="edit-btn">Edit</button>
                   <button onClick={() => deleteArticle(art._id)} className="delete-btn">Delete</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )}


     {/* --- EASY ASSIGNMENT VIEW (Phase 3 Professional UI) --- */}
     {activeAssignment === 'easy' && (
       <div className="article-container">
         <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '20px' }}>Easy: Professional Blog UI</h2>
         <div className="easy-grid">
           {articles.map((art) => (
             <div key={art._id} className="easy-card">
               <h3>{art.title}</h3>
               <p>By {art.author} on {art.date}</p>
               <div className="card-actions">
                 {art.content ? (
                   <button className="read-btn" onClick={() => setViewArticle(art)}>Read AI Enhanced</button>
                 ) : (
                   /* Redirect logic for articles without AI content */
                   <a href={art.link} target="_blank" rel="noreferrer" className="redirect-link">
                     View Original Blog ↗
                   </a>
                 )}
               </div>
             </div>
           ))}
         </div>
       </div>
     )}


     {/* --- COMMON COMPONENTS --- */}
     <ArticleForm
       isOpen={isModalOpen}
       onClose={() => setModalOpen(false)}
       fetchArticles={fetchArticles}
       currentArticle={currentArticle}
     />


     {viewArticle && (
       <div className="modal-overlay" onClick={() => setViewArticle(null)}>
         <div className="modal-content read-view" onClick={(e) => e.stopPropagation()}>
           <header className="modal-header">
             <h2 style={{ color: 'var(--neon-cyan)' }}>{viewArticle.title}</h2>
             <button className="close-btn" onClick={() => setViewArticle(null)}>&times;</button>
           </header>
           <div className="modal-body">
             {viewArticle.content ? (
               /* Renders the AI formatting and Google Citations */
               <div dangerouslySetInnerHTML={{ __html: viewArticle.content }} />
             ) : (
               <div style={{ textAlign: 'center' }}>
                 <p>No AI content found for this entry.</p>
                 <a href={viewArticle.link} target="_blank" rel="noreferrer" className="btn-initiate">
                   Visit Original Website
                 </a>
               </div>
             )}
           </div>
         </div>
       </div>
     )}
   </div>
 );
}


export default App;