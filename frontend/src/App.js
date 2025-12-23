// import React, { useState, useEffect } from 'react';
// import './BlogApp.css';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import UsersPage from './UserPage';



// const API_URL = 'http://localhost:8000/api';

// export default function BlogApp() {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [showLogin, setShowLogin] = useState(true);
//   const [posts, setPosts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isCreating, setIsCreating] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [expandedId, setExpandedId] = useState(null);
//   const [showUsers, setShowUsers] = useState(false);
//   const [formData, setFormData] = useState({ title: '', content: '' });
//   const [authData, setAuthData] = useState({ username: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

// const goToUsersPage = () => {
//   navigate('/users');
// };


//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     if (savedToken) {
//       setToken(savedToken);
//       fetchCurrentUser(savedToken);
//     }
//   }, []);

//   useEffect(() => {
//     if (token) {
//       fetchPosts();
//     }
//   }, [token]);

//   const fetchCurrentUser = async (authToken) => {
//     try {
//       const response = await fetch(`${API_URL}/users/me`, {
//         headers: { 'Authorization': `Bearer ${authToken}` }
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setUser(data);
//       } else {
//         handleLogout();
//       }
//     } catch (err) {
//       handleLogout();
//     }
//   };

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/posts?search=${searchTerm}`);
//       if (response.ok) {
//         const data = await response.json();
//         setPosts(data);
//         setError('');
//       }
//     } catch (err) {
//       setError('Failed to load posts. Make sure backend is running on port 8000.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`${API_URL}/admin/users`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setUsers(data);
//       }
//     } catch (err) {
//       setError('Failed to load users');
//     }
//   };

//   const handleRegister = async () => {
//     if (!authData.username || !authData.email || !authData.password) {
//       setError('All fields are required');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(authData),
//       });
//       if (response.ok) {
//         setShowLogin(true);
//         setError('');
//         alert('Registration successful! Please login.');
//         setAuthData({ username: '', email: '', password: '' });
//       } else {
//         const data = await response.json();
//         setError(data.detail || 'Registration failed');
//       }
//     } catch (err) {
//       setError('Registration failed. Check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     if (!authData.username || !authData.password) {
//       setError('Username and password are required');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: authData.username, password: authData.password }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('token', data.access_token);
//         setToken(data.access_token);
//         setError('');
//         await fetchCurrentUser(data.access_token);
//       } else {
//         setError('Invalid username or password');
//       }
//     } catch (err) {
//       setError('Login failed. Make sure backend is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     setPosts([]);
//     setAuthData({ username: '', email: '', password: '' });
//   };

//   const handleCreatePost = async () => {
//     if (!formData.title || !formData.content) {
//       setError('Title and content are required');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/posts`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData),
//       });
//       if (response.ok) {
//         await fetchPosts();
//         setFormData({ title: '', content: '' });
//         setIsCreating(false);
//         setError('');
//       } else {
//         const data = await response.json();
//         setError(data.detail || 'Failed to create post');
//       }
//     } catch (err) {
//       setError('Failed to create post');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdatePost = async (id) => {
//     if (!formData.title || !formData.content) {
//       setError('Title and content are required');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/posts/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData),
//       });
//       if (response.ok) {
//         await fetchPosts();
//         setEditingId(null);
//         setFormData({ title: '', content: '' });
//         setError('');
//       } else {
//         const data = await response.json();
//         setError(data.detail || 'Failed to update post');
//       }
//     } catch (err) {
//       setError('Failed to update post');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeletePost = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this post?')) return;
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/posts/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.ok) {
//         await fetchPosts();
//         setError('');
//       } else {
//         const data = await response.json();
//         setError(data.detail || 'Failed to delete post');
//       }
//     } catch (err) {
//       setError('Failed to delete post');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEdit = (post) => {
//     setEditingId(post.id);
//     setFormData({ title: post.title, content: post.content });
//     setIsCreating(false);
//     setExpandedId(null);
//   };

//   const toggleUsersView = () => {
//     if (!showUsers) {
//       fetchUsers();
//     }
//     setShowUsers(!showUsers);
//   };

//   if (!token) {
//     return (
//       <div className="animated-bg">
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
//           <div className="auth-card" style={{ maxWidth: '500px', width: '100%' }}>
//             <div className="auth-icon">
//               <span style={{ fontSize: '36px' }}>📚</span>
//             </div>
//             <h1 className="auth-title">{showLogin ? 'Welcome Back' : 'Join Us'}</h1>
//             <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '16px' }}>
//               {showLogin ? 'Login to your account' : 'Create your free account'}
//             </p>
            
//             {error && (
//               <div className="alert alert-error">
//                 <span>{error}</span>
//                 <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button>
//               </div>
//             )}

//             <div style={{ marginBottom: '20px' }}>
//               <div className="input-group">
//                 <input
//                   type="text"
//                   placeholder="Username"
//                   value={authData.username}
//                   onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
//                   onKeyPress={(e) => e.key === 'Enter' && (showLogin ? handleLogin() : handleRegister())}
//                   className="form-input"
//                 />
//                 <span className="input-icon">👤</span>
//               </div>
//             </div>

//             {!showLogin && (
//               <div style={{ marginBottom: '20px' }}>
//                 <div className="input-group">
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     value={authData.email}
//                     onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
//                     className="form-input"
//                   />
//                   <span className="input-icon">✉️</span>
//                 </div>
//               </div>
//             )}

//             <div style={{ marginBottom: '25px' }}>
//               <div className="input-group">
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={authData.password}
//                   onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
//                   onKeyPress={(e) => e.key === 'Enter' && (showLogin ? handleLogin() : handleRegister())}
//                   className="form-input"
//                 />
//                 <span className="input-icon">🔒</span>
//               </div>
//             </div>

//             <button
//               onClick={showLogin ? handleLogin : handleRegister}
//               disabled={loading}
//               className="gradient-button"
//             >
//               {loading ? '⏳ Please wait...' : (showLogin ? '🚀 Login' : '✨ Create Account')}
//             </button>

//             <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
//               {showLogin ? "Don't have an account? " : 'Already have an account? '}
//               <button
//                 onClick={() => {
//                   setShowLogin(!showLogin);
//                   setError('');
//                   setAuthData({ username: '', email: '', password: '' });
//                 }}
//                 style={{ background: 'none', border: 'none', color: '#667eea', fontWeight: '700', cursor: 'pointer', fontSize: '16px' }}
//               >
//                 {showLogin ? 'Register' : 'Login'}
//               </button>
//             </p>

//             <div style={{ marginTop: '30px', padding: '20px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 20%)', borderRadius: '15px', color: 'white' }}>
//               <p style={{ fontWeight: '700', marginBottom: '10px', fontSize: '14px' }}>🎯 Test Credentials:</p>
//               <p style={{ fontSize: '13px', marginBottom: '5px' }}><strong>Admin:</strong> admin / admin123</p>
//               <p style={{ fontSize: '13px' }}><strong>User:</strong> user / user123</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Routes>
//     {/* BLOG PAGE */}
//     <Route
//       path="/"
//       element={
//     <div className="main-container">
//       <div className="navbar">
//         <div className="navbar-content">
//           <div className="logo-section">
//             <div className="logo-icon">📚</div>
//             <div>
//               <div className="logo-text">BlogSphere</div>
//               <p style={{ fontSize: '12px', color: '#999' }}>Share your thoughts</p>
//             </div>
//           </div>
//           <div className="user-section">
//             <div className="user-badge">
//               <div className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
//               <div>
//                 <div style={{ fontWeight: '700' }}>{user?.username}</div>
//                 {user?.is_admin && <div style={{ fontSize: '11px', opacity: 0.9 }}>⭐ Administrator</div>}
//               </div>
//             </div>
//             <button onClick={handleLogout} className="logout-button">
//               🚪 Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       <div style={{ padding: '20px' }}>
//         <div className="search-card">
//           <div className="search-bar-container">
//             <input
//               type="text"
//               placeholder="🔍 Search amazing blogs..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && fetchPosts()}
//               className="search-input"
//             />
//             <button onClick={fetchPosts} disabled={loading} className="search-button">
//               🔎 Search
//             </button>
//           </div>

//           {user?.is_admin && (
//             <div className="action-buttons">
//               {/* <button onClick={toggleUsersView} className="action-btn users-btn">
//                 👥 {showUsers ? 'Hide Users' : 'View Users'}
//               </button> */}
//               <button onClick={goToUsersPage} className="action-btn users-btn">
//   👥 View Users
// </button>

//               <button
//                 onClick={() => {
//                   setIsCreating(!isCreating);
//                   setEditingId(null);
//                   setFormData({ title: '', content: '' });
//                   setShowUsers(false);
//                 }}
//                 className="action-btn create-btn"
//               >
//                 {isCreating ? '❌ Cancel' : '✨ New Post'}
//               </button>
//             </div>
//           )}

//           {error && (
//             <div className="alert alert-error" style={{ marginTop: '20px' }}>
//               <span>{error}</span>
//               <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}>×</button>
//             </div>
//           )}

//           {showUsers && user?.is_admin && (
//             <div style={{ marginTop: '25px', padding: '25px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '20px' }}>
//               <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#333' }}>👥 Registered Users</h2>
//               <div style={{ display: 'grid', gap: '15px' }}>
//                 {users.map((u) => (
//                   <div key={u.id} style={{ background: 'white', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
//                     <div>
//                       <div style={{ fontWeight: '700', fontSize: '16px', color: '#333' }}>{u.username}</div>
//                       <div style={{ color: '#666', fontSize: '14px' }}>{u.email}</div>
//                       <div style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>Joined: {new Date(u.created_at).toLocaleDateString()}</div>
//                     </div>
//                     {u.is_admin && <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>⭐ Admin</span>}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {isCreating && (
//             <div style={{ marginTop: '25px', padding: '30px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', borderRadius: '20px' }}>
//               <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'white' }}>✨ Create New Post</h2>
//               <input
//                 type="text"
//                 placeholder="📝 Enter an amazing title..."
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 style={{ width: '100%', padding: '15px', border: '3px solid white', borderRadius: '15px', fontSize: '16px', marginBottom: '15px' }}
//               />
//               <textarea
//                 placeholder="✍️ Share your thoughts..."
//                 value={formData.content}
//                 onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//                 style={{ width: '100%', padding: '15px', border: '3px solid white', borderRadius: '15px', fontSize: '16px', minHeight: '150px', marginBottom: '15px', resize: 'vertical' }}
//               />
//               <button
//                 onClick={handleCreatePost}
//                 disabled={loading}
//                 style={{ width: '100%', padding: '15px', background: 'white', border: 'none', borderRadius: '15px', color: '#fa709a', fontSize: '18px', fontWeight: '700', cursor: 'pointer' }}
//               >
//                 {loading ? '⏳ Publishing...' : '🚀 Publish Post'}
//               </button>
//             </div>
//           )}
//         </div>

//         {loading && posts.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '80px 20px' }}>
//             <div className="spinner" style={{ margin: '0 auto' }}></div>
//             <p style={{ marginTop: '20px', fontSize: '18px', color: '#666', fontWeight: '600' }}>Loading amazing content...</p>
//           </div>
//         ) : (
//           <div className="posts-grid">
//             {posts.length === 0 ? (
//               <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '25px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
//                 <div style={{ fontSize: '64px', marginBottom: '20px' }}>📚</div>
//                 <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#333', marginBottom: '10px' }}>No posts yet</h2>
//                 <p style={{ color: '#666', fontSize: '16px' }}>
//                   {user?.is_admin ? '✨ Create your first post to get started!' : '📖 Check back later for new content'}
//                 </p>
//               </div>
//             ) : (
//               posts.map((post) => (
//                 <div key={post.id} className="post-card">
//                   {editingId === post.id ? (
//                     <div>
//                       <h3 style={{ fontWeight: '700', marginBottom: '15px', color: '#333' }}>✏️ Editing Post</h3>
//                       <input
//                         type="text"
//                         value={formData.title}
//                         onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                         style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', marginBottom: '15px', fontSize: '16px' }}
//                       />
//                       <textarea
//                         value={formData.content}
//                         onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//                         style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', marginBottom: '15px', minHeight: '120px', fontSize: '16px', resize: 'vertical' }}
//                       />
//                       <div style={{ display: 'flex', gap: '10px' }}>
//                         <button
//                           onClick={() => handleUpdatePost(post.id)}
//                           disabled={loading}
//                           className="edit-btn"
//                           style={{ flex: 1 }}
//                         >
//                           💾 {loading ? 'Saving...' : 'Save Changes'}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setEditingId(null);
//                             setFormData({ title: '', content: '' });
//                           }}
//                           style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
//                         >
//                           ❌ Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="post-header">
//                         <div style={{ flex: 1 }}>
//                           <h2 className="post-title">{post.title}</h2>
//                           <div className="post-meta">
//                             <span className="author-badge">
//                               👤 {post.author_username}
//                             </span>
//                             <span className="date-badge">
//                               📅 {new Date(post.created_at).toLocaleDateString('en-US', { 
//                                 year: 'numeric', 
//                                 month: 'long', 
//                                 day: 'numeric' 
//                               })}
//                             </span>
//                             {post.updated_at !== post.created_at && (
//                               <span className="edited-badge">✏️ Edited</span>
//                             )}
//                           </div>
//                         </div>
//                         {user?.is_admin && (
//                           <div className="post-actions">
//                             <button onClick={() => startEdit(post)} className="edit-btn" title="Edit">
//                               ✏️
//                             </button>
//                             <button onClick={() => handleDeletePost(post.id)} className="delete-btn" title="Delete">
//                               🗑️
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                       <div className="post-content">
//                         {expandedId === post.id ? (
//                           <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
//                         ) : (
//                           <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
//                         )}
//                       </div>
//                       {post.content.length > 200 && (
//                         <button
//                           onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
//                           className="read-more-btn"
//                         >
//                           {expandedId === post.id ? '⬆️ Show Less' : '📖 Read More'}
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>

//      }
//     />

//     {/* USERS PAGE */}
//     <Route path="/users" element={<UsersPage token={token} />} />
//   </Routes>
//   );
// }

import React, { useState, useEffect } from 'react';
import './BlogApp.css';

const API_URL = 'http://localhost:8000/api';

export default function BlogApp() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState('blogs'); // 'blogs' or 'users'
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [authData, setAuthData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token && currentPage === 'blogs') {
      fetchPosts();
    }
  }, [token, currentPage]);

  useEffect(() => {
    if (token && currentPage === 'users' && user?.is_admin) {
      fetchUsers();
    }
  }, [currentPage, token, user]);

  const fetchCurrentUser = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts?search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setError('');
      }
    } catch (err) {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setError('');
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!authData.username || !authData.email || !authData.password) {
      setError('All fields are required');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData),
      });
      if (response.ok) {
        setShowLogin(true);
        setError('');
        alert('Registration successful! Please login.');
        setAuthData({ username: '', email: '', password: '' });
      } else {
        const data = await response.json();
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!authData.username || !authData.password) {
      setError('Username and password are required');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authData.username, password: authData.password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        setError('');
        await fetchCurrentUser(data.access_token);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setPosts([]);
    setUsers([]);
    setCurrentPage('blogs');
    setAuthData({ username: '', email: '', password: '' });
  };

  const handleCreatePost = async () => {
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchPosts();
        setFormData({ title: '', content: '' });
        setIsCreating(false);
        setError('');
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to create post');
      }
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (id) => {
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchPosts();
        setEditingId(null);
        setFormData({ title: '', content: '' });
        setError('');
      } else {
        setError('Failed to update post');
      }
    } catch (err) {
      setError('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchPosts();
        setError('');
      }
    } catch (err) {
      setError('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setFormData({ title: post.title, content: post.content });
    setIsCreating(false);
    setExpandedId(null);
  };

  if (!token) {
    return (
      <div className="animated-bg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
          <div className="auth-card" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="auth-icon">
              <span style={{ fontSize: '36px' }}>📚</span>
            </div>
            <h1 className="auth-title">{showLogin ? 'Welcome Back' : 'Join Us'}</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
              {showLogin ? 'Login to your account' : 'Create your account'}
            </p>
            
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
                <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button>
              </div>
            )}

            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={authData.username}
                onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (showLogin ? handleLogin() : handleRegister())}
                className="form-input"
              />
              <span className="input-icon">👤</span>
            </div>

            {!showLogin && (
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  className="form-input"
                />
                <span className="input-icon">✉️</span>
              </div>
            )}

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (showLogin ? handleLogin() : handleRegister())}
                className="form-input"
              />
              <span className="input-icon">🔒</span>
            </div>

            <button
              onClick={showLogin ? handleLogin : handleRegister}
              disabled={loading}
              className="gradient-button"
            >
              {loading ? '⏳ Please wait...' : (showLogin ? '🚀 Login' : '✨ Create Account')}
            </button>

            <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
              {showLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setShowLogin(!showLogin);
                  setError('');
                  setAuthData({ username: '', email: '', password: '' });
                }}
                style={{ background: 'none', border: 'none', color: '#667eea', fontWeight: '700', cursor: 'pointer' }}
              >
                {showLogin ? 'Register' : 'Login'}
              </button>
            </p>

            <div style={{ marginTop: '30px', padding: '20px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 20%)', borderRadius: '15px', color: 'white' }}>
              <p style={{ fontWeight: '700', marginBottom: '10px' }}>🎯 Test Credentials:</p>
              <p style={{ fontSize: '13px' }}><strong>Admin:</strong> admin / admin123</p>
              <p style={{ fontSize: '13px' }}><strong>User:</strong> user / user123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="navbar">
        <div className="navbar-content">
          <div className="logo-section">
            <div className="logo-icon">📚</div>
            <div>
              <div className="logo-text">BlogSphere</div>
              <p style={{ fontSize: '12px', color: '#999' }}>Share your thoughts</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage('blogs')}
              className="action-btn"
              style={{ 
                background: currentPage === 'blogs' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                color: currentPage === 'blogs' ? 'white' : '#666'
              }}
            >
              📝 Blogs
            </button>
            {user?.is_admin && (
              <button
                onClick={() => setCurrentPage('users')}
                className="action-btn"
                style={{ 
                  background: currentPage === 'users' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                  color: currentPage === 'users' ? 'white' : '#666'
                }}
              >
                👥 Users
              </button>
            )}
          </div>

          <div className="user-section">
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: '700' }}>{user?.username}</div>
                {user?.is_admin && <div style={{ fontSize: '11px' }}>⭐ Admin</div>}
              </div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {currentPage === 'blogs' ? (
          <>
            <div className="search-card">
              <div className="search-bar-container">
                <input
                  type="text"
                  placeholder="🔍 Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchPosts()}
                  className="search-input"
                />
                <button onClick={fetchPosts} disabled={loading} className="search-button">
                  🔎 Search
                </button>
              </div>

              {user?.is_admin && (
                <div className="action-buttons">
                  <button
                    onClick={() => {
                      setIsCreating(!isCreating);
                      setEditingId(null);
                      setFormData({ title: '', content: '' });
                    }}
                    className="action-btn create-btn"
                  >
                    {isCreating ? '❌ Cancel' : '✨ New Post'}
                  </button>
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                  <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
                </div>
              )}

              {isCreating && (
                <div style={{ marginTop: '25px', padding: '30px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', borderRadius: '20px' }}>
                  <h2 style={{ color: 'white', marginBottom: '20px' }}>✨ Create New Post</h2>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', marginBottom: '15px' }}
                  />
                  <textarea
                    placeholder="Content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', minHeight: '150px', marginBottom: '15px', resize: 'vertical' }}
                  />
                  <button
                    onClick={handleCreatePost}
                    disabled={loading}
                    style={{ width: '100%', padding: '15px', background: 'white', border: 'none', borderRadius: '15px', color: '#fa709a', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {loading ? '⏳ Publishing...' : '🚀 Publish'}
                  </button>
                </div>
              )}
            </div>

            {loading && posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '20px', color: '#666' }}>Loading...</p>
              </div>
            ) : (
              <div className="posts-grid">
                {posts.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px', background: 'white', borderRadius: '25px' }}>
                    <div style={{ fontSize: '64px' }}>📚</div>
                    <h2 style={{ marginTop: '20px' }}>No posts yet</h2>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="post-card">
                      {editingId === post.id ? (
                        <div>
                          <h3>✏️ Editing</h3>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', marginBottom: '15px' }}
                          />
                          <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', minHeight: '120px', marginBottom: '15px', resize: 'vertical' }}
                          />
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleUpdatePost(post.id)}
                              disabled={loading}
                              className="edit-btn"
                              style={{ flex: 1 }}
                            >
                              💾 Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setFormData({ title: '', content: '' });
                              }}
                              style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="post-header">
                            <div style={{ flex: 1 }}>
                              <h2 className="post-title">{post.title}</h2>
                              <div className="post-meta">
                                <span className="author-badge">👤 {post.author_username}</span>
                                <span className="date-badge">
                                  📅 {new Date(post.created_at).toLocaleDateString()}
                                </span>
                                {post.updated_at !== post.created_at && (
                                  <span className="edited-badge">✏️ Edited</span>
                                )}
                              </div>
                            </div>
                            {user?.is_admin && (
                              <div className="post-actions">
                                <button onClick={() => startEdit(post)} className="edit-btn">✏️</button>
                                <button onClick={() => handleDeletePost(post.id)} className="delete-btn">🗑️</button>
                              </div>
                            )}
                          </div>
                          <div className="post-content">
                            {expandedId === post.id ? (
                              <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                            ) : (
                              <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
                            )}
                          </div>
                          {post.content.length > 200 && (
                            <button
                              onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                              className="read-more-btn"
                            >
                              {expandedId === post.id ? '⬆️ Show Less' : '📖 Read More'}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          <div className="search-card">
            <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '30px' }}>👥 User Management</h1>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
                <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '20px' }}>Loading users...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {users.map((u) => (
                  <div key={u.id} style={{ background: 'white', padding: '25px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '2px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: '700' }}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '20px', marginBottom: '5px' }}>{u.username}</div>
                        <div style={{ color: '#666' }}>📧 {u.email}</div>
                        <div style={{ color: '#999', fontSize: '13px', marginTop: '5px' }}>
                          📅 Joined: {new Date(u.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {u.is_admin ? (
                      <span className="author-badge">⭐ Admin</span>
                    ) : (
                      <span style={{ background: '#e0e0e0', color: '#666', padding: '8px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: '600' }}>👤 User</span>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: '20px', padding: '25px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '20px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>📊 Total Users: {users.length}</h3>
                  <p style={{ color: '#666' }}>
                    Admins: {users.filter(u => u.is_admin).length} | Users: {users.filter(u => !u.is_admin).length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}