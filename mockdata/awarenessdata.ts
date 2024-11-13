export const awarenessData = {
  programs: {
    ongoing: [
      {
        id: "VE001",
        name: "Youth Voter Education",
        type: "Educational",
        areas: ["College Campuses", "Youth Centers"],
        metrics: {
          sessions_conducted: 45,
          total_attendance: 2500,
          awareness_score: 8.5,
          registration_conversion: "65%",
        },
        schedule: {
          start_date: "2024-02-01",
          end_date: "2024-04-30",
          completed_sessions: 45,
          pending_sessions: 15,
        },
        resources: {
          coordinators: 12,
          volunteers: 45,
          materials_distributed: 5000,
        },
        languages: ["Telugu", "Hindi", "English"],
      },
      {
        id: "VE002",
        name: "Door-to-Door Awareness",
        type: "Direct Outreach",
        areas: ["Residential Areas", "Apartments"],
        metrics: {
          households_covered: 15000,
          voter_interactions: 45000,
          registration_assists: 2500,
          feedback_score: 4.2,
        },
        schedule: {
          start_date: "2024-01-15",
          completion: "75%",
          areas_pending: ["Block C", "Block D"],
        },
        teams: {
          active_teams: 25,
          volunteers_per_team: 4,
          daily_coverage: 200,
        },
      },
    ],
    upcoming: [
      {
        id: "VE003",
        name: "Senior Citizen Awareness",
        type: "Targeted",
        areas: ["Community Centers", "Retirement Homes"],
        planned_metrics: {
          target_audience: 5000,
          sessions: 30,
          duration_weeks: 4,
        },
        requirements: {
          volunteers: 25,
          materials: 3000,
          transport: "Required",
        },
      },
    ],
    completed: [
      {
        id: "VE004",
        name: "Digital Literacy Campaign",
        metrics: {
          participants: 1200,
          success_rate: "78%",
          feedback_score: 4.5,
        },
        impact: {
          online_registrations: 850,
          awareness_improvement: "45%",
        },
      },
    ],
  },
  materials: {
    inventory: {
      printed: {
        pamphlets: { total: 100000, distributed: 75000, remaining: 25000 },
        posters: { total: 25000, distributed: 18000, remaining: 7000 },
        banners: { total: 1000, distributed: 800, remaining: 200 },
      },
      digital: {
        videos: { produced: 50, published: 45, in_production: 5 },
        social_media_content: { created: 200, published: 180, scheduled: 20 },
        whatsapp_broadcasts: { created: 30, sent: 25, pending: 5 },
      },
    },
    distribution: {
      by_area: [
        {
          area: "Secunderabad",
          materials: {
            pamphlets: 25000,
            posters: 6000,
            banners: 250,
          },
          coverage: "85%",
          feedback: 4.5,
        },
        // ... more areas
      ],
      by_language: {
        Telugu: { percentage: 45, units: 45000 },
        Hindi: { percentage: 30, units: 30000 },
        Urdu: { percentage: 15, units: 15000 },
        English: { percentage: 10, units: 10000 },
      },
    },
    effectiveness: {
      metrics: [
        {
          material_type: "Video Content",
          engagement_rate: "24%",
          conversion_rate: "12%",
          cost_per_engagement: 2.5,
        },
        {
          material_type: "Pamphlets",
          reach: "85%",
          retention_rate: "45%",
          cost_per_unit: 0.5,
        },
      ],
    },
  },
  impact_metrics: {
    awareness_levels: {
      baseline: "45%",
      current: "72%",
      target: "85%",
      by_demographic: [
        { group: "Youth", improvement: "35%" },
        { group: "Women", improvement: "28%" },
        { group: "Senior Citizens", improvement: "22%" },
      ],
    },
    registration_impact: {
      new_registrations: 12500,
      updated_information: 8500,
      assistance_provided: 15000,
      by_program: [
        { program: "Youth Voter Education", registrations: 4500 },
        { program: "Door-to-Door", registrations: 6000 },
        { program: "Digital Campaign", registrations: 2000 },
      ],
    },
  },
}; 