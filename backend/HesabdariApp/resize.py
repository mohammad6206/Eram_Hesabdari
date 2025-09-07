import cv2
import numpy as np

def resize_and_crop_high_quality(file_path, output_path, size=(600,400)):
    # بارگذاری تصویر
    img = cv2.imread(file_path)
    if img is None:
        raise ValueError("تصویر بارگذاری نشد. مسیر فایل درست نیست.")
        
    h, w = img.shape[:2]
    target_w, target_h = size

    # محاسبه scale برای پر کردن کل فریم (cover)
    scale = max(target_w / w, target_h / h)
    new_w, new_h = int(w * scale), int(h * scale)

    # تغییر اندازه تصویر با interpolation پیشرفته برای کیفیت بهتر
    if scale > 1:  # بزرگ کردن تصویر
        resized_img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    else:          # کوچک کردن تصویر
        resized_img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    # محاسبه نقاط برش
    x_start = (new_w - target_w) // 2
    y_start = (new_h - target_h) // 2

    cropped_img = resized_img[y_start:y_start+target_h, x_start:x_start+target_w]

    # ذخیره خروجی
    cv2.imwrite(output_path, cropped_img)
