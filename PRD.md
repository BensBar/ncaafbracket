# Planning Guide

A College Football Playoff bracket visualization that displays the top 12 NCAAF teams in a tournament-style bracket leading to the national championship trophy, with the next two teams (13-14) shown as "left out."

**Experience Qualities**:
1. **Competitive** - The bracket should evoke the excitement and intensity of playoff football with bold team presentations
2. **Clear** - The tournament structure must be immediately understandable with a logical flow from first round to championship
3. **Dynamic** - Weekly updates should feel fresh and current, highlighting the evolving playoff picture

**Complexity Level**: Light Application (multiple features with basic state)
  - Displays hierarchical bracket structure with multiple rounds, team data management, and visual flow to championship

## Essential Features

### Bracket Display
- **Functionality**: Shows 12 teams arranged in a playoff bracket format (first round, semifinals, championship) with connector lines flowing toward the trophy
- **Purpose**: Visualizes the playoff structure and tournament progression
- **Trigger**: On page load
- **Progression**: Page loads → Teams populate in bracket positions → Connector lines show matchup flow → Trophy appears at center/top → "Left out" teams display below
- **Success criteria**: All 12 teams visible in proper bracket positions with clear visual hierarchy

### Team Rankings
- **Functionality**: Displays teams with their ranking (1-12) and school name
- **Purpose**: Shows current playoff seeding and team identity
- **Trigger**: Automatic on load
- **Progression**: Rankings displayed prominently → Teams ordered by seed → First round matchups show appropriate seeding
- **Success criteria**: Rankings clearly visible, teams properly seeded in bracket structure

### Weekly Updates
- **Functionality**: Admin can update the team list to reflect current week's rankings
- **Purpose**: Keeps bracket current throughout the season
- **Trigger**: User clicks update/edit button
- **Progression**: Edit mode activates → Input fields for 14 teams → Save → Bracket refreshes with new teams
- **Success criteria**: Teams persist between sessions and can be easily updated

### "Left Out" Teams Display
- **Functionality**: Shows teams ranked 13-14 who just missed the playoff
- **Purpose**: Highlights the competitive cutoff and bubble teams
- **Trigger**: Automatic display with main bracket
- **Progression**: Bracket displays → Below or beside bracket, "Left Out" section appears → Teams 13-14 shown with subdued styling
- **Success criteria**: Clear visual separation from playoff teams, still prominent enough to be noticed

## Edge Case Handling
- **Empty/Default State**: Display sample teams or placeholders when no data exists yet
- **Mobile View**: Bracket collapses to vertical scrolling layout with maintained readability
- **Long Team Names**: Truncate or wrap intelligently to maintain bracket structure
- **Missing Trophy Image**: Show placeholder or styled championship element

## Design Direction
The design should feel authoritative and championship-caliber, evoking the prestige of college football's biggest stage with a modern, broadcast-quality aesthetic - minimal interface focusing entirely on the bracket structure and trophy as the centerpiece.

## Color Selection
Custom palette inspired by college football tradition and championship gold

- **Primary Color**: Deep Navy (#1A1D29 / oklch(0.15 0.02 250)) - Communicates authority and tradition like a broadcast overlay
- **Secondary Colors**: 
  - Warm Gold (#C5A572 / oklch(0.72 0.06 75)) - Championship trophy metallic feel
  - Slate Gray (#3A4150 / oklch(0.30 0.015 250)) - Supporting color for cards and brackets
- **Accent Color**: Bright Gold (#FFD700 / oklch(0.87 0.15 95)) - Highlight color for rankings and active elements  
- **Foreground/Background Pairings**:
  - Background (Deep Navy #1A1D29): White text (#FFFFFF) - Ratio 13.2:1 ✓
  - Card (Slate Gray #3A4150): White text (#FFFFFF) - Ratio 8.5:1 ✓
  - Primary (Warm Gold #C5A572): Deep Navy (#1A1D29) - Ratio 4.9:1 ✓
  - Accent (Bright Gold #FFD700): Deep Navy (#1A1D29) - Ratio 5.8:1 ✓
  - Muted (Dark Gray #252935): Light Gray (#D1D5DB) - Ratio 8.2:1 ✓

## Font Selection
Typefaces should convey strength and authority while maintaining excellent readability for quick scanning of team names and rankings.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold / 32px / tight letter spacing / uppercase
  - H2 (Section Headers): Inter SemiBold / 20px / normal spacing / uppercase ("Left Out")
  - Team Names: Inter SemiBold / 16px / normal spacing
  - Team Rankings: Inter Bold / 18px / tight spacing
  - Body/Labels: Inter Regular / 14px / normal spacing

## Animations
Subtle entrance animations for bracket elements create a sense of the bracket "building" itself, with smooth transitions when updating teams - animation should feel like a professional sports broadcast graphic.

- **Purposeful Meaning**: Stagger team card reveals to draw eye through bracket flow, subtle pulse on "Left Out" teams to acknowledge their near-miss status
- **Hierarchy of Movement**: Trophy enters first as focal point, then bracket builds from outer rounds inward toward championship

## Component Selection
- **Components**: 
  - Card (for team matchup containers) - Dark background with subtle border
  - Button (for update/edit functionality) - Primary gold styling
  - Dialog (for editing team list) - Modal overlay for updates
  - Input (for team entry) - Clean fields with rank numbers
  - Badge (for ranking display) - Gold accent circles
  - Separator (for visual dividers)
- **Customizations**: 
  - Custom bracket connector lines using SVG or CSS borders
  - Trophy image as centerpiece with subtle glow effect
  - "Left Out" section with muted card styling
- **States**: 
  - Team cards have subtle hover effect (slight scale/glow)
  - Edit button prominent in corner with gold accent
  - Input fields have clear focus states with gold ring
- **Icon Selection**: 
  - PencilSimple for edit functionality
  - Trophy for championship indication
  - CaretRight for bracket flow direction
- **Spacing**: 
  - Generous gap between rounds (space-x-8, space-y-4)
  - Tight spacing within team cards (p-3)
  - Large padding around trophy centerpiece (p-12)
- **Mobile**: 
  - Bracket rotates to vertical flow on mobile
  - Teams stack with connecting lines adjusted
  - Trophy scales appropriately
  - "Left Out" section moves below bracket
  - Horizontal scroll enabled if needed for bracket width
