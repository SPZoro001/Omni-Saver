const TelegramBot = require('node-telegram-bot-api');
const { downloadVideo } = require('./downloaders');
const config = require('./config');

// Create bot instance
const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('Bot is running...');

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `
🎥 *Welcome to Video Downloader Bot!*

I can help you download videos from:
• Instagram (Posts, Reels, Stories)
• Terabox
• TikTok
• Facebook
• Twitter/X
• YouTube
• And many more!

*How to use:*
Just send me a link to any video and I'll download it for you!

*Commands:*
/start - Show this message
/help - Get help
/about - About this bot
    `;
    
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// Help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
📖 *Help*

*Supported Platforms:*
✅ Instagram
✅ Terabox
✅ TikTok
✅ Facebook
✅ Twitter/X
✅ YouTube
✅ Reddit
✅ Pinterest

*How to download:*
1. Copy the video link from any supported platform
2. Send the link to me
3. Wait for the download to complete
4. Receive your video!

*Tips:*
• Make sure the link is valid and accessible
• Some platforms may have restrictions on private content
• Large files may take longer to process
    `;
    
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// About command
bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;
    const aboutMessage = `
ℹ️ *About Video Downloader Bot*

This bot helps you download videos from various social media platforms quickly and easily.

Version: 1.0.0
Developer: Your Name

*Privacy:*
We don't store your videos or links. Everything is processed in real-time.
    `;
    
    bot.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
});

// Handle URL messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Skip if it's a command
    if (!text || text.startsWith('/')) {
        return;
    }
    
    // Check if message contains a URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    
    if (!urls || urls.length === 0) {
        bot.sendMessage(chatId, '❌ Please send a valid video link.');
        return;
    }
    
    const url = urls[0];
    
    // Detect platform
    const platform = detectPlatform(url);
    
    if (!platform) {
        bot.sendMessage(chatId, '❌ Sorry, this platform is not supported yet.');
        return;
    }
    
    // Send processing message
    const processingMsg = await bot.sendMessage(
        chatId, 
        `⏳ Processing your ${platform} video...\nPlease wait...`
    );
    
    try {
        // Download video
        const result = await downloadVideo(url, platform);
        
        if (result.success) {
            // Delete processing message
            await bot.deleteMessage(chatId, processingMsg.message_id);
            
            // Send video info
            await bot.sendMessage(
                chatId,
                `✅ *Video Downloaded!*\n\n📱 Platform: ${platform}\n📹 Title: ${result.title || 'N/A'}\n⏱️ Duration: ${result.duration || 'N/A'}`,
                { parse_mode: 'Markdown' }
            );
            
            // Send the video file
            if (result.videoPath) {
                await bot.sendVideo(chatId, result.videoPath, {
                    caption: `Downloaded from ${platform}`,
                    supports_streaming: true
                });
            } else if (result.videoUrl) {
                // If we have a direct URL instead of a file
                await bot.sendMessage(
                    chatId,
                    `🔗 *Download Link:*\n${result.videoUrl}`,
                    { parse_mode: 'Markdown' }
                );
            }
        } else {
            await bot.editMessageText(
                `❌ Failed to download video.\n\nError: ${result.error || 'Unknown error'}`,
                {
                    chat_id: chatId,
                    message_id: processingMsg.message_id
                }
            );
        }
    } catch (error) {
        console.error('Error:', error);
        await bot.editMessageText(
            `❌ An error occurred while processing your request.\n\nPlease try again later.`,
            {
                chat_id: chatId,
                message_id: processingMsg.message_id
            }
        );
    }
});

// Detect platform from URL
function detectPlatform(url) {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('instagram.com')) return 'Instagram';
    if (lowerUrl.includes('terabox.com') || lowerUrl.includes('1024tera.com')) return 'Terabox';
    if (lowerUrl.includes('tiktok.com')) return 'TikTok';
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) return 'Facebook';
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'Twitter';
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'YouTube';
    if (lowerUrl.includes('reddit.com')) return 'Reddit';
    if (lowerUrl.includes('pinterest.com')) return 'Pinterest';
    
    return null;
}

// Error handling
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});
