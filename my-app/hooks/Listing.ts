export interface Listing {
    id: number;                // Unique identifier for the listing
    title: string;             // Title of the listing
    price: number;             // Price of the listing
    imageUrl?: string;         // URL of the main image (optional)
    imageUrls?: string[];      // Array of image URLs (optional)
    category: string;          // Category of the listing
    description?: string;  
}