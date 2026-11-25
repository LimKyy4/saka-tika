// src/data/abcSongTimeline.js
// Exact 20ms vocal-band (400-3200Hz) & 128 BPM beat-calibrated 26-letter cue timeline
// for /audio/lagu-abc.mp3 (31.509478s duration, 0.46875s/beat).
// Phases:
// - Intro  (< 7.64s): Instrumental 16-beat groove (first downbeat at 0.12s)
// - Singing (7.64s - 22.58s): A-G, H-P (eighth-note L-M-N-O-P), Q-S, T-V, W-X, Y-Z
// - Outro (22.58s - 31.51s): Outro vocal + instrumental fade

export const CALIBRATED_ABC_SONG_DURATION = 31.509478;
export const ABC_SONG_BEAT_SEC = 0.46875;

export const ABC_SONG_CUE_POINTS = [
  { letter: "A", startSec: 7.64, endSec: 8.05 },
  { letter: "B", startSec: 8.05, endSec: 8.54 },
  { letter: "C", startSec: 8.54, endSec: 8.99 },
  { letter: "D", startSec: 8.99, endSec: 9.48 },
  { letter: "E", startSec: 9.48, endSec: 9.93 },
  { letter: "F", startSec: 9.93, endSec: 10.42 },
  { letter: "G", startSec: 10.42, endSec: 11.35 },
  { letter: "H", startSec: 11.35, endSec: 11.80 },
  { letter: "I", startSec: 11.80, endSec: 12.28 },
  { letter: "J", startSec: 12.28, endSec: 12.75 },
  { letter: "K", startSec: 12.75, endSec: 13.24 },
  { letter: "L", startSec: 13.24, endSec: 13.50 },
  { letter: "M", startSec: 13.50, endSec: 13.74 },
  { letter: "N", startSec: 13.74, endSec: 13.98 },
  { letter: "O", startSec: 13.98, endSec: 14.22 },
  { letter: "P", startSec: 14.22, endSec: 15.08 },
  { letter: "Q", startSec: 15.08, endSec: 15.55 },
  { letter: "R", startSec: 15.55, endSec: 16.03 },
  { letter: "S", startSec: 16.03, endSec: 16.95 },
  { letter: "T", startSec: 16.95, endSec: 17.43 },
  { letter: "U", startSec: 17.43, endSec: 17.92 },
  { letter: "V", startSec: 17.92, endSec: 18.83 },
  { letter: "W", startSec: 18.83, endSec: 19.81 },
  { letter: "X", startSec: 19.81, endSec: 20.71 },
  { letter: "Y", startSec: 20.71, endSec: 21.65 },
  { letter: "Z", startSec: 21.65, endSec: 22.58 },
];

export function resolveSongLetterIndex(currentTimeSec, audioDurationSec) {
  const validDur =
    Number.isFinite(audioDurationSec) && audioDurationSec > 0
      ? audioDurationSec
      : CALIBRATED_ABC_SONG_DURATION;
  const scale = validDur / CALIBRATED_ABC_SONG_DURATION;

  if (currentTimeSec < ABC_SONG_CUE_POINTS[0].startSec * scale) {
    return -1;
  }
  if (currentTimeSec >= ABC_SONG_CUE_POINTS[25].endSec * scale) {
    return 26;
  }

  for (let i = 0; i < ABC_SONG_CUE_POINTS.length; i++) {
    const start = ABC_SONG_CUE_POINTS[i].startSec * scale;
    const end = ABC_SONG_CUE_POINTS[i].endSec * scale;
    if (currentTimeSec >= start && currentTimeSec < end) {
      return i;
    }
  }
  return 25;
}
