import cv2


def reverce(img):
    return cv2.flip(img, 1)


if __name__ == "__main__":
    paths = ["standL.png",
             "standbyL.png",
             "walk0L.png",
             "walk1L.png",
             "jumpL.png"]
    
    for path in paths:
        img = cv2.imread(path)
        img = reverce(img)
        file_name = path.replace("L","R")
        cv2.imwrite(file_name, img)
