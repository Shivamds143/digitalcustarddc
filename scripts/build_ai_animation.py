"""
Generate the premium animated WebP for Digital Custard AI Services & Automation Solutions.
Produces:
- public/images/services/ai-automation.webp (animated transparent WebP, ~1MB)
- public/images/services/ai-automation-static.webp (clean static transparent WebP)
- public/images/services/ai-automation.png (static PNG fallback)
- public/images/services/ai-automation.gif (animated GIF alternative)
"""
import math
import os
import numpy as np
from PIL import Image

def main():
    print("Loading static AI master image...")
    master = Image.open("public/images/services/ai-automation-static.webp").convert("RGBA")
    W, H = master.size
    print(f"Master dimensions: {W}x{H}")

    os.makedirs("public/images/services", exist_ok=True)

    # Sprites definitions (x1, y1, x2, y2)
    box_brain = (570, 50, 835, 255)
    box_genai = (175, 145, 528, 395)
    box_agentic = (155, 460, 440, 680)
    box_ml = (880, 155, 1225, 400)
    box_kpi = (970, 395, 1225, 515)
    box_llm = (1050, 545, 1180, 625)
    box_ai_tag1 = (120, 395, 225, 485)
    box_ai_tag2 = (915, 85, 1020, 175)

    sprite_brain = master.crop(box_brain)
    sprite_genai = master.crop(box_genai)
    sprite_agentic = master.crop(box_agentic)
    sprite_ml = master.crop(box_ml)
    sprite_kpi = master.crop(box_kpi)
    sprite_llm = master.crop(box_llm)
    sprite_ai_tag1 = master.crop(box_ai_tag1)
    sprite_ai_tag2 = master.crop(box_ai_tag2)

    # Typing hands sprite
    left_hand_sprite = master.crop((650, 440, 695, 495))
    right_hand_sprite = master.crop((695, 440, 740, 495))

    arr_master = np.array(master)

    # Brain synapses / AI chip glow mask:
    # Inside brain box: x: 580..820, y: 60..240
    brain_glow_mask = np.zeros((H, W), dtype=bool)
    brain_region = (arr_master[60:240, 580:820, 0] > 180) & \
                   (arr_master[60:240, 580:820, 1] > 140) & \
                   (arr_master[60:240, 580:820, 2] < 100)
    brain_glow_mask[60:240, 580:820] = brain_region

    # ML growth curve glow mask:
    # Inside ML card: x: 890..1200, y: 220..380
    ml_glow_mask = np.zeros((H, W), dtype=bool)
    ml_region = (arr_master[200:390, 890:1210, 0] > 190) & \
                (arr_master[200:390, 890:1210, 1] > 150) & \
                (arr_master[200:390, 890:1210, 2] < 110)
    ml_glow_mask[200:390, 890:1210] = ml_region

    # Inpaint base margins:
    base_arr = arr_master.copy()
    WARM_CREAM = [250, 246, 236, 255]
    TRANSPARENT = [0, 0, 0, 0]

    def inpaint_panel_margins(box, top_color, bot_color):
        x1, y1, x2, y2 = box
        base_arr[max(0, y1-6):y1+6, x1:x2] = top_color
        base_arr[y2-6:min(H, y2+6), x1:x2] = bot_color

    inpaint_panel_margins(box_brain, TRANSPARENT, WARM_CREAM)
    inpaint_panel_margins(box_genai, TRANSPARENT, WARM_CREAM)
    inpaint_panel_margins(box_agentic, WARM_CREAM, TRANSPARENT)
    inpaint_panel_margins(box_ml, TRANSPARENT, WARM_CREAM)
    inpaint_panel_margins(box_kpi, WARM_CREAM, WARM_CREAM)
    inpaint_panel_margins(box_llm, WARM_CREAM, TRANSPARENT)
    inpaint_panel_margins(box_ai_tag1, WARM_CREAM, TRANSPARENT)
    inpaint_panel_margins(box_ai_tag2, TRANSPARENT, TRANSPARENT)

    clean_base = Image.fromarray(base_arr, "RGBA")

    # Generate 28 animation frames (75ms per frame = 2.1s loop)
    N_FRAMES = 28
    frames = []

    print(f"Generating {N_FRAMES} frames...")
    for i in range(N_FRAMES):
        theta = 2.0 * math.pi * i / N_FRAMES

        # Subtle floating offsets (in pixels)
        dy_brain = round(3.0 * math.sin(theta))
        dy_genai = round(4.0 * math.sin(theta + 1.8))
        dy_agentic = round(3.2 * math.sin(theta + 4.2))
        dy_ml = round(4.0 * math.sin(theta + 3.2))
        dy_kpi = round(3.5 * math.sin(theta + 4.8))
        dy_llm = round(2.5 * math.sin(theta + 2.4))
        dy_tag1 = round(2.8 * math.sin(theta + 5.0))
        dy_tag2 = round(3.0 * math.sin(theta + 0.8))

        # Typing micro-shifts for hands
        dy_left_hand = round(0.8 * math.sin(theta * 4.0))
        dy_right_hand = round(0.8 * math.cos(theta * 4.0))

        # Glowing pulses
        brain_pulse = 0.5 + 0.5 * math.sin(theta * 2.0)
        ml_pulse = 0.5 + 0.5 * math.sin(theta * 2.5)

        # Create canvas from clean base
        frame = clean_base.copy()

        # 1. Composite floating cards
        frame.paste(sprite_agentic, (box_agentic[0], box_agentic[1] + dy_agentic), sprite_agentic)
        frame.paste(sprite_genai, (box_genai[0], box_genai[1] + dy_genai), sprite_genai)
        frame.paste(sprite_brain, (box_brain[0], box_brain[1] + dy_brain), sprite_brain)
        frame.paste(sprite_ml, (box_ml[0], box_ml[1] + dy_ml), sprite_ml)
        frame.paste(sprite_kpi, (box_kpi[0], box_kpi[1] + dy_kpi), sprite_kpi)
        frame.paste(sprite_llm, (box_llm[0], box_llm[1] + dy_llm), sprite_llm)
        frame.paste(sprite_ai_tag1, (box_ai_tag1[0], box_ai_tag1[1] + dy_tag1), sprite_ai_tag1)
        frame.paste(sprite_ai_tag2, (box_ai_tag2[0], box_ai_tag2[1] + dy_tag2), sprite_ai_tag2)

        # 2. Composite hands
        frame.paste(left_hand_sprite, (650, 440 + dy_left_hand), left_hand_sprite)
        frame.paste(right_hand_sprite, (695, 440 + dy_right_hand), right_hand_sprite)

        # 3. Add glowing pulses
        frame_arr = np.array(frame)
        if brain_pulse > 0.15:
            glow_b = int(brain_pulse * 35)
            y_idx, x_idx = np.where(brain_glow_mask)
            shifted_y = np.clip(y_idx + dy_brain, 0, H - 1)
            frame_arr[shifted_y, x_idx, 0] = np.clip(frame_arr[shifted_y, x_idx, 0].astype(int) + glow_b, 0, 255)
            frame_arr[shifted_y, x_idx, 1] = np.clip(frame_arr[shifted_y, x_idx, 1].astype(int) + glow_b // 2, 0, 255)

        if ml_pulse > 0.15:
            glow_m = int(ml_pulse * 35)
            y_idx, x_idx = np.where(ml_glow_mask)
            shifted_y = np.clip(y_idx + dy_ml, 0, H - 1)
            frame_arr[shifted_y, x_idx, 0] = np.clip(frame_arr[shifted_y, x_idx, 0].astype(int) + glow_m, 0, 255)
            frame_arr[shifted_y, x_idx, 1] = np.clip(frame_arr[shifted_y, x_idx, 1].astype(int) + glow_m // 2, 0, 255)

        final_frame = Image.fromarray(frame_arr, "RGBA")
        frames.append(final_frame)

    print("Saving animated WebP to public/images/services/ai-automation.webp...")
    frames[0].save(
        "public/images/services/ai-automation.webp",
        save_all=True,
        append_images=frames[1:],
        duration=75,
        loop=0,
        quality=80,
        method=6
    )

    size_bytes = os.path.getsize("public/images/services/ai-automation.webp")
    print(f"Animated WebP size: {size_bytes / (1024 * 1024):.2f} MB ({size_bytes} bytes)")

    print("Saving GIF fallback to public/images/services/ai-automation.gif...")
    gif_frames = [f.resize((960, int(960 * H / W)), Image.Resampling.LANCZOS) for f in frames]
    gif_frames[0].save(
        "public/images/services/ai-automation.gif",
        save_all=True,
        append_images=gif_frames[1:],
        duration=75,
        loop=0,
        disposal=2,
        optimize=True
    )
    gif_size = os.path.getsize("public/images/services/ai-automation.gif")
    print(f"Animated GIF size: {gif_size / (1024 * 1024):.2f} MB ({gif_size} bytes)")
    print("All AI assets created successfully!")

if __name__ == "__main__":
    main()
