#!/usr/bin/env python
"""
Script to create sample data for OctoFit Tracker
"""
import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'octofit_tracker.settings')
django.setup()

from users.models import User
from activities.models import Activity, WorkoutSuggestion
from teams.models import Team

# Create users
print("Creating users...")
teacher = User.objects.create_user(
    username='coach_octo',
    email='coach@octofit.com',
    password='password123',
    first_name='Coach',
    last_name='Octo',
    user_type='teacher',
    fitness_level='advanced'
)

students = []
student_data = [
    ('john_runner', 'John', 'Smith', 'intermediate'),
    ('sarah_swimmer', 'Sarah', 'Johnson', 'advanced'),
    ('mike_cyclist', 'Mike', 'Williams', 'beginner'),
    ('emma_yoga', 'Emma', 'Brown', 'intermediate'),
    ('alex_athlete', 'Alex', 'Davis', 'advanced'),
]

for username, first, last, level in student_data:
    student = User.objects.create_user(
        username=username,
        email=f'{username}@student.com',
        password='student123',
        first_name=first,
        last_name=last,
        user_type='student',
        fitness_level=level,
        age=16,
        height=170,
        weight=65
    )
    students.append(student)
    print(f"Created student: {username}")

# Create activities
print("\nCreating activities...")
activity_types = ['running', 'swimming', 'cycling', 'yoga', 'strength', 'walking']
for i, student in enumerate(students):
    for j in range(5):
        activity_date = date.today() - timedelta(days=j)
        activity = Activity.objects.create(
            user=student,
            activity_type=activity_types[(i + j) % len(activity_types)],
            duration=30 + (j * 10),
            distance=5.0 + j if (i + j) % 2 == 0 else None,
            calories_burned=200 + (j * 50),
            date=activity_date,
            notes=f"Great workout session {j+1}"
        )
        print(f"Created activity for {student.username}: {activity.activity_type}")

# Update user points
print("\nUpdating user points...")
for student in students:
    total_points = sum([a.points_earned for a in student.activities.all()])
    student.total_points = total_points
    student.save()
    print(f"{student.username}: {total_points} points")

# Create teams
print("\nCreating teams...")
team1 = Team.objects.create(
    name='Fitness Warriors',
    description='We conquer fitness goals together!',
    captain=students[0],
    goal='Reach 10,000 combined points this month'
)
team1.members.add(students[0], students[1], students[2])
team1.update_total_points()

team2 = Team.objects.create(
    name='Cardio Champions',
    description='Running, cycling, and swimming enthusiasts',
    captain=students[3],
    goal='Complete 100km combined distance this week'
)
team2.members.add(students[3], students[4])
team2.update_total_points()

print(f"Created team: {team1.name} with {team1.members.count()} members")
print(f"Created team: {team2.name} with {team2.members.count()} members")

# Create workout suggestions
print("\nCreating workout suggestions...")
suggestions_data = [
    ('Morning Run Challenge', 'Start your day with a 5km run', 'running', 'intermediate', 30),
    ('Beginner Strength Training', 'Basic bodyweight exercises for building strength', 'strength', 'beginner', 20),
    ('Yoga Flow', 'Relaxing yoga session for flexibility', 'yoga', 'beginner', 45),
    ('Advanced Cycling', 'High-intensity interval cycling workout', 'cycling', 'advanced', 60),
    ('Swimming Endurance', 'Build swimming endurance with steady pace', 'swimming', 'intermediate', 40),
]

for student in students[:3]:
    for title, desc, activity_type, difficulty, duration in suggestions_data[:2]:
        suggestion = WorkoutSuggestion.objects.create(
            user=student,
            title=title,
            description=desc,
            activity_type=activity_type,
            difficulty=difficulty,
            duration=duration
        )
        print(f"Created suggestion for {student.username}: {title}")

print("\n✅ Sample data created successfully!")
print(f"Total users: {User.objects.count()}")
print(f"Total activities: {Activity.objects.count()}")
print(f"Total teams: {Team.objects.count()}")
print(f"Total workout suggestions: {WorkoutSuggestion.objects.count()}")
