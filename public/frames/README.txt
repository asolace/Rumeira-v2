Frame sequence for ScrollAnimation component.

Place exactly 120 WebP files here, named:
  frame_0001.webp
  frame_0002.webp
  ...
  frame_0120.webp

To extract frames from the supplied video (ffmpeg):

  ffmpeg -i scroll.mp4 -vf "fps=24,scale=1920:-2:flags=lanczos" -vcodec libwebp -lossless 0 -compression_level 6 -q:v 75 frame_%04d.webp

Tune fps so the total output matches ~80-120 frames. For a ~5s video, fps=24 gives 120 frames.

Constraints:
- No text baked into frames
- No logos
- No people
- Clean, structured motion
- Target each frame under ~80KB for fast preload
