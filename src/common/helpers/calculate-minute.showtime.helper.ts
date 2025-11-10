// ------------------ HELPER: Tính số phút giữa 2 mốc thời gian ------------------
export function calculateDurationMinutes(start: string, end: string): number {
    if (!start || !end) return 0;

    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    let duration = (eh * 60 + em) - (sh * 60 + sm);

    // Nếu chiếu qua nửa đêm (vd: 23:00 -> 01:00)
    if (duration < 0) duration += 24 * 60;

    return duration;
}