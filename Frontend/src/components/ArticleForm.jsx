import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ArticleForm = ({ isOpen, onClose, fetchArticles, currentArticle, setCurrentArticle }) => {
 const [formData, setFormData] = useState({ title: '', author: '', date: '', link: '' });


 useEffect(() => {
   if (currentArticle) setFormData(currentArticle);
   else setFormData({ title: '', author: '', date: '', link: '' });
 }, [currentArticle]);


 if (!isOpen) return null;


 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     if (currentArticle) {
       await axios.put(`https://intershalla-2.onrender.com/api/articlesupdate/${currentArticle._id}`, formData);
     } else {
       await axios.post('https://intershalla-3.onrender.com/api/articlespost', formData);
     }
     onClose();
     fetchArticles();
   } catch (err) { console.error(err); }
 };


 return (
   <div className="modal-overlay">
     <div className="modal-content">
       <h2 style={{ color: 'var(--neon-pink)', textTransform: 'uppercase' }}>
         {currentArticle ? 'Update Protocol' : 'New Article Protocol'}
       </h2>
       <form onSubmit={handleSubmit} className="cyber-form">
         <input
           className="cyber-input"
           placeholder="ARTICLE_TITLE"
           value={formData.title}
           onChange={(e) => setFormData({...formData, title: e.target.value})}
         />
         <input
           className="cyber-input"
           placeholder="AUTHOR_NAME"
           value={formData.author}
           onChange={(e) => setFormData({...formData, author: e.target.value})}
         />
         <input
           className="cyber-input"
           placeholder="Date_Published"
           value={formData.date}
           onChange={(e) => setFormData({...formData, date: e.target.value})}
         />
         <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
           <button type="submit" className="btn-initiate">Transmit</button>
           <button type="button" onClick={onClose} className="btn-initiate" style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>Abort</button>
         </div>
       </form>
     </div>
   </div>
 );
};


export default ArticleForm;