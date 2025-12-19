import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      let url = `${API_BASE_URL}/users/`;
      if (filter === 'students') {
        url = `${API_BASE_URL}/users/students/`;
      } else if (filter === 'teachers') {
        url = `${API_BASE_URL}/users/teachers/`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div>
      <h2>User Profiles</h2>
      <div className="mb-3">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All Users
          </button>
          <button
            type="button"
            className={`btn ${filter === 'students' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('students')}
          >
            Students
          </button>
          <button
            type="button"
            className={`btn ${filter === 'teachers' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('teachers')}
          >
            Teachers
          </button>
        </div>
      </div>
      
      <div className="row">
        {users.map((user) => (
          <div key={user.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{user.username}</h5>
                <p className="card-text">
                  <strong>Type:</strong> {user.user_type}<br />
                  <strong>Email:</strong> {user.email}<br />
                  <strong>Fitness Level:</strong> {user.fitness_level}<br />
                  <strong>Total Points:</strong> <span className="badge bg-success">{user.total_points}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="alert alert-info">No users found.</div>
      )}
    </div>
  );
}

export default UserList;
