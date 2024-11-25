import { v4 as uuidv4 } from 'uuid';

const generateRandomName = () => {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'Alex', 'Emma', 'Chris', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const generateRandomBio = () => {
  const bios = [
    'Tech enthusiast and innovator',
    'Digital creator and entrepreneur',
    'Passionate about blockchain and AI',
    'Building the future of technology',
    'Software engineer and problem solver'
  ];
  return bios[Math.floor(Math.random() * bios.length)];
};

export const generateMockGoat = (category: string, index: number) => {
  const randomName = generateRandomName();
  const created_at = Date.now();
  const username = `${randomName.toLowerCase().replace(' ', '_')}_${created_at}_${index}`;
  
  return {
    profile_id: Math.floor(Math.random() * 1000000) + index,
    stream_id: null,
    uid: uuidv4(),
    username: username,
    verified: Math.random() > 0.5,
    metadata_with_translations: {
      bio: {
        hindi: "यादृच्छिक बायो",
        telugu: "యాదృచ్ఛిక జీవితం",
        english: `${category} - ${generateRandomBio()}`
      },
      name: {
        hindi: "यादृच्छिक नाम",
        telugu: "యాదృచ్ఛిక పేరు",
        english: randomName
      }
    },
    img_url: `https://placehold.co/150?text=${username}`,
    cover_url: `https://placehold.co/600x200?text=${category}_${username}`,
    player_id: null,
    country_code: ['US', 'UK', 'IN', 'CA', 'AU'][Math.floor(Math.random() * 5)],
    location_code: null,
    state_code: null,
    district_code: null,
    language_code: ['en', 'hi', 'te'][Math.floor(Math.random() * 3)],
    last_updated: new Date().toISOString(),
    notifications_last_opened: new Date().toISOString(),
    captcha_completed_at: new Date().toISOString(),
    hcaptcha_response_token: null,
    website_url: Math.random() > 0.5 ? `https://${username}.com` : null,
    wikipedia_url: null,
    instagram_username: Math.random() > 0.5 ? username : null,
    twitter_username: username,
    facebook_username: Math.random() > 0.5 ? username : null,
    spotify_artist_id: null,
    apple_music_artist_id: null,
    is_secondary_stream: false,
    is_party: Math.random() > 0.7,
    is_historical: false,
    is_open: true,
    is_premium: Math.random() > 0.5,
    is_demo: false,
    owner_username: null,
    tags: [],
    entity_type: [],
    type: category,
    blocked_profile_ids: [],
    latest_message: null
  };
}; 