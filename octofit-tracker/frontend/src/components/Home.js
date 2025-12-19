import React from 'react';

function Home() {
  return (
    <div className="row">
      <div className="col-12">
        <div className="jumbotron bg-light p-5 rounded">
          <h1 className="display-4">Welcome to OctoFit Tracker!</h1>
          <p className="lead">
            Track your fitness journey, compete with friends, and achieve your health goals.
          </p>
          <hr className="my-4" />
          <p>
            OctoFit Tracker is designed for students and gym teachers at Mergington High School
            to monitor fitness progress, create teams, and compete on leaderboards.
          </p>
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">📊 Track Activities</h5>
                  <p className="card-text">
                    Log your workouts including running, walking, cycling, swimming, and more.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">👥 Create Teams</h5>
                  <p className="card-text">
                    Form teams with your classmates and work together towards fitness goals.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">🏆 Compete on Leaderboards</h5>
                  <p className="card-text">
                    See how you rank against other students in daily, weekly, and monthly challenges.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">💪 Get Workout Suggestions</h5>
                  <p className="card-text">
                    Receive personalized workout recommendations based on your fitness level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
