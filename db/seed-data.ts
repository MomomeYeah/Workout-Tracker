export const exercise_categories = [
    {name: "Abs"},
    {name: "Back"},
    {name: "Biceps"},
    {name: "Cardio"},
    {name: "Chest"},
    {name: "Legs"},
    {name: "Shoulders"},
    {name: "Triceps"},
];

export const exercises = [
    {name: "Barbell Curl", category: "Biceps"},
    {name: "Bentover row", category: "Back"},
    {name: "Close-grip cable row", category: "Back"},
    {name: "Close-grip pulldown", category: "Back"},
    {name: "Crunch", category: "Abs"},
    {name: "Dumbbell bench press", category: "Chest"},
    {name: "Hex-bar deadlift", category: "Back"},
    {name: "Incline bench press", category: "Chest"},
    {name: "Jogging", category: "Cardio"},
    {name: "Leg extensions", category: "Legs"},
    {name: "Military press", category: "Shoulders"},
    {name: "Pulldown", category: "Back"},
    {name: "Seated leg curls", category: "Legs"},
    {name: "Seated shoulder press", category: "Shoulders"},
    {name: "Tricep Extensions", category: "Triceps"},
];

export const logs = [
    {title: "Upper 2", startTime: 1761975000000, endTime: 1761977700000},
    {title: "Legs", startTime: 1762150500000, endTime: 1762152420000},
    {title: "Upper 1", startTime: 1762241400000, endTime: 1762243800000},
];

export const log_exercises = [
    {log: "Upper 2", exercise: "Incline bench press", sets: [
        {weight: 70, reps: 12},
        {weight: 70, reps: 10},    
    ]},
    {log: "Upper 2", exercise: "Military press", sets: [
        {weight: 60, reps: 10},
        {weight: 50, reps: 8},
    ]},
    {log: "Upper 2", exercise: "Bentover row", sets: [
        {weight: 70, reps: 14},
    ]},
    {log: "Upper 2", exercise: "Close-grip pulldown", sets: [
        {weight: 77, reps: 13},
        {weight: 67, reps: 12},
    ]},
    {log: "Legs", exercise: "Hex-bar deadlift", sets: [
        {weight: 160, reps: 8},
        {weight: 160, reps: 8},
    ]},
    {log: "Legs", exercise: "Seated leg curls", sets: [
        {weight: 110, reps: 12},
        {weight: 96, reps: 10},
    ]},
    {log: "Legs", exercise: "Leg extensions", sets: [
        {weight: 117, reps: 14},
        {weight: 96, reps: 10},
    ]},
    {log: "Upper 1", exercise: "Dumbbell bench press", sets: [
        {weight: 35, reps: 12},
        {weight: 35, reps: 10},
    ]},
    {log: "Upper 1", exercise: "Seated shoulder press", sets: [
        {weight: 65, reps: 12},
        {weight: 50, reps: 10},
    ]},
    {log: "Upper 1", exercise: "Close-grip cable row", sets: [
        {weight: 107, reps: 10},
        {weight: 97, reps: 12},
    ]},
    {log: "Upper 1", exercise: "Pulldown", sets: [
        {weight: 77, reps: 12},
        {weight: 67, reps: 10},
    ]},
];