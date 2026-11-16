import os
from PIL import Image

image_dir = r"C:\Users\Admin1\OneDrive\Desktop\sk-relax-studio\public\images"
sample_files = [
    r"gallery\hair-transformation.jpg",
    r"gallery\pmu-eyebrow-result.jpg",
    r"gallery\butterfly-haircut.jpg",
    r"gallery\maharashtrian-bridal-artistry.jpg",
    r"treatments\korean-glass-skin-glow.jpg",
    r"services\sk-relax-straight-protein-hair.jpg",
    r"treatments\facial-machine-treatment.jpg"
]

for rel in sample_files:
    full = os.path.join(image_dir, rel)
    if os.path.exists(full):
        try:
            with Image.open(full) as img:
                print(f"{rel}: size={img.size}, mode={img.mode}, format={img.format}")
        except Exception as e:
            print(f"{rel}: err={e}")
    else:
        print(f"{rel}: NOT FOUND")
