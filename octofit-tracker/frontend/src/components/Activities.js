import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    activity_type: 'running',
    duration: '',
    distance: '',
    calories_burned: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/`);
      const data = await response.json();
      setActivities(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/activities/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchActivities();
        setFormData({
          user: '',
          activity_type: 'running',
          duration: '',
          distance: '',
          calories_burned: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Activities</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Log New Activity'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Log New Activity</h5>
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
              <div className="row">
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
                <div className="col-md-4 mb-3">
                  <label className="form-label">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Calories Burned</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.calories_burned}
                    onChange={(e) => setFormData({ ...formData, calories_burned: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Log Activity</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Activity</th>
              <th>Duration</th>
              <th>Distance</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.user_username}</td>
                <td>{activity.activity_type}</td>
                <td>{activity.duration} min</td>
                <td>{activity.distance ? `${activity.distance} km` : '-'}</td>
                <td><span className="badge bg-success">{activity.points_earned}</span></td>
                <td>{activity.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activities.length === 0 && (
        <div className="alert alert-info">No activities logged yet.</div>
      )}
    </div>
  );
}

export default Activities;
