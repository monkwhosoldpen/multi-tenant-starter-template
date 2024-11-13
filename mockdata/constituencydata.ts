export const constituencyMockData = {
  overview: {
    name: "Malkajgiri",
    state: "Telangana",
    type: "General",
    demographics: {
      totalPopulation: 3289023,
      voterPopulation: 2145678,
      urbanRural: {
        urban: 85,
        rural: 15,
      },
      ageDistribution: {
        "18-25": 22,
        "26-35": 28,
        "36-50": 30,
        "51-above": 20,
      },
      languages: [
        { name: "Telugu", percentage: 45 },
        { name: "Hindi", percentage: 25 },
        { name: "Urdu", percentage: 20 },
        { name: "Others", percentage: 10 },
      ],
    },
    assemblies: [
      {
        name: "Secunderabad Cantonment",
        voterCount: 315678,
        keyIssues: ["Infrastructure", "Water Supply"],
      },
      {
        name: "Malkajgiri",
        voterCount: 298456,
        keyIssues: ["Transportation", "Employment"],
      },
      {
        name: "Kutbullapur",
        voterCount: 287654,
        keyIssues: ["Housing", "Healthcare"],
      },
      // ... more assembly constituencies
    ],
  },
  issues: {
    primary: [
      {
        category: "Infrastructure",
        subIssues: [
          {
            name: "Metro Connectivity",
            affectedAreas: ["Alwal", "Bolaram", "Malkajgiri"],
            priority: "high",
            voterConcern: 85,
          },
          {
            name: "Road Development",
            affectedAreas: ["Kapra", "Nacharam", "Uppal"],
            priority: "medium",
            voterConcern: 75,
          },
        ],
      },
      {
        category: "Employment",
        subIssues: [
          {
            name: "IT Sector Growth",
            affectedAreas: ["Kompally", "ECIL"],
            priority: "high",
            voterConcern: 80,
          },
          {
            name: "Small Business Support",
            affectedAreas: ["All Areas"],
            priority: "high",
            voterConcern: 78,
          },
        ],
      },
    ],
    trending: [
      {
        issue: "Water Supply",
        sentiment: "negative",
        mentions: 12500,
        change: "+15%",
        areas: ["Alwal", "Kapra"],
      },
      // ... more trending issues
    ],
  },
  outreach: {
    zones: [
      {
        name: "Zone 1 - Secunderabad",
        booths: 245,
        volunteers: 1200,
        coordinators: 24,
        recentActivities: [
          {
            type: "Door-to-Door",
            coverage: 15000,
            date: "2024-03-15",
            feedback: "positive",
          },
        ],
      },
      // ... more zones
    ],
    languages: {
      primary: ["Telugu", "Hindi", "Urdu"],
      materialStatus: {
        Telugu: { ready: true, distributed: 25000 },
        Hindi: { ready: true, distributed: 15000 },
        Urdu: { ready: true, distributed: 12000 },
      },
    },
  },
  polling: {
    stations: {
      total: 2456,
      categories: {
        urban: 2100,
        rural: 356,
        sensitive: 145,
        critical: 35,
      },
      accessibility: {
        ramps: 2456,
        drinking_water: 2456,
        power_backup: 2200,
        toilets: 2300,
      },
    },
    history: {
      "2019": {
        turnout: 68.5,
        winner_margin: 45678,
        invalid_votes: 2345,
      },
      "2014": {
        turnout: 65.2,
        winner_margin: 38456,
        invalid_votes: 2890,
      },
    },
  },
  transportation: {
    vehicleNeeds: {
      polling_day: {
        cars: 500,
        vans: 150,
        buses: 50,
      },
      campaign: {
        sound_systems: 100,
        campaign_vehicles: 75,
      },
    },
    routes: [
      {
        zone: "Secunderabad",
        vehicles_assigned: 45,
        coverage_area: ["Trimulgherry", "Alwal", "Bolaram"],
        priority: "high",
      },
      // ... more routes
    ],
  },
}; 