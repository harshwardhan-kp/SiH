import React, { useState } from 'react';
import { X, User, Users, Shield, Info, ChevronDown, ChevronRight } from 'lucide-react';

interface DemoGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoCredential {
  role: string;
  email: string;
  password: string;
  name: string;
  description: string;
  features: string[];
}

const demoCredentials: DemoCredential[] = [
  {
    role: 'Student',
    email: 'harsh@demo.com',
    password: 'password',
    name: 'Harshwardhan',
    description: 'IT Student - 6th Semester',
    features: [
      'Submit and track activity records',
      'Upload certificates and images',
      'View activity approval status',
      'Generate digital portfolio',
      'Access analytics dashboard',
      'Receive notifications',
      'Manage profile and skills'
    ]
  },
  {
    role: 'Student',
    email: 'neha.student@demo.com',
    password: 'password',
    name: 'Neha Gupta',
    description: 'EC Student - 4th Semester',
    features: [
      'Submit activity records',
      'Track participation points',
      'Build portfolio',
      'View department rankings'
    ]
  },
  {
    role: 'Student',
    email: 'vikram.student@demo.com',
    password: 'password',
    name: 'Vikram Singh',
    description: 'ME Student - 8th Semester',
    features: [
      'Manage final year activities',
      'Portfolio generation for placements',
      'Track internship records'
    ]
  },
  {
    role: 'Faculty',
    email: 'faculty@demo.com',
    password: 'password',
    name: 'Dr. Priya Mehta',
    description: 'Computer Science Department',
    features: [
      'Review and approve student activities',
      'Bulk approval/rejection operations',
      'Department analytics dashboard',
      'Student progress monitoring',
      'Verification of certificates',
      'Generate department reports'
    ]
  },
  {
    role: 'Faculty',
    email: 'dr.anil@demo.com',
    password: 'password',
    name: 'Dr. Anil Krishnan',
    description: 'Electronics & Communication Department',
    features: [
      'Activity approval workflow',
      'Department-wise student tracking',
      'Portfolio verification'
    ]
  },
  {
    role: 'Admin',
    email: 'admin@demo.com',
    password: 'password',
    name: 'Rajesh Kumar',
    description: 'System Administrator',
    features: [
      'Complete system access',
      'User management (add/edit/delete)',
      'System-wide analytics',
      'Event management',
      'Institutional reporting',
      'System configuration',
      'Bulk operations',
      'Data export/import'
    ]
  }
];

const sampleActivities = [
  {
    title: 'Hackathon Participation',
    category: 'Competition',
    status: 'Approved',
    points: 15
  },
  {
    title: 'Workshop on AI/ML',
    category: 'Academic',
    status: 'Pending',
    points: 10
  },
  {
    title: 'Community Service Drive',
    category: 'Community Service',
    status: 'Approved',
    points: 12
  },
  {
    title: 'Research Paper Publication',
    category: 'Research',
    status: 'Approved',
    points: 25
  }
];

export const DemoGuide: React.FC<DemoGuideProps> = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [selectedCredential, setSelectedCredential] = useState<DemoCredential | null>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyCredentials = (credential: DemoCredential) => {
    navigator.clipboard.writeText(`${credential.email} / ${credential.password}`);
    setSelectedCredential(credential);
    setTimeout(() => setSelectedCredential(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div>
            <h2 className="text-2xl font-bold">Demo Guide</h2>
            <p className="text-primary-100 mt-1">Complete walkthrough of Smart Student Hub features</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Overview Section */}
          <div className="p-6 border-b border-gray-100">
            <button
              onClick={() => toggleSection('overview')}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
            >
              {expandedSections.has('overview') ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <Info className="w-5 h-5" />
              <span>System Overview</span>
            </button>

            {expandedSections.has('overview') && (
              <div className="ml-7 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Welcome to Smart Student Hub!</h4>
                  <p className="text-blue-800 text-sm">
                    This is a comprehensive demo of the Smart Student Hub platform. All data is stored locally in your browser
                    and no external server is required. You can explore all features with the provided demo accounts.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">🎓 For Students</h5>
                    <p className="text-green-800 text-sm">
                      Track activities, build portfolios, and monitor your academic progress.
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2">👨‍🏫 For Faculty</h5>
                    <p className="text-purple-800 text-sm">
                      Review submissions, approve activities, and monitor department progress.
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h5 className="font-semibold text-orange-900 mb-2">⚙️ For Admins</h5>
                    <p className="text-orange-800 text-sm">
                      Complete system control, user management, and institutional analytics.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Demo Credentials Section */}
          <div className="p-6 border-b border-gray-100">
            <button
              onClick={() => toggleSection('credentials')}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
            >
              {expandedSections.has('credentials') ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <Users className="w-5 h-5" />
              <span>Demo Accounts</span>
            </button>

            {expandedSections.has('credentials') && (
              <div className="ml-7 space-y-4">
                <p className="text-gray-600 text-sm mb-4">
                  Click on any credential below to copy it to your clipboard:
                </p>

                {demoCredentials.map((credential, index) => (
                  <div
                    key={index}
                    className={`bg-gray-50 border rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-100 ${
                      selectedCredential === credential ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                    }`}
                    onClick={() => copyCredentials(credential)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          credential.role === 'Student' ? 'bg-green-100' :
                          credential.role === 'Faculty' ? 'bg-purple-100' : 'bg-orange-100'
                        }`}>
                          {credential.role === 'Student' ? (
                            <User className="w-5 h-5 text-green-600" />
                          ) : credential.role === 'Faculty' ? (
                            <Shield className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Users className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{credential.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              credential.role === 'Student' ? 'bg-green-100 text-green-800' :
                              credential.role === 'Faculty' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {credential.role}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{credential.description}</p>
                          <div className="mt-1">
                            <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                              {credential.email} / {credential.password}
                            </span>
                            {selectedCredential === credential && (
                              <span className="ml-2 text-green-600 text-sm">Copied!</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-3 ml-13">
                      <p className="text-xs text-gray-500 mb-2">Available features:</p>
                      <div className="flex flex-wrap gap-1">
                        {credential.features.slice(0, 4).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-white px-2 py-1 rounded border">
                            {feature}
                          </span>
                        ))}
                        {credential.features.length > 4 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{credential.features.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sample Data Section */}
          <div className="p-6 border-b border-gray-100">
            <button
              onClick={() => toggleSection('sample-data')}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
            >
              {expandedSections.has('sample-data') ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span>📊</span>
              <span>Sample Data</span>
            </button>

            {expandedSections.has('sample-data') && (
              <div className="ml-7 space-y-4">
                <p className="text-gray-600 text-sm">
                  The system comes pre-loaded with sample activities, portfolios, and notifications to demonstrate all features:
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Sample Activities</h4>
                  <div className="space-y-2">
                    {sampleActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                        <div>
                          <h5 className="font-medium text-gray-900">{activity.title}</h5>
                          <p className="text-sm text-gray-600">{activity.category}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activity.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </span>
                          <p className="text-sm font-semibold text-gray-700 mt-1">{activity.points} pts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">📈 Analytics Data</h5>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Activity completion rates</li>
                      <li>• Points distribution by category</li>
                      <li>• Monthly progress tracking</li>
                      <li>• Department comparisons</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2">📁 Portfolio Data</h5>
                    <ul className="text-purple-800 text-sm space-y-1">
                      <li>• Academic achievements</li>
                      <li>• Project portfolios</li>
                      <li>• Skill assessments</li>
                      <li>• Certificate collections</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Getting Started Section */}
          <div className="p-6">
            <button
              onClick={() => toggleSection('getting-started')}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
            >
              {expandedSections.has('getting-started') ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span>🚀</span>
              <span>Getting Started</span>
            </button>

            {expandedSections.has('getting-started') && (
              <div className="ml-7 space-y-4">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
                  <h4 className="font-semibold text-primary-900 mb-3">Quick Start Guide</h4>
                  <ol className="text-primary-800 text-sm space-y-2 list-decimal list-inside">
                    <li>Choose a demo account from the credentials above</li>
                    <li>Copy the email and password</li>
                    <li>Close this guide and use the credentials to login</li>
                    <li>Explore the dashboard and available features</li>
                    <li>Try different roles to see varying permissions</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h5 className="font-semibold text-yellow-900 mb-2">💡 Pro Tips</h5>
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• Start with a student account to see the basic workflow</li>
                    <li>• Switch to faculty account to see the approval process</li>
                    <li>• Use admin account for complete system overview</li>
                    <li>• All data persists in your browser session</li>
                    <li>• Refresh the page to reset to original demo data</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            This is a demonstration of the Smart Student Hub platform. All features are functional with mock data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoGuide;
