"""
Generate the premium animated WebP for Digital Custard IT Solutions & Digital Products.
Produces:
- public/images/services/it-development.webp (animated transparent WebP)
- public/images/services/it-development-static.webp (clean static transparent WebP)
- public/images/services/it-development.png (static PNG fallback)
"""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def main():
    print("Loading static master image...")
    master = Image.open("public/images/services/it-development-static.webp").convert("RGBA")
    W, H = master.size
    print(f"Master dimensions: {W}x{H}")

    # Ensure output directory exists
    import os
    os.makedirs("public/images/services", exist_ok=True)

    # Sprites definitions (x1, y1, x2, y2)
    # 1. Website window (top-left)
    box_web = (160, 74, 526, 415)
    # 2. Wireframe window (bottom-left)
    box_wire = (128, 360, 344, 510)
    # 3. SaaS analytics dashboard (top-right)
    box_saas = (888, 95, 1222, 395)
    # 4. Smartphone (bottom-right)
    box_phone = (1048, 445, 1238, 745)
    # 5. Cloud API (top-center)
    box_cloud = (610, 105, 730, 240)

    sprite_web = master.crop(box_web)
    sprite_wire = master.crop(box_wire)
    sprite_saas = master.crop(box_saas)
    sprite_phone = master.crop(box_phone)
    sprite_cloud = master.crop(box_cloud)

    # Keyboard keys mask for typing animation:
    # Keys area: x: 570..690, y: 550..665
    arr_master = np.array(master)
    kb_mask = np.zeros((H, W), dtype=bool)
    kb_region = (arr_master[550:665, 570:690, 0] > 180) & \
                (arr_master[550:665, 570:690, 1] > 120) & \
                (arr_master[550:665, 570:690, 1] < 185) & \
                (arr_master[550:665, 570:690, 2] < 70)
    kb_mask[550:665, 570:690] = kb_region

    # SaaS chart highlight area: x: 980..1060, y: 170..220
    saas_glow_mask = np.zeros((H, W), dtype=bool)
    saas_region = (arr_master[170:220, 980:1060, 0] > 230) & \
                  (arr_master[170:220, 980:1060, 1] > 210) & \
                  (arr_master[170:220, 980:1060, 2] > 170)
    saas_glow_mask[170:220, 980:1060] = saas_region

    # Hands regions for subtle typing micro-shift:
    # Left hand: x: 575..645, y: 510..580
    # Right hand: x: 645..740, y: 520..610
    left_hand_sprite = master.crop((575, 510, 645, 580))
    right_hand_sprite = master.crop((645, 520, 740, 610))

    # Prepare base image:
    # Inpaint the 6px top and bottom bands where floating panels move
    base_arr = arr_master.copy()
    WARM_CREAM = [250, 246, 236, 255]
    TRANSPARENT = [0, 0, 0, 0]

    # Web window top (transparent) and bottom (warm cream)
    base_arr[70:82, box_web[0]:box_web[2]] = TRANSPARENT
    base_arr[box_web[3]-5:box_web[3]+6, box_web[0]:box_web[2]] = WARM_CREAM

    # SaaS window top (transparent/warm cream) and bottom (warm cream)
    base_arr[90:102, box_saas[0]:box_saas[2]] = TRANSPARENT
    base_arr[box_saas[3]-5:box_saas[3]+6, box_saas[0]:box_saas[2]] = WARM_CREAM

    # Wireframe window top and bottom
    base_arr[box_wire[1]-5:box_wire[1]+6, box_wire[0]:box_wire[2]] = WARM_CREAM
    base_arr[box_wire[3]-5:box_wire[3]+6, box_wire[0]:box_wire[2]] = TRANSPARENT

    # Phone top and bottom
    base_arr[box_phone[1]-5:box_phone[1]+6, box_phone[0]:box_phone[2]] = WARM_CREAM
    base_arr[box_phone[3]-5:box_phone[3]+6, box_phone[0]:box_phone[2]] = TRANSPARENT

    # Cloud top and bottom
    base_arr[box_cloud[1]-5:box_cloud[1]+6, box_cloud[0]:box_cloud[2]] = TRANSPARENT
    base_arr[box_cloud[3]-5:box_cloud[3]+6, box_cloud[0]:box_cloud[2]] = WARM_CREAM

    clean_base = Image.fromarray(base_arr, "RGBA")

    # Generate 28 animation frames
    N_FRAMES = 28
    frames = []

    print(f"Generating {N_FRAMES} frames...")
    for i in range(N_FRAMES):
        theta = 2.0 * math.pi * i / N_FRAMES

        # Subtle floating offsets (in pixels)
        dy_web = round(4.0 * math.sin(theta))
        dy_saas = round(4.0 * math.sin(theta + 3.2))
        dy_wire = round(3.0 * math.sin(theta + 1.8))
        dy_phone = round(3.5 * math.sin(theta + 4.8))
        dy_cloud = round(2.8 * math.sin(theta + 2.4))

        # Typing micro-shifts (alternating rhythmic movement)
        dy_left_hand = round(0.9 * math.sin(theta * 4.0))
        dy_right_hand = round(0.9 * math.cos(theta * 4.0))

        # Keyboard keys glow intensity: pulses with typing cadence
        kb_pulse = 0.5 + 0.5 * math.sin(theta * 4.0)

        # SaaS chart glow intensity:
        saas_pulse = 0.5 + 0.5 * math.sin(theta * 2.0)

        # Code editor cursor blink (on for half of each sub-cycle)
        cursor_on = (math.sin(theta * 3.0) > 0)

        # Create canvas from clean base
        frame = clean_base.copy()

        # 1. Composite floating panels at their shifted positions
        frame.paste(sprite_wire, (box_wire[0], box_wire[1] + dy_wire), sprite_wire)
        frame.paste(sprite_web, (box_web[0], box_web[1] + dy_web), sprite_web)
        frame.paste(sprite_saas, (box_saas[0], box_saas[1] + dy_saas), sprite_saas)
        frame.paste(sprite_phone, (box_phone[0], box_phone[1] + dy_phone), sprite_phone)
        frame.paste(sprite_cloud, (box_cloud[0], box_cloud[1] + dy_cloud), sprite_cloud)

        # 2. Composite hands with typing micro-shift
        frame.paste(left_hand_sprite, (575, 510 + dy_left_hand), left_hand_sprite)
        frame.paste(right_hand_sprite, (645, 520 + dy_right_hand), right_hand_sprite)

        # 3. Add keyboard backlight typing pulse
        frame_arr = np.array(frame)
        if kb_pulse > 0.2:
            glow_add = int(kb_pulse * 35)
            # Boost red and green of gold keys for luminous backlit effect
            frame_arr[kb_mask, 0] = np.clip(frame_arr[kb_mask, 0].astype(int) + glow_add, 0, 255)
            frame_arr[kb_mask, 1] = np.clip(frame_arr[kb_mask, 1].astype(int) + glow_add // 2, 0, 255)

        # 4. Add chart highlight pulse in SaaS window (offset by dy_saas)
        if saas_pulse > 0.1:
            glow_val = int(saas_pulse * 40)
            # Shift mask coordinates by dy_saas
            y_indices, x_indices = np.where(saas_glow_mask)
            shifted_y = np.clip(y_indices + dy_saas, 0, H - 1)
            frame_arr[shifted_y, x_indices, 0] = np.clip(frame_arr[shifted_y, x_indices, 0].astype(int) + glow_val, 0, 255)
            frame_arr[shifted_y, x_indices, 1] = np.clip(frame_arr[shifted_y, x_indices, 1].astype(int) + glow_val, 0, 255)

        # 5. Add blinking code cursor inside code editor (around x: 448..450, y: 565..577)
        if cursor_on:
            # Gold cursor |
            cursor_y1, cursor_y2 = 562, 576
            cursor_x = 448
            frame_arr[cursor_y1:cursor_y2, cursor_x:cursor_x+2, 0] = 217 # Gold R
            frame_arr[cursor_y1:cursor_y2, cursor_x:cursor_x+2, 1] = 154 # Gold G
            frame_arr[cursor_y1:cursor_y2, cursor_x:cursor_x+2, 2] = 24  # Gold B
            frame_arr[cursor_y1:cursor_y2, cursor_x:cursor_x+2, 3] = 255

        # Convert back to PIL Image
        final_frame = Image.fromarray(frame_arr, "RGBA")
        frames.append(final_frame)

    print("Saving animated WebP to public/images/services/it-development.webp...")
    # 75ms per frame = 2.1s loop, loop=0 (infinite loop)
    frames[0].save(
        "public/images/services/it-development.webp",
        save_all=True,
        append_images=frames[1:],
        duration=75,
        loop=0,
        quality=88,
        method=4
    )

    import os
    size_bytes = os.path.getsize("public/images/services/it-development.webp")
    print(f"Animated WebP size: {size_bytes / (1024 * 1024):.2f} MB ({size_bytes} bytes)")

    # Also generate animated GIF alternative as required in prompt:
    # "GIF is an alternative. /public/images/services/it-development.gif"
    print("Saving GIF fallback to public/images/services/it-development.gif...")
    gif_frames = []
    # GIF needs palette mode with transparency
    for f in frames:
        # Scale to 960px width for fast GIF performance
        scaled = f.resize((960, int(960 * H / W)), Image.Resampling.LANCZOS)
        gif_frames.append(scaled)

    gif_frames[0].save(
        "public/images/services/it-development.gif",
        save_all=True,
        append_images=gif_frames[1:],
        duration=75,
        loop=0,
        disposal=2,
        optimize=True
    )
    gif_size = os.path.getsize("public/images/services/it-development.gif")
    print(f"Animated GIF size: {gif_size / (1024 * 1024):.2f} MB ({gif_size} bytes)")
    print("Done generating assets!")

if __name__ == "__main__":
    main()
