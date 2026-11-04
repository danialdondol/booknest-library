export const MONTHLY_LOANS = Object.freeze({
  labels: Object.freeze(['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']),
  values: Object.freeze([48, 61, 39, 72, 95, 88]),
});

export const ACTIVITY = Object.freeze(
  [
    {
      id: 1,
      type: 'borrow',
      member: 'Nur Aisyah',
      item: 'Atomic Habits',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'return',
      member: 'Raj Kumar',
      item: 'Clean Code',
      time: '5 hours ago',
    },
    {
      id: 3,
      type: 'reserve',
      member: 'Prof. Zainab Ali',
      item: 'Cosmos',
      time: 'Yesterday',
    },
    {
      id: 4,
      type: 'join',
      member: 'Alya Sofea',
      item: null,
      time: '2 days ago',
    },
    {
      id: 5,
      type: 'borrow',
      member: 'Daniel Lee',
      item: 'Zero to One',
      time: '3 days ago',
    },
  ].map((entry) => Object.freeze(entry)),
);
