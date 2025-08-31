from time import sleep
from colorama import Fore, Style, init
import random
import os

init(autoreset=True)

def dramatic_print(text, color=Fore.WHITE, delay=0.05):
    for char in text:
        print(color + char, end="", flush=True)
        sleep(delay)
    print()

def starfield(duration=2, density=0.02):
    width = 50
    height = 10
    end_time = time.time() + duration
    while time.time() < end_time:
        line = ''.join(random.choice(['*', ' ', ' ']) if random.random() < density else ' ' for _ in range(width))
        print(Fore.CYAN + line)
        sleep(0.1)
# Stefan Zweig Ben söylediklerimden sorumluyum, anladıklarınızdan değil
os.system('cls' if os.name == 'nt' else 'clear')
print(Fore.MAGENTA + "="*50)
dramatic_print("           THE GOD? - By.Toprak and God", Fore.CYAN, 0.07)
print(Fore.MAGENTA + "="*50 + "\n")
sleep(0.5)

dramatic_print("In the silence of your mind...", Fore.BLUE, 0.05)
sleep(1)
dramatic_print("You feel a presence watching.", Fore.LIGHTMAGENTA_EX, 0.05)
sleep(1)

dramatic_print("— You believe in God. That's okay. —", Fore.YELLOW, 0.05)
sleep(0.8)
dramatic_print("— But... does God believe in you? —", Fore.RED, 0.08)
sleep(1)

dramatic_print("Questions echo through eternity...", Fore.LIGHTBLUE_EX, 0.05)
sleep(0.7)
dramatic_print("Time seems to stand still.", Fore.CYAN, 0.05)
sleep(0.7)

# ! Ben söylediklerimden Sorumluyum,
# ? Anladıklarınızdan değil.
# ! - Stewan Zewig.

dramatic_print("Stars twinkle, as if whispering secrets.", Fore.LIGHTYELLOW_EX, 0.05)
sleep(0.5)
dramatic_print("The universe waits for your answer.", Fore.LIGHTGREEN_EX, 0.05)
sleep(1)

dramatic_print("Will you dare to look deeper?", Fore.LIGHTRED_EX, 0.07)
sleep(1)
dramatic_print("I ASKED AN FUCKING QUESTION.", Fore.LIGHTRED_EX, 0.07)
dramatic_print("DOES. GOD. BELIEVE. IN. YOU?", Fore.LIGHTRED_EX, 0.07)


print("\n" + Fore.MAGENTA + "="*50)
dramatic_print("           THE END?", Fore.CYAN, 0.07)
print(Fore.MAGENTA + "="*50 + "\n")