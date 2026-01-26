# Testing Guide

## Current Status
✅ Extension is running in development mode
✅ Icon added (placeholder)
✅ All 3 commands available

## How to Test in Raycast

### 1. Open Raycast
Press `⌘ + Space` (or your Raycast hotkey)

### 2. Access Extension Commands

**Option A: Search by Name**
- Type "Manage Profiles"
- Type "Quick Switch Profile"
- Type "Manage MCP Servers"

**Option B: Browse Extensions**
- Type "Extensions"
- Find "Claude Code Config Switcher"
- See all available commands

### 3. Testing Checklist

#### Create Your First Profile
- [ ] Open "Manage Profiles"
- [ ] Select "Create New Profile" at the bottom
- [ ] Fill in form:
  - Name: "Production"
  - Description: "My production config"
  - API Key: (your key or leave blank)
  - Model: Select "Claude Sonnet 4.5"
  - Custom Instructions: (optional)
- [ ] Press `⌘ + Enter` to create
- [ ] Verify profile appears with green "Active" badge

#### Test Profile Actions
- [ ] `⌘ + E` - Edit the profile (change description)
- [ ] `⌘ + D` - Duplicate the profile (creates "Production (Copy)")
- [ ] Create a second profile named "Development"
- [ ] Switch to "Development" profile (should see toast notification)
- [ ] Verify "Development" now has green "Active" badge
- [ ] Switch back to "Production"
- [ ] `⌘ + Backspace` - Delete "Production (Copy)" profile

#### Test MCP Server Management
- [ ] Open "Manage MCP Servers"
- [ ] Should see empty view if no servers configured
- [ ] Select "Add New MCP Server"
- [ ] Configure a test server:
  - Name: "filesystem"
  - Transport: STDIO
  - Command: "node"
  - Arguments: "/path/to/mcp-server.js" (one per line)
- [ ] Verify server appears in list
- [ ] Click on server, test these actions:
  - [ ] Disable server (icon should turn gray)
  - [ ] Enable server again
  - [ ] `⌘ + E` - Edit server configuration
  - [ ] `⌘ + Backspace` - Delete server

#### Test Quick Switch Command
- [ ] Create 2-3 different profiles
- [ ] Search for "Quick Switch Profile"
- [ ] Verify all profiles are listed
- [ ] Current active profile has green badge
- [ ] Select a different profile
- [ ] Verify success toast appears
- [ ] Re-open command to confirm active profile changed

### 4. Verify Config File Updates

After switching profiles, check if the config file actually changed:

```bash
# View current Claude Code config
cat ~/.claude/settings.json

# Watch for changes in real-time (run in terminal)
watch -n 1 cat ~/.claude/settings.json
```

Your config should update when you:
- Switch between profiles
- Add/edit/delete MCP servers (if using default config path)

### 5. Test Error Handling

#### Test Invalid Scenarios
- [ ] Try creating profile with empty name (should show error)
- [ ] Try adding MCP server with empty name (should show error)
- [ ] Delete all profiles (should show empty state)

#### Test Preferences
- [ ] Open Raycast Settings → Extensions → Claude Code Config Switcher
- [ ] Try changing "Config File Path" to a custom location
- [ ] Toggle "Auto Backup" off
- [ ] Toggle "Confirm Switch" off
- [ ] Test profile switching with new settings

### 6. Check for Backups

If "Auto Backup" is enabled, check for backup files:

```bash
ls -la ~/.claude/settings.json.backup-*
```

You should see timestamped backups after each profile switch.

### 7. Debug Console (if needed)

If something doesn't work:
1. Open Raycast
2. Press `⌘ + Shift + .` (or `Cmd + Shift + Period`)
3. This opens the Developer Console
4. Check for any error messages in red

### 8. Hot Reload Testing

The extension supports hot reloading:
1. Make a change to any source file (e.g., change a button label)
2. Save the file
3. Raycast should automatically reload
4. Test the change immediately

## Common Issues

### Extension Not Showing Up
- Make sure `npm run dev` is still running
- Try restarting Raycast: `⌘ + Q` then reopen
- Check the terminal output for build errors

### Commands Not Working
- Check Developer Console for errors (`⌘ + Shift + .`)
- Verify config file permissions: `ls -la ~/.claude/`
- Ensure `.claude` directory exists: `mkdir -p ~/.claude`

### Profile Not Switching
- Check if config file is read-only
- Verify the config path in preferences matches your setup
- Look for error toast notifications

### Can't Create MCP Server
- Check server name doesn't already exist
- Verify command path is valid
- Ensure transport type matches your setup

## Success Indicators

You'll know everything is working when:
- ✅ Profiles show up in the list
- ✅ Active profile has green badge
- ✅ Switching profiles shows success toast
- ✅ Config file updates after switching (`cat ~/.claude/settings.json`)
- ✅ MCP servers appear in config file
- ✅ Backup files created (if enabled)
- ✅ No errors in Developer Console

## Next Steps After Testing

Once everything works:
1. Replace placeholder icon with a proper 512x512 PNG
2. Test all keyboard shortcuts
3. Test with real Claude Code (restart Claude Code to pick up config changes)
4. Consider publishing to Raycast Store
