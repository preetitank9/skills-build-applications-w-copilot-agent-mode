import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    captain: '',
    goal: ''
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/`);
      const data = await response.json();
      setTeams(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/teams/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchTeams();
        setFormData({ name: '', description: '', captain: '', goal: '' });
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Teams</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create New Team'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Create New Team</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Captain User ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.captain}
                  onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Team Goal</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Team</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">{team.description}</p>
                <div className="mb-2">
                  <strong>Captain:</strong> {team.captain_username || 'N/A'}<br />
                  <strong>Members:</strong> {team.member_count}<br />
                  <strong>Total Points:</strong> <span className="badge bg-success">{team.total_points}</span>
                </div>
                {team.goal && (
                  <div className="alert alert-info mb-2">
                    <strong>Goal:</strong> {team.goal}
                  </div>
                )}
                {team.member_usernames && team.member_usernames.length > 0 && (
                  <div>
                    <small><strong>Team Members:</strong> {team.member_usernames.join(', ')}</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="alert alert-info">No teams created yet.</div>
      )}
    </div>
  );
}

export default Teams;
