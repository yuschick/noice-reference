# @assets/audio

## Converting files

We aim to use .webm for the most browser compatibility, but we get `.wav` files from our audio partners. Use [ffmpeg](https://ffmpeg.org/) to convert them.

```bash
# Convert all *.wav files in the folder.
$ cd <path/to/src/assets/audio>
$ for i in *.wav; do ffmpeg -i "$i" "${i%.*}.webm"; done

# convert one file
$ ffmpeg -i ui_boosters_use.wav ui_boosters_use.webm
```

On windows (using command prompt):

```cmd
for %i in (*.mp4) do ffmpeg -i "%i" "%~ni.mp3"
```