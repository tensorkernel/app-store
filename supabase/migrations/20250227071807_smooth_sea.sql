/*
  # Add sample apps data
  
  This migration adds 10 random apps with sample data for testing purposes.
  
  1. Data
    - 10 apps with varied categories, publishers, and metadata
    - Each app has realistic data including descriptions, screenshots, and download URLs
    
  2. Purpose
    - Provide test data for the APK Store application
    - Demonstrate different app categories and features
*/

-- Insert 10 sample apps
INSERT INTO apps (
  title,
  description,
  thumbnail_url,
  screenshots,
  download_url,
  category,
  tags,
  seo_keywords,
  seo_description,
  version,
  publisher,
  download_count
) VALUES 
-- App 1: Social Media App
(
  'SocialConnect',
  'SocialConnect is the ultimate social media platform that helps you stay connected with friends and family. Share photos, videos, and updates with your network in real-time.\n\nFeatures:\n• Instant messaging with end-to-end encryption\n• Photo and video sharing with filters\n• News feed with personalized content\n• Group chats and communities\n• Event planning and calendar integration',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/socialconnect.apk',
  'social',
  ARRAY['social media', 'messaging', 'photos', 'videos', 'networking'],
  'social media, messaging app, photo sharing, video sharing, connect with friends',
  'SocialConnect is a feature-rich social media platform for connecting with friends and family. Share photos, videos, and updates in real-time.',
  '2.4.1',
  'TechSphere Inc.',
  12845
),

-- App 2: Productivity App
(
  'TaskMaster Pro',
  'TaskMaster Pro is a powerful productivity tool designed to help you organize your work and personal life. Create to-do lists, set reminders, and track your progress with intuitive dashboards.\n\nFeatures:\n• Task management with priorities and deadlines\n• Project planning with Gantt charts\n• Time tracking and productivity analytics\n• Calendar integration\n• Cloud sync across all your devices',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/taskmaster.apk',
  'productivity',
  ARRAY['productivity', 'task management', 'to-do list', 'time tracking', 'project management'],
  'productivity app, task management, to-do list, time tracking, project planning',
  'TaskMaster Pro is a comprehensive productivity tool for managing tasks, projects, and time. Stay organized and boost your efficiency.',
  '3.2.0',
  'Productivity Solutions LLC',
  8732
),

-- App 3: Game
(
  'Cosmic Explorers',
  'Embark on an epic space adventure in Cosmic Explorers, an open-world space exploration game. Discover new planets, encounter alien species, and build your own galactic empire.\n\nFeatures:\n• Vast open universe with procedurally generated planets\n• Resource gathering and base building\n• Spaceship customization and upgrades\n• Trading and economy system\n• Multiplayer mode with friends',
  'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1518365050014-70fe7232897f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1596838132731-31a4e5f9a8cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/cosmicexplorers.apk',
  'games',
  ARRAY['game', 'space', 'adventure', 'exploration', 'multiplayer'],
  'space game, exploration, adventure, multiplayer, open world, galaxy',
  'Cosmic Explorers is an immersive space exploration game where you can discover planets, build bases, and create your own galactic empire.',
  '1.8.5',
  'Nebula Games',
  24567
),

-- App 4: Health & Fitness
(
  'FitTrack Pro',
  'FitTrack Pro is your personal fitness companion, helping you achieve your health and wellness goals. Track workouts, monitor nutrition, and analyze your progress with detailed insights.\n\nFeatures:\n• Workout plans for all fitness levels\n• Nutrition tracking and meal planning\n• Body metrics and progress photos\n• Heart rate and sleep monitoring\n• Community challenges and support',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/fittrack.apk',
  'health',
  ARRAY['fitness', 'health', 'workout', 'nutrition', 'tracking'],
  'fitness app, workout tracker, nutrition planner, health monitoring, fitness goals',
  'FitTrack Pro is a comprehensive fitness and health app for tracking workouts, nutrition, and progress toward your wellness goals.',
  '4.1.2',
  'HealthTech Solutions',
  15678
),

-- App 5: Entertainment
(
  'StreamHub',
  'StreamHub brings all your favorite movies, TV shows, and live events to your fingertips. Enjoy unlimited streaming with personalized recommendations and exclusive content.\n\nFeatures:\n• Thousands of movies and TV shows\n• Live sports and events streaming\n• Offline downloading for on-the-go viewing\n• Multiple user profiles\n• 4K Ultra HD and HDR support',
  'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1586899028174-e7098604235b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/streamhub.apk',
  'entertainment',
  ARRAY['streaming', 'movies', 'TV shows', 'entertainment', 'video'],
  'streaming app, movies, TV shows, entertainment, video streaming, live events',
  'StreamHub offers unlimited streaming of movies, TV shows, and live events with personalized recommendations and exclusive content.',
  '5.0.3',
  'MediaStream Entertainment',
  32145
),

-- App 6: Education
(
  'BrainBoost Learning',
  'BrainBoost Learning makes education fun and accessible for all ages. From math and science to languages and arts, expand your knowledge with interactive lessons and quizzes.\n\nFeatures:\n• Courses in multiple subjects for all ages\n• Interactive lessons with animations and videos\n• Practice exercises and quizzes\n• Progress tracking and achievements\n• Offline learning mode',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/brainboost.apk',
  'education',
  ARRAY['education', 'learning', 'courses', 'quizzes', 'knowledge'],
  'education app, learning platform, online courses, interactive lessons, knowledge expansion',
  'BrainBoost Learning offers interactive educational content across multiple subjects for all ages, making learning fun and accessible.',
  '2.7.4',
  'EduTech Innovations',
  9876
),

-- App 7: Tools
(
  'SwiftScan Pro',
  'SwiftScan Pro transforms your device into a powerful document scanner. Scan, edit, and share documents, receipts, and IDs with professional quality and security.\n\nFeatures:\n• High-quality document scanning\n• OCR text recognition in multiple languages\n• PDF creation and editing\n• Cloud storage integration\n• Secure document sharing',
  'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/swiftscan.apk',
  'tools',
  ARRAY['scanner', 'document', 'OCR', 'PDF', 'productivity'],
  'document scanner, OCR, PDF creator, receipt scanner, document management',
  'SwiftScan Pro is a powerful document scanning app with OCR text recognition, PDF editing, and secure cloud storage integration.',
  '3.5.1',
  'ToolBox Software',
  7654
),

-- App 8: Photography
(
  'PixelPerfect',
  'PixelPerfect is a professional photo editing studio in your pocket. Enhance your photos with powerful tools, filters, and effects to create stunning visual content.\n\nFeatures:\n• Advanced photo editing tools\n• Professional filters and effects\n• Portrait enhancement and retouching\n• Collage maker and templates\n• Social media integration',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/pixelperfect.apk',
  'tools',
  ARRAY['photography', 'photo editing', 'filters', 'camera', 'creative'],
  'photo editor, image editing, filters, effects, photography, creative tools',
  'PixelPerfect is a professional photo editing app with advanced tools, filters, and effects for creating stunning visual content.',
  '4.2.3',
  'Creative Apps Studio',
  18932
),

-- App 9: Finance
(
  'WealthWise',
  'WealthWise helps you take control of your finances with smart budgeting, expense tracking, and investment monitoring. Achieve your financial goals with personalized insights and planning tools.\n\nFeatures:\n• Budget creation and expense tracking\n• Bill reminders and payment scheduling\n• Investment portfolio monitoring\n• Financial goal setting and tracking\n• Secure bank account synchronization',
  'https://images.unsplash.com/photo-1565514020179-026b92b2d70b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/wealthwise.apk',
  'finance',
  ARRAY['finance', 'budgeting', 'money', 'investment', 'banking'],
  'finance app, budget planner, expense tracker, investment monitoring, financial goals',
  'WealthWise is a comprehensive financial management app for budgeting, expense tracking, and investment monitoring with personalized insights.',
  '2.9.7',
  'FinTech Solutions',
  11234
),

-- App 10: Music
(
  'RhythmBox',
  'RhythmBox is your ultimate music companion, offering millions of songs, personalized playlists, and high-quality audio streaming. Discover new music and enjoy your favorites anywhere, anytime.\n\nFeatures:\n• Unlimited music streaming\n• Personalized recommendations\n• Offline listening mode\n• Lyrics display and music videos\n• Podcast integration and audiobooks',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  '["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"]',
  'https://example.com/download/rhythmbox.apk',
  'entertainment',
  ARRAY['music', 'streaming', 'audio', 'playlists', 'podcasts'],
  'music app, audio streaming, playlists, music discovery, podcasts, offline listening',
  'RhythmBox offers unlimited music streaming with personalized playlists, offline listening, and high-quality audio for music lovers.',
  '3.8.2',
  'AudioWave Media',
  28765
);

-- Add some sample reviews for the apps
INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'John Doe',
  5,
  'This app is amazing! It has all the features I need and works flawlessly. Highly recommended!',
  now() - interval '2 days'
FROM apps
WHERE title = 'SocialConnect';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Jane Smith',
  4,
  'Great app with a clean interface. Would give 5 stars but there are a few minor bugs that need fixing.',
  now() - interval '5 days'
FROM apps
WHERE title = 'SocialConnect';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Mike Johnson',
  5,
  'This productivity app has changed my life! I''m so much more organized now.',
  now() - interval '3 days'
FROM apps
WHERE title = 'TaskMaster Pro';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Sarah Williams',
  3,
  'Decent game but gets repetitive after a while. Needs more content updates.',
  now() - interval '7 days'
FROM apps
WHERE title = 'Cosmic Explorers';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'David Brown',
  5,
  'Best fitness app I''ve ever used! The workout plans are excellent and the progress tracking is motivating.',
  now() - interval '1 day'
FROM apps
WHERE title = 'FitTrack Pro';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Emily Davis',
  4,
  'Great streaming service with lots of content. The interface could be more intuitive though.',
  now() - interval '4 days'
FROM apps
WHERE title = 'StreamHub';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Alex Turner',
  5,
  'My kids love this learning app! The interactive lessons keep them engaged and they''re actually enjoying learning.',
  now() - interval '6 days'
FROM apps
WHERE title = 'BrainBoost Learning';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Lisa Chen',
  4,
  'Very useful scanner app. The OCR works well in most cases but struggles with some handwritten text.',
  now() - interval '8 days'
FROM apps
WHERE title = 'SwiftScan Pro';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Robert Wilson',
  5,
  'Professional photo editing tools that rival desktop software. Amazing what you can do on a phone now!',
  now() - interval '9 days'
FROM apps
WHERE title = 'PixelPerfect';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Michelle Lee',
  4,
  'Solid finance app that has helped me budget better. Would like to see more investment analysis features.',
  now() - interval '10 days'
FROM apps
WHERE title = 'WealthWise';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Kevin Martinez',
  5,
  'Best music streaming app out there! The personalized playlists are always spot on with my taste.',
  now() - interval '11 days'
FROM apps
WHERE title = 'RhythmBox';

-- Add a few more reviews with different ratings
INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Thomas Anderson',
  2,
  'App crashes frequently on my device. Needs better optimization.',
  now() - interval '12 days'
FROM apps
WHERE title = 'SocialConnect';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Olivia Parker',
  3,
  'Decent music app but the library is missing some of my favorite artists.',
  now() - interval '13 days'
FROM apps
WHERE title = 'RhythmBox';

INSERT INTO reviews (
  app_id,
  user_name,
  rating,
  comment,
  created_at
)
SELECT 
  id,
  'Daniel Kim',
  5,
  'Incredible game with stunning graphics and engaging gameplay. Can''t stop playing!',
  now() - interval '14 days'
FROM apps
WHERE title = 'Cosmic Explorers';
