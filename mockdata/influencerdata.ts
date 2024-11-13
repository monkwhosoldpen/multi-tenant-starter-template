export const influencerMockData = {
  community_leaders: {
    religious: [
      {
        name: "Dr. Ramesh Kumar",
        role: "Temple Trust Chairman",
        influence: "high",
        area: "Secunderabad",
        followers: 25000,
        events_organized: 12,
        support_status: "neutral",
      },
      // ... more religious leaders
    ],
    caste: [
      {
        name: "K. Venkat Reddy",
        community: "Reddy Sangam",
        influence: "very_high",
        areas: ["Malkajgiri", "Kapra"],
        active_members: 15000,
        support_status: "favorable",
      },
      // ... more caste leaders
    ],
    professional: [
      {
        name: "Dr. Sarah Khan",
        role: "Medical Association President",
        influence: "medium",
        sector: "Healthcare",
        members: 5000,
        recent_interactions: 3,
      },
      // ... more professional leaders
    ],
  },
  local_celebrities: {
    film_industry: [
      {
        name: "Rajesh Kumar",
        profession: "Actor",
        influence: "high",
        followers: {
          social_media: 2500000,
          ground_support: "strong",
        },
        availability: "weekends",
        previous_campaign: true,
      },
      // ... more celebrities
    ],
    sports: [
      {
        name: "M.S. Raju",
        sport: "Cricket",
        influence: "medium",
        local_connect: "Born in constituency",
        availability: "selective",
      },
      // ... more sports personalities
    ],
  },
  social_media: {
    influencers: [
      {
        name: "TechTelangana",
        platform: "Twitter",
        followers: 150000,
        engagement_rate: 3.5,
        content_type: "Tech/Politics",
        sentiment: "neutral",
      },
      // ... more social media influencers
    ],
    local_groups: [
      {
        name: "Malkajgiri Citizens Forum",
        platform: "Facebook",
        members: 45000,
        active_members: 15000,
        post_engagement: "high",
        key_issues: ["Infrastructure", "Water Supply"],
      },
      // ... more local groups
    ],
  },
  media: {
    journalists: [
      {
        name: "Priya Sharma",
        organization: "Local Daily",
        beat: "Politics",
        reach: "high",
        previous_coverage: "balanced",
      },
      // ... more journalists
    ],
    local_channels: [
      {
        name: "City News Network",
        type: "Cable News",
        viewership: 250000,
        coverage_type: "News + Analysis",
        program_slots: ["Morning News", "Evening Debate"],
      },
      // ... more channels
    ],
  },
}; 