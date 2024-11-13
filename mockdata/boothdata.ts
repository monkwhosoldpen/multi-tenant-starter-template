export const boothMockData = {
  management: {
    total: 2456,
    categories: {
      general: 2276,
      sensitive: 145,
      critical: 35,
    },
    distribution: [
      {
        assembly: "Secunderabad Cantonment",
        total: 450,
        sensitive: 25,
        critical: 5,
        locations: [
          {
            name: "Government School, Trimulgherry",
            boothNumbers: ["125", "126", "127"],
            voters: 3500,
            category: "general",
            requirements: {
              staff: 15,
              police: 4,
              facilities: ["Ramp", "Power Backup", "Water"],
            },
          },
          // ... more locations
        ],
      },
      // ... more assemblies
    ],
  },
  staffing: {
    requirements: {
      presiding_officers: 2456,
      polling_officers: 7368,
      micro_observers: 180,
      security_personnel: 4912,
    },
    training: {
      sessions: [
        {
          date: "2024-10-15",
          venue: "District Collectorate",
          capacity: 500,
          registered: 478,
        },
        // ... more sessions
      ],
      materials: {
        manuals_distributed: 2456,
        online_modules_completed: 2100,
        mock_polls_conducted: 2456,
      },
    },
  },
  logistics: {
    equipment: {
      evms: {
        total: 3000,
        tested: 2900,
        backup: 544,
      },
      vvpat: {
        total: 3000,
        tested: 2900,
        backup: 544,
      },
      other: {
        indelible_ink: 5000,
        voting_compartments: 2700,
        control_units: 3000,
      },
    },
    distribution: {
      centers: [
        {
          name: "Zone 1 Distribution Center",
          location: "Government College, Secunderabad",
          booths_covered: 450,
          storage_capacity: "Adequate",
          security: "High",
        },
        // ... more centers
      ],
    },
  },
  monitoring: {
    webcasting: {
      total_booths: 1200,
      control_rooms: 5,
      backup_systems: "Available",
    },
    communication: {
      primary: "Mobile",
      backup: "Wireless",
      emergency: "Satellite Phones",
      coverage: {
        mobile: "98%",
        wireless: "100%",
        satellite: "100%",
      },
    },
  },
}; 