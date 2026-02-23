const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Create downloads directory if it doesn't exist
if (!fs.existsSync(config.DOWNLOAD_DIR)) {
    fs.mkdirSync(config.DOWNLOAD_DIR, { recursive: true });
}

/**
 * Main download function that routes to appropriate downloader
 */
async function downloadVideo(url, platform) {
    try {
        switch (platform) {
            case 'Instagram':
                return await downloadInstagram(url);
            case 'Terabox':
                return await downloadTerabox(url);
            case 'TikTok':
                return await downloadTikTok(url);
            case 'Facebook':
                return await downloadFacebook(url);
            case 'Twitter':
                return await downloadTwitter(url);
            case 'YouTube':
                return await downloadYouTube(url);
            default:
                return await downloadGeneric(url, platform);
        }
    } catch (error) {
        console.error(`Error downloading from ${platform}:`, error);
        return {
            success: false,
            error: error.message || 'Download failed'
        };
    }
}

/**
 * Download Instagram videos using API
 */
async function downloadInstagram(url) {
    try {
        // Using a free Instagram downloader API
        const apiUrl = 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index';
        
        const options = {
            method: 'GET',
            url: apiUrl,
            params: { url: url },
            headers: {
                'X-RapidAPI-Key': config.RAPIDAPI_KEY || 'demo-key',
                'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
            },
            timeout: config.DOWNLOAD_TIMEOUT
        };
        
        const response = await axios.request(options);
        
        if (response.data && response.data.media) {
            return {
                success: true,
                videoUrl: response.data.media,
                title: response.data.title || 'Instagram Video',
                duration: response.data.duration || 'N/A'
            };
        }
        
        // Fallback method
        return await downloadGeneric(url, 'Instagram');
        
    } catch (error) {
        console.error('Instagram download error:', error);
        return {
            success: false,
            error: 'Failed to download Instagram video. The video might be private or the link is invalid.'
        };
    }
}

/**
 * Download Terabox videos
 */
async function downloadTerabox(url) {
    try {
        // Terabox downloader API
        const apiUrl = 'https://terabox-downloader-direct-download-link-generator.p.rapidapi.com/fetch';
        
        const options = {
            method: 'GET',
            url: apiUrl,
            params: { url: url },
            headers: {
                'X-RapidAPI-Key': config.RAPIDAPI_KEY || 'demo-key',
                'X-RapidAPI-Host': 'terabox-downloader-direct-download-link-generator.p.rapidapi.com'
            },
            timeout: config.DOWNLOAD_TIMEOUT
        };
        
        const response = await axios.request(options);
        
        if (response.data && response.data.downloadLink) {
            return {
                success: true,
                videoUrl: response.data.downloadLink,
                title: response.data.fileName || 'Terabox Video',
                duration: 'N/A'
            };
        }
        
        return {
            success: false,
            error: 'Could not extract Terabox download link'
        };
        
    } catch (error) {
        console.error('Terabox download error:', error);
        return {
            success: false,
            error: 'Failed to download Terabox video. Please check the link and try again.'
        };
    }
}

/**
 * Download TikTok videos
 */
async function downloadTikTok(url) {
    try {
        // TikTok downloader API
        const apiUrl = 'https://tiktok-video-no-watermark2.p.rapidapi.com/';
        
        const options = {
            method: 'GET',
            url: apiUrl,
            params: {
                url: url,
                hd: '1'
            },
            headers: {
                'X-RapidAPI-Key': config.RAPIDAPI_KEY || 'demo-key',
                'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
            },
            timeout: config.DOWNLOAD_TIMEOUT
        };
        
        const response = await axios.request(options);
        
        if (response.data && response.data.data && response.data.data.play) {
            return {
                success: true,
                videoUrl: response.data.data.play,
                title: response.data.data.title || 'TikTok Video',
                duration: response.data.data.duration || 'N/A'
            };
        }
        
        return {
            success: false,
            error: 'Could not extract TikTok video'
        };
        
    } catch (error) {
        console.error('TikTok download error:', error);
        return {
            success: false,
            error: 'Failed to download TikTok video.'
        };
    }
}

/**
 * Download Facebook videos
 */
async function downloadFacebook(url) {
    try {
        const apiUrl = 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php';
        
        const options = {
            method: 'GET',
            url: apiUrl,
            params: { url: url },
            headers: {
                'X-RapidAPI-Key': config.RAPIDAPI_KEY || 'demo-key',
                'X-RapidAPI-Host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
            },
            timeout: config.DOWNLOAD_TIMEOUT
        };
        
        const response = await axios.request(options);
        
        if (response.data && response.data.links && response.data.links.length > 0) {
            return {
                success: true,
                videoUrl: response.data.links[0].url,
                title: response.data.title || 'Facebook Video',
                duration: 'N/A'
            };
        }
        
        return {
            success: false,
            error: 'Could not extract Facebook video'
        };
        
    } catch (error) {
        console.error('Facebook download error:', error);
        return {
            success: false,
            error: 'Failed to download Facebook video.'
        };
    }
}

/**
 * Download Twitter/X videos
 */
async function downloadTwitter(url) {
    try {
        const apiUrl = 'https://twitter-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com/status';
        
        const options = {
            method: 'GET',
            url: apiUrl,
            params: { url: url },
            headers: {
                'X-RapidAPI-Key': config.RAPIDAPI_KEY || 'demo-key',
                'X-RapidAPI-Host': 'twitter-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com'
            },
            timeout: config.DOWNLOAD_TIMEOUT
        };
        
        const response = await axios.request(options);
        
        if (response.data && response.data.media && response.data.media.video) {
            const videos = response.data.media.video.videoVariants;
            // Get highest quality video
            const bestVideo = videos.reduce((prev, current) => 
                (prev.bitrate > current.bitrate) ? prev : current
            );
            
            return {
                success: true,
                videoUrl: bestVideo.url,
                title: 'Twitter Video',
                duration: 'N/A'
            };
        }
        
        return {
            success: false,
            error: 'Could not extract Twitter video'
        };
        
    } catch (error) {
        console.error('Twitter download error:', error);
        return {
            success: false,
            error: 'Failed to download Twitter video.'
        };
    }
}

/**
 * Download YouTube videos
 */
async function downloadYouTube(url) {
    try {
        const apiUrl = 'https://youtube-mp36.p.rapidapi.com/dl';
        
        const options = {
            method: 'GET',
            url: apiUrl,
            params: { id: extractYouTubeId(url) },
            headers: {
                'X-RapidAPI-Key': config.RAPIDAPI_KEY || 'demo-key',
                'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
            },
            timeout: config.DOWNLOAD_TIMEOUT
        };
        
        const response = await axios.request(options);
        
        if (response.data && response.data.link) {
            return {
                success: true,
                videoUrl: response.data.link,
                title: response.data.title || 'YouTube Video',
                duration: 'N/A'
            };
        }
        
        return {
            success: false,
            error: 'Could not extract YouTube video'
        };
        
    } catch (error) {
        console.error('YouTube download error:', error);
        return {
            success: false,
            error: 'Failed to download YouTube video.'
        };
    }
}

/**
 * Generic downloader for other platforms
 */
async function downloadGeneric(url, platform) {
    try {
        // Try to use a universal video downloader API
        const apiUrl = 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/all';
        
        const options = {
            method: 'GET',
            url: apiUrl,
            params: { url: url },
            headers: {
                'X-RapidAPI-Key': config.RAPIDAPI_KEY || 'demo-key',
                'X-RapidAPI-Host': 'social-media-video-downloader.p.rapidapi.com'
            },
            timeout: config.DOWNLOAD_TIMEOUT
        };
        
        const response = await axios.request(options);
        
        if (response.data && response.data.links && response.data.links.length > 0) {
            return {
                success: true,
                videoUrl: response.data.links[0],
                title: `${platform} Video`,
                duration: 'N/A'
            };
        }
        
        return {
            success: false,
            error: `Could not download video from ${platform}`
        };
        
    } catch (error) {
        console.error('Generic download error:', error);
        return {
            success: false,
            error: 'Failed to download video.'
        };
    }
}

/**
 * Helper function to extract YouTube video ID
 */
function extractYouTubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

/**
 * Download file from URL to local storage
 */
async function downloadFile(url, filename) {
    const filePath = path.join(config.DOWNLOAD_DIR, filename);
    const writer = fs.createWriteStream(filePath);
    
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: config.DOWNLOAD_TIMEOUT
    });
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
    });
}

module.exports = {
    downloadVideo,
    downloadFile
};
