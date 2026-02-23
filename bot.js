const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Get token from environment variable or replace with your actual token
const token = process.env.TELEGRAM_BOT_TOKEN || '8471467201:AAHKGnoo4eosnsvFPYZQG60d7pkau-9nP_BCA';
const bot = new TelegramBot(token, { polling: true });

// TeraBox link patterns
const teraboxPattern = /https?:\/\/(www\.)?(teraboxshare\.com|terabox\.app|terabox\.com|1024tera\.com|4funbox\.com)\/s\/[a-zA-Z0-9_-]+/i;

// TeraBox API function with multiple fallbacks
async function downloadTeraBoxVideo(url) {
    try {
        console.log('Processing TeraBox URL:', url);
        
        // API endpoints to try
        const apis = [
            {
                name: 'TeraBox API 1',
                url: 'https://terabox-dl.qtcloud.workers.dev/api/get-info',
                method: 'POST'
            },
            {
                name: 'TeraBox API 2', 
                url: 'https://teraboxvideodownloader.nepcoderdevs.workers.dev/',
                method: 'GET'
            },
            {
                name: 'TeraBox API 3',
                url: 'https://api.terabox.hnn.workers.dev/api/download',
                method: 'POST'
            }
        ];

        for (const api of apis) {
            try {
                console.log(`Trying ${api.name}...`);
                
                let response;
                
                if (api.method === 'POST') {
                    response = await axios.post(api.url, 
                        { url: url }, 
                        {
                            headers: { 
                                'Content-Type': 'application/json',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            },
                            timeout: 30000
                        }
                    );
                } else {
                    response = await axios.get(`${api.url}?url=${encodeURIComponent(url)}`, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        },
                        timeout: 30000
                    });
                }

                console.log(`${api.name} response:`, response.data);

                // Handle different response formats
                if (response.data) {
                    let downloadUrl = null;
                    let filename = 'TeraBox Video';
                    let size = 'Unknown';

                    // Check various response formats
                    if (response.data.downloadLink) {
                        downloadUrl = response.data.downloadLink;
                        filename = response.data.filename || response.data.title || filename;
                        size = response.data.size || size;
                    } else if (response.data.download_url) {
                        downloadUrl = response.data.download_url;
                        filename = response.data.title || response.data.name || filename;
                        size = response.data.size || size;
                    } else if (response.data.result && response.data.result.download_url) {
                        downloadUrl = response.data.result.download_url;
                        filename = response.data.result.title || filename;
                        size = response.data.result.size || size;
                    } else if (response.data.data && response.data.data.downloadUrl) {
                        downloadUrl = response.data.data.downloadUrl;
                        filename = response.data.data.filename || filename;
                        size = response.data.data.size || size;
                    }

                    if (downloadUrl) {
                        console.log(`Success with ${api.name}!`);
                        return {
                            success: true,
                            downloadUrl: downloadUrl,
                            filename: filename,
                            size: size,
                            apiUsed: api.name
                        };
                    }
                }
                
            } catch (apiError) {
                console.log(`${api.name} failed:`, apiError.message);
                continue;
            }
        }
        
        throw new Error('All APIs failed to extract download link');
        
    } catch (error) {
        console.error('Download error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.first_name || 'User';
    
    const welcomeMessage = `
🎬 *Welcome ${username} to TeraBox Downloader!*

I can download videos from TeraBox for you! 🚀

*✅ Supported platforms:*
• TeraBox.com
• TeraBoxShare.com  
• 1024TeraBox.com
• TeraBox.app
• 4FunBox.com

*📋 How to use:*
1️⃣ Copy any TeraBox sharing link
2️⃣ Send it to me
3️⃣ Wait for processing ⏳
4️⃣ Get your video! 📥

*🔗 Example link:*
\`https://teraboxshare.com/s/1dXgAGymx2LHF4OYTarPYzQ\`

Send me a TeraBox link now! 👇
    `;
    
    bot.sendMessage(chatId, welcomeMessage, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true 
    });
});

// Help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
📖 *TeraBox Downloader Help*

*🔗 Supported Links:*
• https://teraboxshare.com/s/...
• https://terabox.com/s/...
• https://terabox.app/s/...
• https://1024tera.com/s/...
• https://4funbox.com/s/...

*⚡ Commands:*
/start - Welcome message
/help - Show this help
/status - Check bot status

*💡 Tips:*
• Make sure TeraBox link is public
• Links should not be password protected  
• Processing can take 30-60 seconds
• Try again if first attempt fails

*❌ Troubleshooting:*
If download fails:
1. Verify link is accessible
2. Copy the complete sharing link
3. Wait and retry after few minutes
4. Check if file still exists on TeraBox

Made with ❤️ for easy downloads!
    `;
    
    bot.sendMessage(chatId, helpMessage, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true 
    });
});

// Status command
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const uptime = process.uptime();
    const uptimeString = Math.floor(uptime / 60) + ' minutes';
    
    bot.sendMessage(chatId, `✅ *Bot Status: Online*\n\n⏱️ Uptime: ${uptimeString}\n🤖 Ready to download TeraBox videos!\n\nSend me a link to test! 🚀`, { 
        parse_mode: 'Markdown' 
    });
});

// Handle all messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    // Skip commands and non-text messages
    if (!messageText || messageText.startsWith('/')) return;

    // Check for TeraBox links
    if (teraboxPattern.test(messageText)) {
        console.log('TeraBox link detected:', messageText);
        
        const processingMessage = await bot.sendMessage(
            chatId, 
            '🔄 *Processing TeraBox link...*\n\n⏳ Extracting video information\n📡 This may take up to 60 seconds', 
            { parse_mode: 'Markdown' }
        );

        try {
            // Extract the URL
            const urlMatch = messageText.match(teraboxPattern);
            const teraboxUrl = urlMatch[0];
            
            console.log('Extracted URL:', teraboxUrl);

            // Update status
            await bot.editMessageText(
                '🔍 *Analyzing TeraBox link...*\n\n📋 Connecting to servers\n⚡ Finding download link', 
                {
                    chat_id: chatId,
                    message_id: processingMessage.message_id,
                    parse_mode: 'Markdown'
                }
            );

            // Get download info
            const result = await downloadTeraBoxVideo(teraboxUrl);
            console.log('Download result:', result);

            if (result.success) {
                await bot.editMessageText(
                    '✅ *Video found! Preparing download...*\n\n🎬 Video ready\n📤 Uploading to Telegram...', 
                    {
                        chat_id: chatId,
                        message_id: processingMessage.message_id,
                        parse_mode: 'Markdown'
                    }
                );

                // Send the video
                await bot.sendVideo(chatId, result.downloadUrl, {
                    caption: `🎬 **${result.filename}**\n\n📊 Size: ${result.size}\n🔗 Source: TeraBox\n⚡ API: ${result.apiUsed}\n\n✅ *Download completed successfully!*`,
                    parse_mode: 'Markdown',
                    supports_streaming: true
                });

                // Delete processing message
                await bot.deleteMessage(chatId, processingMessage.message_id);

                // Send completion message
                bot.sendMessage(chatId, '🎉 *Download completed!*\n\nSend another TeraBox link for more downloads! 😊', { 
                    parse_mode: 'Markdown' 
                });

            } else {
                throw new Error(result.error || 'Failed to extract download link');
            }

        } catch (error) {
            console.error('Processing error:', error);
            
            const errorMsg = `❌ *Download Failed*\n\n🔸 **Error:** ${error.message}\n\n*💡 Try these solutions:*\n• Check if link is public and accessible\n• Verify the complete link was copied\n• Wait a few minutes and try again\n• Make sure file hasn't been deleted\n• Ensure it's a TeraBox sharing link\n\n*Need help?* Use /help command`;
            
            await bot.editMessageText(errorMsg, {
                chat_id: chatId,
                message_id: processingMessage.message_id,
                parse_mode: 'Markdown'
            });
        }
    } 
    // Handle other links
    else if (messageText.includes('http')) {
        bot.sendMessage(
            chatId, 
            '⚠️ *Unsupported Link Type*\n\nCurrently I only support **TeraBox** links.\n\n*✅ Supported:*\n• teraboxshare.com/s/...\n• terabox.com/s/...\n• terabox.app/s/...\n• 1024tera.com/s/...\n\nPlease send a valid TeraBox sharing link! 📎', 
            { parse_mode: 'Markdown' }
        );
    }
    // Handle text messages
    else {
        bot.sendMessage(
            chatId,
            '👋 Hello! I\'m your TeraBox downloader bot.\n\n🔗 Send me a TeraBox sharing link and I\'ll download the video for you!\n\n📋 Use /start for instructions or /help for more info.',
            { parse_mode: 'Markdown' }
        );
    }
});

// Error handling
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

// Success startup message
console.log('🤖 TeraBox Downloader Bot Started!');
console.log('📡 Polling for messages...');
console.log('✅ Bot is ready to process TeraBox links!');
