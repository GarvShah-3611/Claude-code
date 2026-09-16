# Drop photographs here

Nothing in the code needs editing. Save a file at one of the paths below and
it replaces the drawing in that slot on the next build. Leave a slot empty
and the drawing stays — a half-finished set never leaves a hole in the page.

| Path                        | Slot                      | Aspect | Suggested size |
| --------------------------- | ------------------------- | ------ | -------------- |
| `ground/gr-1.jpg` … `gr-4.jpg` | Ground-report cards    | 16:10  | 1600 × 1000    |
| `about/newsroom.jpg`        | "Why we exist" portrait    | 4:5    | 1200 × 1500    |
| `feed/f1.jpg` … `f6.jpg`    | On-the-feed tiles          | 1:1    | 1200 × 1200    |
| `voices/v1.jpg` … `v4.jpg`  | Youth Voices portraits     | 1:1    | 600 × 600      |

Images are cropped with `object-cover` and centred, so keep the subject near
the middle of the frame — the edges are what gets trimmed at narrow widths.

`.jpg` is what the paths expect. To use `.png` or `.webp` instead, change the
matching `photo:` line in `src/content/site.ts`; the extension is the only
part that has to agree.

Two things to check before committing a photograph:

- **Licence.** This is a publication, so a photo needs to be one we can
  actually run: own work, a Creative Commons licence that permits the use,
  or a stock licence. Record it in `CREDITS.md` next to this file.
- **Weight.** Keep each file under ~300KB. Anything larger costs more in
  Lighthouse than the photograph adds to the page.
