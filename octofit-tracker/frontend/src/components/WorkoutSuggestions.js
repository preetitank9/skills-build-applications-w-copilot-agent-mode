import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function WorkoutSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    title: '',
    description: '',
    activity_type: 'running',
    difficulty: 'beginner',
    duration: ''
  });

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workout-suggestions/`);
      const data = await response.json();
      setSuggestions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/workout-suggestions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchSuggestions();
        setFormData({
          user: '',
          title: '',
          description: '',
          activity_type: 'running',
          difficulty: 'beginner',
          duration: ''
        });
      }
    } catch (error) {
      console.error('Error creating suggestion:', error);
    }
  };

  const markCompleted = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/workout-suggestions/${id}/complete/`, {
        method: 'POST',
      });
      fetchSuggestions();
    } catch (error) {
      console.error('Error marking suggestion as completed:', error);
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>💪 Workout Suggestions</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Suggestion'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Create New Workout Suggestion</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">User ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.user}
                  onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  required
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Activity Type</label>
                  <select
                    className="form-select"
                    value={formData.activity_type}
                    onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                  >
                    <option value="running">Running</option>
                    <option value="walking">Walking</option>
                    <option value="cycling">Cycling</option>
                    <option value="swimming">Swimming</option>
                    <option value="strength">Strength Training</option>
                    <option value="yoga">Yoga</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create Suggestion</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="col-md-6 mb-3">
            <div className={`card ${suggestion.is_completed ? 'border-success' : ''}`}>
              <div className="card-body">
                <h5 className="card-title">
                  {suggestion.title}
                  {suggestion.is_completed && (
                    <span className="badge bg-success ms-2">Completed</span>
                  )}
                </h5>
                <p className="card-text">{suggestion.description}</p>
                <div className="mb-2">
                  <span className="badge bg-info me-2">{suggestion.activity_type}</span>
                  <span className="badge bg-warning me-2">{suggestion.difficulty}</span>
                  <span className="badge bg-secondary">{suggestion.duration} min</span>
                </div>
                {!suggestion.is_completed && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => markCompleted(suggestion.id)}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="alert alert-info">No workout suggestions available.</div>
      )}
    </div>
  );
}

export default WorkoutSuggestions;
