import React, { useEffect, useState } from 'react';

export default function Review() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser')); } catch (e) { return null; }
  })();

  const fetchComments = async () => {
    try {
      const res = await fetch('http://localhost:2824/api/comments');
      const data = await res.json();
      setComments(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchComments(); }, []);

  const handlePost = async () => {
    if (!currentUser) return alert('Please login to post');
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:2824/api/comments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: currentUser.id || currentUser._id, authorName: currentUser.name, text })
      });
      if (!res.ok) throw new Error('Failed to post');
      setText('');
      await fetchComments();
    } catch (e) { console.error(e); alert('Error posting comment'); }
    setLoading(false);
  };

  const startEdit = (c) => { setEditingId(c._id); setText(c.text); };
  const submitEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`http://localhost:2824/api/comments/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Edit failed');
      setEditingId(null); setText(''); await fetchComments();
    } catch (e) { console.error(e); alert('Error editing'); }
  };

  const deleteComment = async (id) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await fetch(`http://localhost:2824/api/comments/${id}`, { method: 'DELETE' });
      await fetchComments();
    } catch (e) { console.error(e); }
  };

  const toggleLike = async (id) => {
    if (!currentUser) return alert('Please login to like');
    try {
      await fetch(`http://localhost:2824/api/comments/${id}/like`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: currentUser.id || currentUser._id }) });
      await fetchComments();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="review-page">
      <h2>Site Reviews</h2>
      <div className="new-comment">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={currentUser ? 'Share your thoughts...' : 'Login to leave a comment'} />
        <div>
          {editingId ? (
            <>
              <button onClick={submitEdit}>Save</button>
              <button onClick={() => { setEditingId(null); setText(''); }}>Cancel</button>
            </>
          ) : (
            <button onClick={handlePost} disabled={loading || !currentUser}>{loading ? 'Posting...' : 'Post'}</button>
          )}
        </div>
      </div>

      <ul className="comments-list">
        {comments.map(c => (
          <li key={c._id} className="comment">
            <div className="meta"><strong>{c.authorName}</strong> · <small>{new Date(c.createdAt).toLocaleString()}</small></div>
            <div className="body">{c.text}</div>
            <div className="actions">
              <button onClick={() => toggleLike(c._id)}>{c.likes && c.likes.includes(currentUser && (currentUser.id || currentUser._id)) ? 'Unlike' : 'Like'} ({(c.likes || []).length})</button>
              {currentUser && (currentUser.id === c.authorId || currentUser._id === c.authorId) && (
                <>
                  <button onClick={() => startEdit(c)}>Edit</button>
                  <button onClick={() => deleteComment(c._id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
