export interface Message {
    content: string;
    username: string;
    created_at: string;
    channel_message?: any;
    attachments?: any[];
    reactions?: any[];
}

export interface Subgroup {
    stream_id?: any;
    username: string;
    verified: boolean;
    metadata_with_translations: {
        bio: {
            english: string;
            hindi?: string;
            telugu?: string;
        };
        name: {
            english: string;
            hindi?: string;
            telugu?: string;
        };
    };
    img_url: string;
    cover_url: string;
    category: string;
    is_premium: boolean;
    is_locked: boolean;
    is_public: boolean;
    is_realtime: boolean;
    is_published: boolean;
    owner_username: string;
    is_secondary_stream: boolean;
    is_party: boolean;
    is_historical: boolean;
    is_open: boolean;
    is_demo: boolean;
    tags: string[];
    entity_type: string[];
    blocked_profile_ids: string[];
    latest_message: Message | null;
    is_subgroup: boolean;
}

export interface RocketChannel {
    _id: string;
    name: string;
    messagesCount: number;
    lastMessage: any;
    t: string; // channel type ('c' for channel)
}

export type SubgroupOrChannel = Subgroup | RocketChannel | any;

export interface Goat {
    uid: string;
    username: string;
    category: string;
    verified: boolean;
    metadata_with_translations: {
        bio: {
            english: string;
            hindi?: string;
            telugu?: string;
        };
        name: {
            english: string;
            hindi?: string;
            telugu?: string;
        };
    };
    img_url: string;
    cover_url: string;
    subgroups_count?: number;
}

export interface GoatCategoryData {
    id: string;
    name: string;
    description: string;
    goats: Goat[];
}

export interface SupabaseClient {
    from: (table: string) => {
        select: (query?: string) => Promise<{ data: any; error: any }>;
        insert: (data: any) => Promise<{ data: any; error: any }>;
        upsert: (data: any, options?: { onConflict: string }) => Promise<{ data: any; error: any }>;
        delete: () => Promise<{ data: any; error: any }>;
        eq: (column: string, value: any) => any;
        not: (column: string, operator: string, value: any) => any;
        match: (query: any) => Promise<{ data: any; error: any }>;
        order: (column: string, options: { ascending: boolean }) => any;
    };
} 