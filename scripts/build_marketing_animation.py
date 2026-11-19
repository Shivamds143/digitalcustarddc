"""
Generate the premium animated WebP for Digital Custard Digital Marketing & Brand Growth.
Produces:
- public/images/services/marketing-growth.webp (animated transparent WebP, ~1MB)
- public/images/services/marketing-growth-static.webp (clean static transparent WebP)
- public/images/services/marketing-growth.png (static PNG fallback)
- public/images/services/marketing-growth.gif (animated GIF alternative)
"""
import math
import os
import numpy as np
from PIL import Image

def main():
    print("Loading static marketing master image...")
    master = Image.open("public/images/services/marketing-growth-static.webp").convert("RGBA")
    W, H = master.size
    print(f"Master dimensions: {W}x{H}")

    os.makedirs("public/images/services", exist_ok=True)

    # Sprite bounds (x1, y1, x2, y2)
    # 1. Performance analytics chart card (top left)
    box_chart = (240, 155, 580, 405)
    # 2. SEO search engine card (top center)
    box_seo = (585, 105, 845, 245)
    # 3. Customer conversion funnel (top right)
    box_funnel = (845, 115, 1065, 335)
    # 4. Target audience bullseye (far right)
    box_target = (1065, 175, 1225, 345)
    # 5. Social media impact (center right)
    box_social = (865, 345, 1095, 495)
    # 6. Megaphone & arrows (bottom right)
    box_mega = (985, 385, 1225, 585)
    # 7. Revenue growth search card (bottom left)
    box_rev = (155, 405, 430, 530)

    sprite_chart = master.crop(box_chart)
    sprite_seo = master.crop(box_seo)
    sprite_funnel = master.crop(box_funnel)
    sprite_target = master.crop(box_target)
    sprite_social = master.crop(box_social)
    sprite_mega = master.crop(box_mega)
    sprite_rev = master.crop(box_rev)

    # Hands sprite for typing cadence:
    # x: 650..735, y: 440..495
    left_hand_sprite = master.crop((650, 440, 695, 495))
    right_hand_sprite = master.crop((695, 440, 740, 495))

    arr_master = np.array(master)

    # Chart gold curve mask for breathing glow:
    # Inside chart card: x: 260..560, y: 220..380
    chart_glow_mask = np.zeros((H, W), dtype=bool)
    chart_region = (arr_master[200:390, 260:570, 0] > 180) & \
                   (arr_master[200:390, 260:570, 1] > 140) & \
                   (arr_master[200:390, 260:570, 2] < 100)
    chart_glow_mask[200:390, 260:570] = chart_region

    # Megaphone gold highlights mask:
    mega_glow_mask = np.zeros((H, W), dtype=bool)
    mega_region = (arr_master[390:570, 1000:1210, 0] > 190) & \
                  (arr_master[390:570, 1000:1210, 1] > 150) & \
                  (arr_master[390:570, 1000:1210, 2] < 120)
    mega_glow_mask[390:570, 1000:1210] = mega_region

    # Inpaint base image:
    # 6px top and bottom margins where floating panels move
    base_arr = arr_master.copy()
    WARM_CREAM = [250, 246, 236, 255]
    TRANSPARENT = [0, 0, 0, 0]

    def inpaint_panel_margins(box, top_color, bot_color):
        x1, y1, x2, y2 = box
        base_arr[max(0, y1-6):y1+6, x1:x2] = top_color
        base_arr[y2-6:min(H, y2+6), x1:x2] = bot_color

    inpaint_panel_margins(box_chart, TRANSPARENT, WARM_CREAM)
    inpaint_panel_margins(box_seo, TRANSPARENT, WARM_CREAM)
    inpaint_panel_margins(box_funnel, TRANSPARENT, WARM_CREAM)
    inpaint_panel_margins(box_target, TRANSPARENT, TRANSPARENT)
    inpaint_panel_margins(box_social, WARM_CREAM, WARM_CREAM)
    inpaint_panel_margins(box_mega, WARM_CREAM, TRANSPARENT)
    inpaint_panel_margins(box_rev, WARM_CREAM, TRANSPARENT)

    clean_base = Image.fromarray(base_arr, "RGBA")

    # Generate 28 animation frames (75ms per frame = 2.1s loop)
    N_FRAMES = 28
    frames = []

    print(f"Generating {N_FRAMES} frames...")
    for i in range(N_FRAMES):
        theta = 2.0 * math.pi * i / N_FRAMES

        # Subtle floating offsets (in pixels)
        dy_chart = round(4.0 * math.sin(theta))
        dy_seo = round(3.2 * math.sin(theta + 2.0))
        dy_funnel = round(3.8 * math.sin(theta + 3.8))
        dy_target = round(3.0 * math.sin(theta + 5.0))
        dy_social = round(3.5 * math.sin(theta + 1.2))
        dy_mega = round(3.5 * math.sin(theta + 2.8))
        dy_rev = round(2.5 * math.sin(theta + 4.2))

        # Typing micro-shifts for hands
        dy_left_hand = round(0.8 * math.sin(theta * 4.0))
        dy_right_hand = round(0.8 * math.cos(theta * 4.0))

        # Glowing pulses
        chart_pulse = 0.5 + 0.5 * math.sin(theta * 2.0)
        mega_pulse = 0.5 + 0.5 * math.sin(theta * 2.5)

        # Create canvas from clean base
        frame = clean_base.copy()

        # 1. Composite floating cards
        frame.paste(sprite_rev, (box_rev[0], box_rev[1] + dy_rev), sprite_rev)
        frame.paste(sprite_chart, (box_chart[0], box_chart[1] + dy_chart), sprite_chart)
        frame.paste(sprite_seo, (box_seo[0], box_seo[1] + dy_seo), sprite_seo)
        frame.paste(sprite_funnel, (box_funnel[0], box_funnel[1] + dy_funnel), sprite_funnel)
        frame.paste(sprite_target, (box_target[0], box_target[1] + dy_target), sprite_target)
        frame.paste(sprite_social, (box_social[0], box_social[1] + dy_social), sprite_social)
        frame.paste(sprite_mega, (box_mega[0], box_mega[1] + dy_mega), sprite_mega)

        # 2. Composite hands
        frame.paste(left_hand_sprite, (650, 440 + dy_left_hand), left_hand_sprite)
        frame.paste(right_hand_sprite, (695, 440 + dy_right_hand), right_hand_sprite)

        # 3. Add glowing pulses
        frame_arr = np.array(frame)
        if chart_pulse > 0.15:
            glow = int(chart_pulse * 35)
            y_idx, x_idx = np.where(chart_glow_mask)
            shifted_y = np.clip(y_idx + dy_chart, 0, H - 1)
            frame_arr[shifted_y, x_idx, 0] = np.clip(frame_arr[shifted_y, x_idx, 0].astype(int) + glow, 0, 255)
            frame_arr[shifted_y, x_idx, 1] = np.clip(frame_arr[shifted_y, x_idx, 1].astype(int) + glow // 2, 0, 255)

        if mega_pulse > 0.2:
            glow_m = int(mega_pulse * 30)
            y_idx, x_idx = np.where(mega_glow_mask)
            shifted_y = np.clip(y_idx + dy_mega, 0, H - 1)
            frame_arr[shifted_y, x_idx, 0] = np.clip(frame_arr[shifted_y, x_idx, 0].astype(int) + glow_m, 0, 255)
            frame_arr[shifted_y, x_idx, 1] = np.clip(frame_arr[shifted_y, x_idx, 1].astype(int) + glow_m // 2, 0, 255)

        final_frame = Image.fromarray(frame_arr, "RGBA")
        frames.append(final_frame)

    print("Saving animated WebP to public/images/services/marketing-growth.webp...")
    frames[0].save(
        "public/images/services/marketing-growth.webp",
        save_all=True,
        append_images=frames[1:],
        duration=75,
        loop=0,
        quality=80,
        method=6
    )

    size_bytes = os.path.getsize("public/images/services/marketing-growth.webp")
    print(f"Animated WebP size: {size_bytes / (1024 * 1024):.2f} MB ({size_bytes} bytes)")

    print("Saving GIF fallback to public/images/services/marketing-growth.gif...")
    gif_frames = [f.resize((960, int(960 * H / W)), Image.Resampling.LANCZOS) for f in frames]
    gif_frames[0].save(
        "public/images/services/marketing-growth.gif",
        save_all=True,
        append_images=gif_frames[1:],
        duration=75,
        loop=0,
        disposal=2,
        optimize=True
    )
    gif_size = os.path.getsize("public/images/services/marketing-growth.gif")
    print(f"Animated GIF size: {gif_size / (1024 * 1024):.2f} MB ({gif_size} bytes)")
    print("All marketing assets created successfully!")

if __name__ == "__main__":
    main()
