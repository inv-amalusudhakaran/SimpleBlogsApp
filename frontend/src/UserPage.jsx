// import React, { useEffect, useState } from 'react';

// const API_URL = 'http://localhost:8000/api';

// export default function UsersPage({ token }) {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch(`${API_URL}/admin/users`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(setUsers);
//   }, []);

//   return (
//     <div style={{ padding: '30px' }}>
//       <h1>👥 Registered Users</h1>

//       {users.map(user => (
//         <div key={user.id} style={{ padding: '15px', background: '#fff', margin: '10px 0', borderRadius: '10px' }}>
//           <strong>{user.username}</strong> <br />
//           {user.email}
//         </div>
//       ))}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogApp.css';

const API_URL = 'http://localhost:8000/api';

export default function UsersPage({ token, user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <div className="main-container">
      <div className="navbar">
        <div className="navbar-content">
          <div className="logo-section">
            <div className="logo-icon">📚</div>
            <div>
              <div className="logo-text">BlogSphere</div>
              <p style={{ fontSize: '12px', color: '#999' }}>User Management</p>
            </div>
          </div>
          <div className="user-section">
            <button onClick={() => navigate('/')} className="action-btn users-btn" style={{ marginRight: '10px' }}>
              📝 Back to Blogs
            </button>
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: '700' }}>{user?.username}</div>
                {user?.is_admin && <div style={{ fontSize: '11px' }}>⭐ Admin</div>}
              </div>
            </div>
            <button onClick={onLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="search-card">
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '30px' }}>
            👥 User Management
          </h1>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '20px' }}>Loading users...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {users.map(u => (
                <div key={u.id} style={{ 
                  background: 'white', 
                  padding: '25px', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: '2px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontSize: '24px', 
                      fontWeight: '700'
                    }}>
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
                    <span style={{ background: '#e0e0e0', color: '#666', padding: '8px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: '600' }}>
                      👤 User
                    </span>
                  )}
                </div>
              ))}

              <div style={{ 
                marginTop: '20px', 
                padding: '25px', 
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
                borderRadius: '20px', 
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
                  📊 Total Users: {users.length}
                </h3>
                <p style={{ color: '#666' }}>
                  Admins: {users.filter(u => u.is_admin).length} | Users: {users.filter(u => !u.is_admin).length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
