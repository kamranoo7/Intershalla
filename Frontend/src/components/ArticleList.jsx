import React, { useEffect, useState } from 'react';
import axios from 'axios';


const ArticleList = () => {
 const [articles, setArticles] = useState([]);
 const [selectedArt, setSelectedArt] = useState(null); // For comparing versions


 const fetchArticles = async () => {
   const res = await axios.get('https://intershalla-3.onrender.com/api/articles');
   console.log(res.data,"data is here")
   setArticles(res.data);
 };


 useEffect(() => { fetchArticles(); }, []);


 return (
   <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '20px' }}>
     <h1 style={{ textAlign: 'center', color: '#38bdf8' }}>BeyondChats Article Manager</h1>
    
     {/* Table View */}
     <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
       <thead>
         <tr style={{ backgroundColor: '#1e293b' }}>
           <th style={padding}>Title</th>
           <th style={padding}>Status</th>
           <th style={padding}>Actions</th>
         </tr>
       </thead>
       <tbody>
         {articles.map(art => (
           <tr key={art._id} style={{ borderBottom: '1px solid #334155' }}>
             <td style={padding}>{art.title}</td>
             <td style={padding}>
               <span style={{ color: art.status ? '#4ad395' : '#94a3b8' }}>
                 {art.status || 'Original'}
               </span>
             </td>
             <td style={padding}>
               <button onClick={() => setSelectedArt(art)} style={btnStyle}>Compare Versions</button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>


     {/* Comparison Modal (Phase 3 Requirement) */}
     {selectedArt && (
       <div style={modalOverlay}>
         <div style={modalBox}>
           <button onClick={() => setSelectedArt(null)} style={{ float: 'right' }}>Close</button>
           <h2 style={{ color: '#38bdf8' }}>Comparison: {selectedArt.title}</h2>
          
           <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
             {/* Original Article Info */}
             <div style={{ flex: 1, padding: '15px', background: '#1e293b', borderRadius: '8px' }}>
               <h3>Original Source</h3>
               <p><strong>Author:</strong> {selectedArt.author}</p>
               <p><strong>Date:</strong> {selectedArt.date}</p>
               <a href={selectedArt.link} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>View Original Source</a>
             </div>


             {/* AI Updated Version (Phase 2 Output) */}
             <div style={{ flex: 2, padding: '15px', background: '#1e293b', borderRadius: '8px' }}>
               <h3>AI Updated Version</h3>
               {selectedArt.content ? (
                 /* This renders the formatting and citations at the bottom */
                 <div dangerouslySetInnerHTML={{ __html: selectedArt.content }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }} />
               ) : (
                 <p style={{ color: '#ef4444' }}>Article not yet processed by Phase 2 script.</p>
               )}
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};


// Simple Inline Styles
const padding = { padding: '12px' };
const btnStyle = { backgroundColor: '#38bdf8', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalBox = { background: '#0f172a', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '30px', borderRadius: '12px', border: '1px solid #38bdf8' };


export default ArticleList;