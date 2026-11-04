export function statusTone(status) {
  const tones = {
    Available: 'available',
    Borrowed: 'borrowed',
    Reserved: 'reserved',
    Student: 'student',
    Lecturer: 'lecturer',
    Staff: 'staff',
  };
  return tones[status] ?? 'neutral';
}

export function createStatusBadge(status) {
  const span = document.createElement('span');
  span.className = `status-badge status-badge--${statusTone(status)}`;
  span.textContent = status;
  return span;
}
