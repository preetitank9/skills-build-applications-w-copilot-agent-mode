import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardType, setLeaderboardType] = useState('all_time');

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardType]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/current/?type=${leaderboardType}`);
      const data = await response.json();
      setLeaderboard(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      
      <div className="mb-4">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${leaderboardType === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setLeaderboardType('daily')}
          >
            Daily
          </button>
          <button
            type="button"
            className={`btn ${leaderboardType === 'weekly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setLeaderboardType('weekly')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`btn ${leaderboardType === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setLeaderboardType('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`btn ${leaderboardType === 'all_time' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setLeaderboardType('all_time')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th width="80">Rank</th>
              <th>User</th>
              <th>Type</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.user} className={index < 3 ? 'table-warning' : ''}>
                <td>
                  {entry.rank === 1 && '🥇'}
                  {entry.rank === 2 && '🥈'}
                  {entry.rank === 3 && '🥉'}
                  {entry.rank > 3 && `#${entry.rank}`}
                </td>
                <td><strong>{entry.username}</strong></td>
                <td>{entry.user_type}</td>
                <td><span className="badge bg-success">{entry.points}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <div className="alert alert-info">No leaderboard data available for this period.</div>
      )}
    </div>
  );
}

export default Leaderboard;
