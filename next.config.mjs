/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'drive.google.com',
            'photos.thedyrt.com',     // for the Mountain View Campground image
            'images.squarespace-cdn.com', // for the Lake Tahoe KOA images
            'live.staticflickr.com'   // for the Acadia National Park Campground image
        ]
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
};

export default nextConfig;