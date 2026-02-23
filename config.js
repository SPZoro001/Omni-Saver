// Configuration file for the Telegram Video Downloader Bot

module.exports = {
    // Telegram Bot Token - Get this from @BotFather on Telegram
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8437146720:AAHKQh6bOeOnsvvEr2Q060UTpku-9U5_BCA',
    
    // Download settings
    DOWNLOAD_DIR: './downloads',
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB (Telegram limit for bots)
    
    // API Keys (optional, for better download quality)
    // You can get these from respective services
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || '',
    
    // Timeout settings (in milliseconds)
    DOWNLOAD_TIMEOUT: 120000, // 2 minutes
    
    // Supported platforms
    SUPPORTED_PLATFORMS: [
        'Instagram',
        'Terabox',
        'TikTok',
        'Facebook',
        'Twitter',
        'YouTube',
        'Reddit',
        'Pinterest'
    ]
};
