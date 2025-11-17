# Bugs / Oddities
- action icons interfere with tabs a bit
- Android dev build seems to require an index.tsx either under app/ or under (tabs)/, but does not like it under app/(tabs)/logs/ - navigates directly to not-found in this case. This is currently worked around by adding an index page under (tabs)/, but with a guard to prevent it from appearing. Is there a nicer way of doing this?
- react-native-popup-menu: renderers.SlideInMenu isn't visible unless there's several options available - too low on screen. Resolvable?
- expo-sqlite should work with web but doesn't seem to

# UI Tweaks
- Improve styling / readability of workout options menu
- For some reason, ThemedText within Menu does not pick up changes to theme correctly
- SegmentedControl visibly moves to initially selected value

# Workout UI
- toggles for deload weeks, lighter weeks, etc.
- UI for supersets, drop sets, myo-reps, etc.

# Workout Assist
- automatically calculate target reps for a given weight
- automatically calculate target reps / set for deloads

# Insights
- strength per KG - track overall gains and losses
- best reps per weight
- best weight per reps

# Statistics
- weight tracker
    - graphs over time, showing 3 months, 6 months, past year, etc.
    - default sort most recent first

# UI Tweaks
- keep correct scroll position in workout list
- button to start / stop workout

# Progress
- progress pictures
- strength graph vs. weight + progress