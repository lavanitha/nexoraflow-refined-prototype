import React from 'react';

const CommunityNexusHub: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Community Nexus Hub
        </h1>
        <p className="text-gray-600">
          Connect with like-minded individuals, share experiences, and grow together in a supportive community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Discussion Forums */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Discussions</h2>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm">
                New Post
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Tips for staying motivated during career transitions',
                  author: 'Sarah Chen',
                  replies: 23,
                  likes: 45,
                  time: '2 hours ago',
                  category: 'Career',
                  avatar: '👩‍💼'
                },
                {
                  title: 'Best side hustles for developers in 2024',
                  author: 'Mike Rodriguez',
                  replies: 18,
                  likes: 32,
                  time: '4 hours ago',
                  category: 'Side Hustles',
                  avatar: '👨‍💻'
                },
                {
                  title: 'How I overcame imposter syndrome',
                  author: 'Emma Johnson',
                  replies: 41,
                  likes: 78,
                  time: '6 hours ago',
                  category: 'Personal Growth',
                  avatar: '👩‍🎓'
                },
                {
                  title: 'Learning path recommendations for data science',
                  author: 'Alex Kim',
                  replies: 15,
                  likes: 28,
                  time: '8 hours ago',
                  category: 'Learning',
                  avatar: '👨‍🔬'
                }
              ].map((post, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{post.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                          {post.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.category === 'Career' ? 'bg-blue-100 text-blue-800' :
                          post.category === 'Side Hustles' ? 'bg-green-100 text-green-800' :
                          post.category === 'Personal Growth' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>by {post.author}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{post.replies}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{post.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Virtual Networking Mixer',
                  date: 'Nov 15, 2024',
                  time: '7:00 PM EST',
                  attendees: 45,
                  type: 'Virtual',
                  description: 'Connect with professionals from various industries'
                },
                {
                  title: 'Side Hustle Success Workshop',
                  date: 'Nov 20, 2024',
                  time: '2:00 PM EST',
                  attendees: 32,
                  type: 'Workshop',
                  description: 'Learn strategies to launch and scale your side business'
                },
                {
                  title: 'Mentorship Program Kickoff',
                  date: 'Nov 25, 2024',
                  time: '6:00 PM EST',
                  attendees: 28,
                  type: 'Program',
                  description: 'Join our structured mentorship program'
                }
              ].map((event, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.type === 'Virtual' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'Workshop' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {event.type}
                      </span>
                      <button className="bg-primary-600 text-white px-3 py-1 rounded text-xs hover:bg-primary-700 transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">2,847</p>
                <p className="text-sm text-gray-600">Active Members</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">156</p>
                  <p className="text-xs text-gray-600">Posts Today</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">23</p>
                  <p className="text-xs text-gray-600">Events This Month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {[
                { name: 'Sarah Chen', points: 1250, avatar: '👩‍💼', badge: '🏆' },
                { name: 'Mike Rodriguez', points: 980, avatar: '👨‍💻', badge: '🥈' },
                { name: 'Emma Johnson', points: 875, avatar: '👩‍🎓', badge: '🥉' },
                { name: 'Alex Kim', points: 720, avatar: '👨‍🔬', badge: '' },
                { name: 'Lisa Wang', points: 650, avatar: '👩‍🎨', badge: '' }
              ].map((contributor, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{contributor.avatar}</span>
                    {contributor.badge && <span className="text-sm">{contributor.badge}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                    <p className="text-xs text-gray-600">{contributor.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentorship */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentorship</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl mb-2">🤝</div>
                <p className="text-sm font-medium text-gray-900 mb-1">Find a Mentor</p>
                <p className="text-xs text-gray-600 mb-3">Connect with experienced professionals</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm">
                  Browse Mentors
                </button>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">👨‍🏫</div>
                <p className="text-sm font-medium text-gray-900 mb-1">Become a Mentor</p>
                <p className="text-xs text-gray-600 mb-3">Share your expertise with others</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Find Connections</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Join Discussion</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Create Event</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityNexusHub;