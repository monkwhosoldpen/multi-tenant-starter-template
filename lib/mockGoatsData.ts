import { Message, Subgroup, Goat, GoatCategoryData } from './types/goat';
import { v4 as uuidv4 } from 'uuid';

export const GoatCategories = {
    demo: [
        "ElonMusk",
        "JaneDoe",
        "JohnDoe"
    ],
    technology: [
        "ElonMusk",
        "BillGates",
        "MarkZuckerberg",
        "JeffBezos",
        "SteveJobs"
    ],
    football: [
        "CristianoRonaldo",
        "LionelMessi",
        "Neymar",
        "KylianMbappe",
        "Pele"
    ],
    basketball: [
        "MichaelJordan",
        "LeBronJames",
        "KobeBryant",
        "StephenCurry",
        "ShaquilleONeal"
    ],
    tennis: [
        "RogerFederer",
        "RafaelNadal",
        "NovakDjokovic",
        "SerenaWilliams",
        "AndreAgassi"
    ],
    music: [
        "MichaelJackson",
        "TheBeatles",
        "ElvisPresley",
        "Madonna",
        "DavidBowie"
    ],
    acting: [
        "MerylStreep",
        "TomHanks",
        "DenzelWashington",
        "CateBlanchett",
        "LeonardoDiCaprio"
    ],
    science: [
        "AlbertEinstein",
        "StephenHawking",
        "MarieSkłodowskaCurie",
        "IsaacNewton",
        "CharlesDarwin"
    ]
} as const;

export type GoatCategory = keyof typeof GoatCategories;

export const generateMockMessages = (count: number = 10, username: string, subgroupName: string): Message[] => {
    return Array(count).fill(null).map((_, index) => {
        const date = new Date(Date.now() - (count - index) * 1000 * 60);
        return {
            content: `[${date.toLocaleString()}] ${username} in ${subgroupName}: Mock message ${index + 1} - This is a test message from ${username} in the ${subgroupName} subgroup.`,
            username: username,
            created_at: date.toISOString(),
            attachments: [],
            reactions: [],
        };
    });
};

export const generateMockSubgroup = (name: string) => ({
    name,
    type: 'c',  // channel type
    username: 'ElonMusk',  // default username
    description: `Channel for ${name}`,
    // Only include the fields needed for Rocket.Chat sync
    extraData: {
        broadcast: false,
        encrypted: false,
        teamId: null,
        teamMain: false
    }
});

// Synchronous version for mock data generation
export const generateMockGoatSync = (username: string, category: string): Goat => {
    // Generate a random color for demo category
    const getRandomColor = () => {
        const colors = ['FF5733', '33FF57', '3357FF', 'FF33F6', 'F6FF33', '33FFF6'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const color = category === 'demo' ? getRandomColor() : '808080';
    const textColor = category === 'demo' ? 'FFFFFF' : '000000';

    return {
        uid: uuidv4(),
        username,
        category,
        verified: Math.random() > 0.3,
        metadata_with_translations: {
            bio: {
                english: category === 'demo' ?
                    `Demo profile of ${username} - For testing purposes` :
                    `Official profile of ${username}`,
                hindi: "आधिकारिक प्रोफ़ाइल",
                telugu: "అధికారిక ప్రొఫైల్"
            },
            name: {
                english: username.replace(/([A-Z])/g, ' $1').trim(),
                hindi: "आधिकारिक नाम",
                telugu: "అధికారిక పేరు"
            }
        },
        img_url: `https://placehold.co/150/${color}/${textColor}?text=${username}`,
        cover_url: `https://placehold.co/600x200/${color}/${textColor}?text=${username}`,
    };
};

// Async version for actual creation with subgroups and messages
export const generateMockGoat = async (username: string, category: GoatCategory, supabase: any): Promise<any> => {
    return {
        uid: crypto.randomUUID(),
        username: username,
        verified: true,
        metadata_with_translations: {
            name: { english: username },
            bio: { english: `This is ${username}'s profile` }
        },
        img_url: '',
        cover_url: '',
        category: category,
        is_premium: false,
        tags: [],
        entity_type: [],
        blocked_profile_ids: [],
        latest_message: null
    };
};

export const generateMockGoatCategory = (category: GoatCategory): GoatCategoryData => {
    return {
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        description: `Collection of ${category} personalities`,
        goats: GoatCategories[category].map(goatName =>
            generateMockGoatSync(goatName, category)
        )
    };
};

export const generateAllMockData = () => {
    const subgroups: any[] = [
        generateMockSubgroup('spacex-updates'),
        generateMockSubgroup('tesla-news'),
        generateMockSubgroup('twitter-x')
    ];

    return {
        subgroups
    };
};
