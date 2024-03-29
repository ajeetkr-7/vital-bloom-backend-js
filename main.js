userInfo = {
    'userId': userId, // Get user ID from your application state
    'healthInfo': {
        'smoking': userSmockingScale,
        'drinking': userDrinkingStatus, // yes or no
        'workoutFrequency': userWorkoutFrequencyNumber,
        'stressLevel': userEnteredStressLevel,
        'jobDetails': {
            'workStatus': userSelectedWorkStatusNumber,
            'workTime': userEnteredWorkTime, //0 - 16
            'satisfaction': userEnteredJobSatisfactionScale, //-1 to 1
        },
        'bodyDetails': {
            'waistSize': userEnteredWaistSize, // in cm
            'bloodPressure': bloodPressureStatus, // high, low or normal,
            'neck size': userEnteredNeckSize, // in cm
            'hipSize': userEnteredHipSize, // in cm
        },
        'constantlyTired': userSelectedConstantlyTiredStatus, // yes or no
        'exerciseDuration': userSelectedExerciseDurationOption, // 1,2,3,4
        'sleepAlarmingSign': userSelectedSleepAlarmingSign, // boolean value
        'snoring': userSelectedSnoringStatus, // yes or no
    },
};