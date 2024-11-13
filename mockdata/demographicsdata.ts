export const demographicsMockData = {
  religious: {
    distribution: [
      { group: "Hindu", percentage: 68.5, count: 1468234 },
      { group: "Muslim", percentage: 19.2, count: 411567 },
      { group: "Christian", percentage: 7.8, count: 167234 },
      { group: "Sikh", percentage: 2.5, count: 53678 },
      { group: "Others", percentage: 2.0, count: 42890 },
    ],
    places_of_worship: {
      temples: 245,
      mosques: 89,
      churches: 34,
      gurudwaras: 12,
      others: 15,
    },
    sensitive_areas: [
      {
        name: "Old City",
        type: "mixed",
        population: 125000,
        considerations: ["Festival Season", "Friday Prayers"],
      },
      // ... more areas
    ],
  },
  caste: {
    distribution: [
      { category: "General", percentage: 32.5, count: 696534 },
      { category: "OBC", percentage: 38.2, count: 818765 },
      { category: "SC", percentage: 18.6, count: 398567 },
      { category: "ST", percentage: 8.4, count: 180234 },
      { category: "Others", percentage: 2.3, count: 49345 },
    ],
    reserved_constituencies: {
      sc: 2,
      st: 1,
    },
    influential_groups: [
      {
        community: "Reddy",
        influence_areas: ["Secunderabad", "Malkajgiri Central"],
        voting_pattern: "Traditionally split",
      },
      {
        community: "Velama",
        influence_areas: ["Kapra", "Uppal"],
        voting_pattern: "Party loyal",
      },
      // ... more groups
    ],
  },
  linguistic: {
    primary: [
      { language: "Telugu", percentage: 45.5, count: 975234 },
      { language: "Hindi/Urdu", percentage: 35.2, count: 754567 },
      { language: "English", percentage: 12.3, count: 263678 },
      { language: "Others", percentage: 7.0, count: 150123 },
    ],
    campaign_materials: {
      languages: [
        {
          name: "Telugu",
          materials: {
            pamphlets: 250000,
            posters: 50000,
            video_content: 25,
            audio_messages: 15,
          },
          translation_status: "completed",
        },
        {
          name: "Hindi",
          materials: {
            pamphlets: 150000,
            posters: 30000,
            video_content: 20,
            audio_messages: 12,
          },
          translation_status: "completed",
        },
        {
          name: "Urdu",
          materials: {
            pamphlets: 100000,
            posters: 25000,
            video_content: 18,
            audio_messages: 10,
          },
          translation_status: "in-progress",
        },
      ],
    },
  },
  socioeconomic: {
    income_groups: [
      { category: "Upper", percentage: 15.2, count: 325678 },
      { category: "Upper Middle", percentage: 22.5, count: 482345 },
      { category: "Lower Middle", percentage: 35.8, count: 767234 },
      { category: "Lower", percentage: 26.5, count: 567890 },
    ],
    occupation: [
      { type: "Service Sector", percentage: 45.2 },
      { type: "Business", percentage: 22.5 },
      { type: "Government", percentage: 15.8 },
      { type: "Agriculture", percentage: 8.5 },
      { type: "Others", percentage: 8.0 },
    ],
    education: [
      { level: "Graduate+", percentage: 32.5 },
      { level: "High School", percentage: 45.2 },
      { level: "Primary", percentage: 15.8 },
      { level: "Illiterate", percentage: 6.5 },
    ],
  },
  youth_voters: {
    total: 458234,
    age_distribution: [
      { age: "18-21", count: 125678, percentage: 27.4 },
      { age: "22-25", count: 198234, percentage: 43.2 },
      { age: "26-29", count: 134322, percentage: 29.4 },
    ],
    first_time_voters: {
      total: 85234,
      registered: 65123,
      pending: 20111,
      by_area: [
        { area: "Secunderabad", count: 25234 },
        { area: "Malkajgiri", count: 22567 },
        { area: "Kapra", count: 18890 },
        // ... more areas
      ],
    },
  },
}; 