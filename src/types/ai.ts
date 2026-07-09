export type UserProfileType = 'erkaklarga' | 'ayollarga' | 'homiladorlarga' | 'bolalarga';
export type KnowledgeDirectionType = 'taomlanish' | 'sport' | 'shariat';

export interface YouTubeVideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface AIContentResponse {
  aiGeneratedText: string;
  sourceLinks: string[];
  youtubeVideos: YouTubeVideoItem[];
} это код