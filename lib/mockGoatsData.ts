import { Message, Subgroup, Goat, GoatCategoryData } from './types/goat';
import { v4 as uuidv4 } from 'uuid';
import { SUBGROUP_CATEGORIES } from '@/components/GoatsCRUD';

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
    cricket: [
        "SachinTendulkar",
        "ViratKohli",
        "SteveSmith",
        "BenStokes",
        "KaneWilliamson"
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

export const generateMockSubgroup = (ownerUsername: string, category: string): Subgroup => {
    const username = `${ownerUsername}_${category}`.toLowerCase();
    const capitalizedName = category.charAt(0).toUpperCase() + category.slice(1);

    // Generate a random color for demo category
    const getRandomColor = () => {
        const colors = ['FF5733', '33FF57', '3357FF', 'FF33F6', 'F6FF33', '33FFF6'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const color = ownerUsername.includes('Demo') ? getRandomColor() : '808080';
    const textColor = ownerUsername.includes('Demo') ? 'FFFFFF' : '000000';

    return {
        username,
        verified: Math.random() > 0.5,
        metadata_with_translations: {
            bio: {
                english: `Official ${capitalizedName} group for ${ownerUsername}`,
                hindi: "यादृच्छिक बायो",
                telugu: "యాదృచ్ఛిక జీవితం"
            },
            name: {
                english: capitalizedName,
                hindi: "यादृच्छिक नाम",
                telugu: "యాదృచ్ఛిక పేరు"
            }
        },
        img_url: `https://placehold.co/150/${color}/${textColor}?text=${username}`,
        cover_url: `https://placehold.co/600x200/${color}/${textColor}?text=${username}`,
        category: category,
        is_premium: true,
        is_locked: true,
        is_public: false,
        is_realtime: true,
        is_published: true,
        is_subgroup: true,
        owner_username: ownerUsername,
        is_secondary_stream: false,
        is_party: false,
        is_historical: false,
        is_open: true,
        is_demo: ownerUsername.includes('Demo'),
        tags: [],
        entity_type: [],
        blocked_profile_ids: [],
        latest_message: null
    };
};

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
export const generateMockGoat = async (username: string, category: string, supabase: any): Promise<Goat> => {
    // Step 1: Create the goat
    const goat = generateMockGoatSync(username, category);

    const { data: goatData, error: goatError } = await supabase
        .from("user_profiles")
        .upsert([goat], {
            onConflict: 'uid',
        })
        .select()
        .single();

    if (goatError) {
        console.error('Error creating goat:', goatError);
        throw goatError;
    }

    // Step 3: Create standard subgroups from SUBGROUP_CATEGORIES
    const createdSubgroups = []; // Include public subgroup in the list

    for (const { id: type } of SUBGROUP_CATEGORIES) {
        const subgroup = generateMockSubgroup(username, type);

        const { data: subgroupData, error: subgroupError } = await supabase
            .from("sub_groups")
            .insert([{
                ...subgroup,
                is_published: true
            }])
            .select()
            .single();

        if (subgroupError) {
            console.error(`Error creating subgroup ${type}:`, subgroupError);
            continue;
        }

        createdSubgroups.push(subgroupData);
    }
    return goat;
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
    // Always include demo goats and other selected goats
    const allGoats = [
        // Demo category goats
        { category: 'demo' as GoatCategory, username: 'ElonMusk' },
        { category: 'demo' as GoatCategory, username: 'JaneDoe' },
        { category: 'demo' as GoatCategory, username: 'JohnDoe' },
        // Other categories
        { category: 'technology' as GoatCategory, username: 'BillGates' },
        { category: 'cricket' as GoatCategory, username: 'SachinTendulkar' },
        { category: 'football' as GoatCategory, username: 'CristianoRonaldo' },
        { category: 'basketball' as GoatCategory, username: 'MichaelJordan' },
        { category: 'tennis' as GoatCategory, username: 'RogerFederer' },
        { category: 'music' as GoatCategory, username: 'MichaelJackson' },
        { category: 'acting' as GoatCategory, username: 'TomHanks' },
        { category: 'science' as GoatCategory, username: 'AlbertEinstein' },
        { category: 'technology' as GoatCategory, username: 'MarkZuckerberg' }
    ];

    // Create a map to store goats by category
    const categorizedGoats = allGoats.reduce((acc, { category, username }) => {
        if (!acc[category]) {
            acc[category] = {
                id: category,
                name: category.charAt(0).toUpperCase() + category.slice(1),
                description: category === 'demo' ?
                    'Demo profiles for testing purposes' :
                    `Collection of ${category} personalities`,
                goats: []
            };
        }
        acc[category].goats.push(generateMockGoatSync(username, category));
        return acc;
    }, {} as Record<GoatCategory, GoatCategoryData>);

    return categorizedGoats;
};
