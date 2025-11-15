const lists = [
  {
    id: "l1",
    name: "Weekend shopping",
    ownerId: "tom@gmail.com",
    archived: false,
    items: [
      { itemId: "i1", text: "bread", completed: false },
      { itemId: "i2", text: "milk", completed: false },
      { itemId: "i3", text: "eggs", completed: true }
    ],
    members: [
      { userId: "tom@gmail.com", name: "tom", email: "tom@gmail.com" },
      { userId: "anna@gmail.com", name: "anna", email: "anna@gmail.com" }
    ]
  },
  {
    id: "l2",
    name: "Birthday party supplies",
    ownerId: "lucas@gmail.com",
    archived: false,
    items: [
      { itemId: "i4", text: "balloons", completed: true },
      { itemId: "i5", text: "cake", completed: false },
      { itemId: "i6", text: "napkins", completed: true }
    ],
    members: [
      { userId: "lucas@gmail.com", name: "lucas", email: "lucas@gmail.com" },
      { userId: "sofia@gmail.com", name: "sofia", email: "sofia@gmail.com" },
      { userId: "marie@gmail.com", name: "marie", email: "marie@gmail.com" }
    ]
  }
];

export default lists;