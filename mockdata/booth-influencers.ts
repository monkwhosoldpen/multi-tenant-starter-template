export const boothInfluencerData = {
  mapping: {
    by_booth: [
      {
        booth_id: "B001",
        location: "Government School, Trimulgherry",
        voters: 1200,
        key_influencers: [
          {
            name: "Ramesh Kumar",
            type: "Community Leader",
            influence_score: 85,
            reach: 500,
            support_status: "confirmed",
            activities: [
              {
                type: "Community Meeting",
                date: "2024-03-15",
                attendance: 150,
                impact: "positive",
              },
            ],
            contact: {
              primary: "+91-XXXXXXXXXX",
              alternate: "ramesh@email.com",
              preferred_time: "Evening",
            },
          },
          // ... more influencers
        ],
        demographic_split: {
          age_groups: {
            "18-25": 250,
            "26-40": 450,
            "41-60": 350,
            "60+": 150,
          },
          gender: {
            male: 650,
            female: 550,
          },
          occupation: {
            service: 400,
            business: 300,
            others: 500,
          },
        },
      },
    ],
    by_area: [
      {
        area: "Secunderabad Cantonment",
        booths: 45,
        total_voters: 45000,
        key_segments: [
          {
            name: "Defense Personnel",
            size: 15000,
            key_issues: ["Infrastructure", "Healthcare"],
            influencers: [
              {
                name: "Col. Sharma (Retd.)",
                influence_type: "Military Community",
                reach: 5000,
                engagement_level: "high",
              },
            ],
          },
          // ... more segments
        ],
        local_bodies: [
          {
            name: "Residents Welfare Association",
            strength: 2500,
            leadership: {
              president: "Mr. Reddy",
              contact: "+91-XXXXXXXXXX",
            },
            meetings: [
              {
                date: "2024-03-20",
                agenda: "Local Development",
                expected_attendance: 200,
              },
            ],
          },
        ],
      },
    ],
  },
  engagement_tracking: {
    meetings: [
      {
        date: "2024-03-15",
        type: "Community Meeting",
        location: "Community Hall, Block A",
        attendees: {
          total: 150,
          influencers: 12,
          general_public: 138,
        },
        outcomes: {
          feedback: "positive",
          action_items: ["Infrastructure improvement", "Water supply"],
          follow_up_required: true,
        },
      },
    ],
    communications: {
      whatsapp_groups: 45,
      active_participants: 2500,
      message_effectiveness: "75%",
    },
    support_metrics: {
      confirmed: "45%",
      potential: "30%",
      neutral: "15%",
      opposed: "10%",
    },
  },
  resource_allocation: {
    by_booth: [
      {
        booth_id: "B001",
        requirements: {
          volunteers: 12,
          materials: {
            pamphlets: 1000,
            banners: 4,
          },
          transport: {
            vehicles: 2,
            timing: "Morning",
          },
        },
        priority: "high",
        status: "allocated",
      },
    ],
    special_requirements: [
      {
        type: "Language Support",
        details: "Urdu translator needed",
        booths: ["B003", "B004"],
        status: "pending",
      },
    ],
  },
}; 