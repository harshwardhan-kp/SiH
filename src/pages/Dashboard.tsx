import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Clock, 
  Users, 
  BookOpen,
  Target,
  CheckCircle
} from 'lucide-react';

// Mock data - in a real app, this would come from an API
const mockStats = {
  totalActivities: 10,
  approvedActivities: 9,
  pendingActivities: 1,
  rejectedActivities: 0,
  totalPoints: 425,
  monthlyGoal: 500,
  rank: 12,
  departmentSize: 150,
};

const mockRecentActivities = [
  {
    id: '1',
    title: 'Smart India Hackathon 2024 Winner',
    category: 'competition',
    date: '2024-01-10',
    status: 'approved',
    points: 50
  },
  {
    id: '2',
    title: 'Swachh Bharat Blood Donation Camp',
    category: 'community-service',
    date: '2024-01-12',
    status: 'pending',
    points: 30
  },
  {
    id: '3',
    title: 'NPTEL Machine Learning Certification',
    category: 'certification',
    date: '2024-01-08',
    status: 'approved',
    points: 35
  },
];

const mockUpcomingEvents = [
  {
    id: '1',
    title: 'IIT Delhi AI/ML Conference 2024',
    date: '2024-02-20',
    location: 'IIT Delhi, Hauz Khas',
    category: 'conference'
  },
  {
    id: '2',
    title: 'Bharatiya Sanskriti Mahotsav',
    date: '2024-02-22',
    location: 'Red Fort Grounds, Delhi',
    category: 'cultural'
  },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'technical': 'bg-blue-100 text-blue-800',
      'community-service': 'bg-green-100 text-green-800',
      'competition': 'bg-purple-100 text-purple-800',
      'cultural': 'bg-pink-100 text-pink-800',
      'conference': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const progressPercentage = (mockStats.totalPoints / mockStats.monthlyGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-primary-100">
              Ready to track your achievements today? You have {mockStats.pendingActivities} activities awaiting approval.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-3xl font-bold">{mockStats.totalPoints}</div>
              <div className="text-primary-200">Total Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalActivities}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.approvedActivities}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.pendingActivities}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Award className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Points Earned</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Progress</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Points this month</span>
              <span className="font-semibold">{mockStats.totalPoints} / {mockStats.monthlyGoal}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {progressPercentage >= 100 ? 'Goal achieved! 🎉' : `${(100 - progressPercentage).toFixed(0)}% to go`}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Department Rank</span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-green-600">#{mockStats.rank} of {mockStats.departmentSize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(activity.category)}`}>
                      {activity.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">{activity.date}</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  +{activity.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events & Opportunities</h3>
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockUpcomingEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-4 h-4 mr-2 flex items-center justify-center">📍</span>
                      {event.location}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
              </div>
              <div className="mt-3">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Register now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};