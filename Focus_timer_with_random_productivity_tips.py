import time
import random

tips = [
    "Take a short walk after every hour of work!",
    "Drink water regularly to stay focused.",
    "Break big tasks into smaller, manageable chunks.",
    "Avoid multitasking — focus on one task at a time.",
    "Write down 3 priorities before starting work.",
    "Listen to instrumental music to improve concentration."
]

def focus_timer(minutes):
    print(f"Focus time: {minutes} minutes. Start working!")
    for remaining in range(minutes * 60, 0, -1):
        mins, secs = divmod(remaining, 60)
        time_str = f"{mins:02d}:{secs:02d}"
        print(time_str, end="\r")
        time.sleep(1)
    print("Time's up! 🎉")
    print("Productivity Tip:", random.choice(tips))

if __name__ == "__main__":
    duration = int(input("Enter focus duration in minutes: "))
    focus_timer(duration)
