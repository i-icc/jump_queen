import cv2
import json

if __name__ == "__main__":
    stage_size = 3
    stages = {}
    for i in range(6):
        img = cv2.imread(f"./binary/{i}.png")
        gray = cv2.cvtColor(cv2.resize(img, dsize=(800, 600)), cv2.COLOR_BGR2GRAY)
        stages[i] = gray.tolist()
        
    data = json.dumps(stages)
    with open("./stages.json", "w") as f:
        f.write(data)