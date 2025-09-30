import React, { useState } from 'react';
import { Plus, Filter, Search, Calendar, MapPin, Award } from 'lucide-react';
import { AddActivityForm } from '../components/AddActivityForm';
import { ActivityFormData } from '../types';

export const Activities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  const mockActivities = [
    {
      id: '1',
      title: 'Smart India Hackathon 2024 - Healthcare Winner',
      description: 'Won first place in Smart India Hackathon 2024 under Healthcare theme with AI-based rural healthcare solution for diabetic retinopathy detection.',
      category: 'competition',
      type: 'hackathon',
      date: '2024-01-10',
      location: 'IIT Delhi, Hauz Khas',
      organizer: 'AICTE & Ministry of Education',
      status: 'approved',
      points: 50,
      certificates: ['sih-winner-cert.pdf'],
      images: ['sih-team.jpg', 'presentation.jpg'],
    },
    {
      id: '2', 
      title: 'Swachh Bharat Blood Donation Camp Volunteer',
      description: 'Volunteered for organizing blood donation camp as part of Swachh Bharat initiative in collaboration with AIIMS Delhi.',
      category: 'community-service',
      type: 'volunteer',
      date: '2024-01-12',
      location: 'Delhi Technical University Campus',
      organizer: 'NSS DTU & Indian Red Cross Society',
      status: 'pending',
      points: 30,
    },
    {
      id: '3',
      title: 'NPTEL Machine Learning Certification - Elite',
      description: 'Completed NPTEL ML course by Prof. Balaraman Ravindran from IIT Madras with Elite certification (Top 5% among 50,000+ participants).',
      category: 'certification',
      type: 'course',
      date: '2024-01-08',
      location: 'Online - NPTEL Platform',
      organizer: 'IIT Madras via NPTEL',
      status: 'approved',
      points: 35,
      certificates: ['nptel-ml-cert.pdf'],
    },
    {
      id: '4',
      title: 'Techfest IIT Bombay - Cultural Secretary',
      description: 'Served as Cultural Secretary for Techfest 2024, managing logistics for Asia\'s largest science festival with 150,000+ participants.',
      category: 'leadership',
      type: 'leadership',
      date: '2024-01-05',
      location: 'IIT Bombay Campus',
      organizer: 'Techfest IIT Bombay',
      status: 'approved',
      points: 45,
      certificates: [],
      images: ['techfest-team.jpg'],
    },
    {
      id: '5',
      title: 'Digital India Internship at NASSCOM',
      description: 'Completed 3-month internship working on Digital India initiatives, developing web app for tracking digital literacy programs.',
      category: 'internship',
      type: 'internship',
      date: '2023-12-15',
      location: 'NASSCOM Office, Noida',
      organizer: 'NASSCOM & Digital India Corporation',
      status: 'approved',
      points: 40,
      certificates: ['nasscom-internship.pdf'],
    },
  ];

  const filteredActivities = activeTab === 'all' 
    ? mockActivities 
    : mockActivities.filter(activity => activity.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'technical': 'bg-blue-100 text-blue-800',
      'community-service': 'bg-green-100 text-green-800',
      'competition': 'bg-purple-100 text-purple-800',
      'academic': 'bg-indigo-100 text-indigo-800',
      'leadership': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddActivity = async (data: ActivityFormData) => {
    // In a real app, this would call the API
    console.log('Adding activity:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Refresh activities list
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="mt-2 text-gray-600">Track and manage your academic and extracurricular activities</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                    : 'text-gray-500 hover:text-gray-700 border-2 border-transparent hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && (
                  <span className="ml-1 text-xs">
                    ({mockActivities.filter(a => a.status === tab).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="btn btn-outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(activity.category)}`}>
                    {activity.category.replace('-', ' ')}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{activity.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                  {activity.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {activity.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-1 flex items-center justify-center">🏢</span>
                    {activity.organizer}
                  </div>
                  {activity.status === 'approved' && (
                    <div className="flex items-center font-medium text-green-600">
                      <Award className="w-4 h-4 mr-1" />
                      +{activity.points} points
                    </div>
                  )}
                </div>

                {(activity.certificates || activity.images) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activity.certificates?.map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                        📄 {cert}
                      </span>
                    ))}
                    {activity.images?.map((img, index) => (
                      <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                        🖼️ {img}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end space-y-2">
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-outline text-sm">View Details</button>
                  {activity.status === 'pending' && (
                    <button className="btn btn-outline text-sm">Edit</button>
                  )}
                </div>
                {activity.status === 'rejected' && (
                  <p className="text-xs text-red-600">Click to view rejection reason</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'all' 
              ? "You haven't added any activities yet. Start by adding your first activity!"
              : `No ${activeTab} activities found.`
            }
          </p>
          {activeTab === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Activity
            </button>
          )}
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddForm && (
        <AddActivityForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddActivity}
        />
      )}
    </div>
  );
};