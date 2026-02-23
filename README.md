# Telegram Video Downloader Bot 🎥

A powerful Telegram bot that downloads videos from various social media platforms including Instagram, Terabox, TikTok, Facebook, Twitter/X, YouTube, and more!

## Features ✨

- 📱 **Multi-Platform Support**: Download videos from:
  - Instagram (Posts, Reels, Stories)
  - Terabox
  - TikTok
  - Facebook
  - Twitter/X
  - YouTube
  - Reddit
  - Pinterest
  - And more!

- 🚀 **Easy to Use**: Just send a link and get your video
- ⚡ **Fast Processing**: Quick video downloads
- 🔒 **Privacy Focused**: No data storage, real-time processing
- 💯 **Free & Open Source**

## Prerequisites 📋

Before you begin, ensure you have:

- Node.js (v14 or higher)
- npm or yarn
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- (Optional) RapidAPI Key for better download quality

## Installation 🛠️

1. **Clone or download this project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure the bot**:
   
   Open `config.js` and add your Telegram Bot Token:
   ```javascript
   TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE'
   ```

   Or create a `.env` file:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   RAPIDAPI_KEY=your_rapidapi_key_here (optional)
   ```

## Getting Your Bot Token 🤖

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the token provided by BotFather
5. Paste it in `config.js` or `.env` file

## Getting RapidAPI Key (Optional) 🔑

For better download quality and reliability:

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up for a free account
3. Subscribe to these APIs (free tier available):
   - Instagram Downloader
   - Terabox Downloader
   - TikTok Downloader
   - Social Media Video Downloader
4. Copy your API key
5. Add it to `config.js` or `.env` file

## Usage 🚀

1. **Start the bot**:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

2. **Open Telegram** and search for your bot

3. **Send a video link** from any supported platform

4. **Wait for the download** and receive your video!

## Bot Commands 📝

- `/start` - Start the bot and see welcome message
- `/help` - Get help and see supported platforms
- `/about` - About the bot

## How It Works 🔧

1. User sends a video link to the bot
2. Bot detects the platform (Instagram, Terabox, etc.)
3. Bot fetches the video using appropriate API
4. Bot sends the video back to the user

## Project Structure 📁

```
telegram-video-downloader/
├── bot.js              # Main bot logic
├── config.js           # Configuration settings
├── downloaders.js      # Video download handlers
├── package.json        # Dependencies
├── README.md          # Documentation
└── downloads/         # Temporary download folder (auto-created)
```

## Supported Platforms 🌐

✅ Instagram
✅ Terabox
✅ TikTok
✅ Facebook
✅ Twitter/X
✅ YouTube
✅ Reddit
✅ Pinterest

## Troubleshooting 🔍

### Bot not responding
- Check if your bot token is correct
- Make sure the bot is running (`npm start`)
- Check your internet connection

### Download fails
- Verify the link is valid and accessible
- Some platforms may block private content
- Try getting a RapidAPI key for better reliability

### "Platform not supported" error
- Make sure the URL is from a supported platform
- Check if the URL format is correct

## Limitations ⚠️

- Telegram bots can only send files up to 50MB
- Some platforms may have restrictions on private content
- Download speed depends on your internet connection
- Free API tiers have rate limits

## Deployment Options 🌍

### Local Machine
```bash
npm start
```

### Cloud Platforms
- **Heroku**: Deploy using Git
- **Railway**: Connect GitHub repo
- **Render**: Deploy from GitHub
- **VPS**: Use PM2 for process management

### Using PM2 (Recommended for VPS)
```bash
npm install -g pm2
pm2 start bot.js --name telegram-bot
pm2 save
pm2 startup
```

## Contributing 🤝

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## License 📄

This project is licensed under the MIT License.

## Disclaimer ⚖️

This bot is for educational purposes only. Please respect copyright laws and terms of service of the platforms you're downloading from. Only download content you have permission to download.

## Support 💬

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the documentation
3. Open an issue on GitHub

## Credits 🙏

- Built with [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- Uses various RapidAPI services for video downloads

---

**Happy Downloading! 🎉**
