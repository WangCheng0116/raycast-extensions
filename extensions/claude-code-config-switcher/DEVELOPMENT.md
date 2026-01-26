# Development Guide

## Project Status

The Claude Code Config Switcher Raycast extension has been successfully built with all core features implemented:

- ✅ Profile management (create, edit, delete, duplicate, switch)
- ✅ MCP server configuration management
- ✅ Config file reading and writing utilities
- ✅ Local storage for profiles
- ✅ Auto-backup functionality
- ✅ User preferences support
- ✅ Three commands: Manage Profiles, Quick Switch, and Manage MCP Servers

## Testing the Extension

### Development Mode
To test the extension in Raycast:

```bash
npm run dev
```

This will load the extension into Raycast in development mode with hot reloading enabled.

### Building for Production
```bash
npm run build
```

## Missing Items

### 1. Extension Icon (Required)
The extension currently has a placeholder icon note in `assets/ICON_TODO.md`. You need to:

1. Create a 512x512 PNG icon named `icon.png` in the `assets/` directory
2. The icon should represent Claude Code configuration switching
3. Optionally create `icon@dark.png` for dark mode

**Quick Solution:**
You can temporarily use a system icon or generate one using:
- DALL-E or similar AI image generator
- Figma or other design tools
- The Raycast CLI: `ray icon` (if available)

### 2. Testing Checklist

Before publishing, test these scenarios:

**Profile Management:**
- [ ] Create a new profile with all fields
- [ ] Edit an existing profile
- [ ] Delete a profile
- [ ] Duplicate a profile
- [ ] Switch between profiles (verify config file is updated)
- [ ] Test with empty profiles list

**MCP Server Management:**
- [ ] Add a new STDIO server
- [ ] Add HTTP/SSE servers
- [ ] Edit a server configuration
- [ ] Enable/disable a server
- [ ] Delete a server
- [ ] Test with environment variables and arguments

**Preferences:**
- [ ] Change config file path
- [ ] Toggle auto-backup on/off
- [ ] Toggle confirmation dialog on/off

**Error Handling:**
- [ ] Test with non-existent config file
- [ ] Test with malformed JSON in config
- [ ] Test with read-only config file
- [ ] Test with invalid profile data

## Development Commands

```bash
# Install dependencies
npm install

# Start development mode (hot reload)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Auto-fix lint issues
npm run fix-lint

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── components/              # React components
│   ├── CreateProfileForm.tsx
│   ├── EditProfileForm.tsx
│   ├── AddMcpServerForm.tsx
│   └── EditMcpServerForm.tsx
├── utils/                   # Utility functions
│   ├── config.ts            # Config file I/O
│   ├── storage.ts           # Profile storage
│   └── profile-switcher.ts  # Profile switching logic
├── types.ts                 # TypeScript types
├── index.tsx                # Main profile management command
├── switch-profile.tsx       # Quick switch command
└── manage-mcp.tsx           # MCP server management command
```

## Architecture

### Storage
- **Profiles**: Stored in Raycast LocalStorage as JSON
- **Active Profile**: Tracked separately in LocalStorage
- **Config Files**: Read/written directly to filesystem (`~/.claude/settings.json`)

### Configuration Hierarchy
The extension respects Claude Code's configuration hierarchy:
1. User-level: `~/.claude/settings.json` (default)
2. Project-level: `.claude/settings.json` (customizable)
3. Local: `.claude/settings.local.json` (customizable)

### Profile Structure
Each profile contains:
- Unique ID (generated)
- Name and description
- Claude Code configuration (API key, model, custom instructions, MCP servers, etc.)
- Timestamps (created, updated)

### Profile Switching Flow
1. (Optional) Backup current config with timestamp
2. Write profile config to Claude Code settings file
3. Mark profile as active in LocalStorage
4. Show success notification

## Known Limitations

1. **No Real-time Sync**: Profiles are snapshots and don't auto-update when Claude Code config changes
2. **Single Config File**: Currently focuses on user-level config (`~/.claude/settings.json`)
3. **No Cloud Sync**: Profiles are stored locally only
4. **No Import/Export UI**: While functions exist, there's no UI for backup/restore

## Future Enhancements

Potential features to add:
- [ ] Import current Claude Code config as a new profile
- [ ] Export/import profiles for backup/sharing
- [ ] Profile tags/categories
- [ ] Search and filter profiles
- [ ] Recent profiles list
- [ ] Profile templates
- [ ] Config diff view before switching
- [ ] Support for project-level configs
- [ ] Skills management (like CC Switch)
- [ ] Speed testing for API endpoints
- [ ] GitHub integration for Claude skills

## Publishing to Raycast Store

When ready to publish:

1. Ensure all required items are complete:
   - [x] Extension icon (512x512 PNG)
   - [x] README with clear description
   - [x] All commands tested
   - [x] No TypeScript errors
   - [x] Proper package.json metadata

2. Follow Raycast's publishing guide:
   ```bash
   npm run publish
   ```

3. Submit PR to https://github.com/raycast/extensions

## Troubleshooting

### Build Errors
- Ensure Node.js version is compatible (v14+)
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript version compatibility

### Extension Not Loading
- Verify Raycast is up to date
- Check console for errors: `CMD + Shift + .`
- Restart Raycast

### Config File Issues
- Verify path in preferences
- Check file permissions
- Ensure `.claude` directory exists

## Contributing

To contribute to this extension:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details
