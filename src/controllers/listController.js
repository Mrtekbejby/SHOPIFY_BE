import lists from "../data/lists.js";

function ensureListOwner(list, req, res) {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Missing user info in token." });
    return false;
  }

  if (list.ownerId !== req.user.id) {
    res.status(403).json({ error: "Only the owner can perform this action." });
    return false;
  }

  return true;
}

// GET /list/get
export const getAllLists = (req, res) => {
  res.json(lists);
};

// POST /list/create
export const createList = (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  const trimmedName = name.trim();

  const exists = lists.some(
    (l) => l.name.toLowerCase() === trimmedName.toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ error: "List name must be unique." });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Missing user info in token." });
  }

  const newList = {
    id: "l" + Date.now(),
    name: trimmedName,
    archived: false,
    items: [],
    members: [],
    ownerId: req.user.id 
  };

  lists.push(newList);
  res.status(201).json(newList);
};

// GET /list/get/:id
export const getListById = (req, res) => {
  const list = lists.find((l) => l.id === req.params.id);
  if (!list) return res.status(404).json({ error: "List not found" });
  res.json(list);
};

// POST /list/update/:id
export const updateList = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const list = lists.find((l) => l.id === id);
  if (!list) return res.status(404).json({ error: "List not found" });

  if (!ensureListOwner(list, req, res)) return;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  const trimmedName = name.trim();

  const duplicate = lists.some(
    (l) =>
      l.id !== id && l.name.toLowerCase() === trimmedName.toLowerCase()
  );
  if (duplicate) {
    return res.status(400).json({ error: "List name must be unique." });
  }

  list.name = trimmedName;
  res.json(list);
};

// POST /list/archive/:id
export const archiveList = (req, res) => {
  const list = lists.find((l) => l.id === req.params.id);
  if (!list) return res.status(404).json({ error: "List not found" });

  if (!ensureListOwner(list, req, res)) return;

  list.archived = true;
  res.json(list);
};

// DELETE /list/delete/:id
export const deleteList = (req, res) => {
  const index = lists.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "List not found" });

  const list = lists[index];

  if (!ensureListOwner(list, req, res)) return;

  lists.splice(index, 1);
  res.status(204).send();
};

// POST /list/addMember/:id
export const addMember = (req, res) => {
  const { id } = req.params; 
  const { userId, name, email } = req.body;

  const list = lists.find((l) => l.id === id);
  if (!list) return res.status(404).json({ error: "List not found" });

  if (!ensureListOwner(list, req, res)) return;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }

  const trimmedEmail = email.trim().toLowerCase();

  const exists = list.members.some(
    (m) => m.email.toLowerCase() === trimmedEmail
  );
  if (exists) {
    return res
      .status(400)
      .json({ error: "Member with this email is already in the list." });
  }

  const member = {
    userId: userId || "u" + Date.now(),
    name: name && name.trim() ? name.trim() : trimmedEmail.split("@")[0],
    email: trimmedEmail
  };

  list.members.push(member);
  res.status(201).json(list);
};

// POST /list/removeMember/:id
export const removeMember = (req, res) => {
  const { id } = req.params; 
  const { email } = req.body;

  const list = lists.find((l) => l.id === id);
  if (!list) return res.status(404).json({ error: "List not found" });


  if (!ensureListOwner(list, req, res)) return;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }

  const trimmedEmail = email.trim().toLowerCase();

  const index = list.members.findIndex(
    (m) => m.email.toLowerCase() === trimmedEmail
  );
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "Member with this email is not in the list." });
  }

  list.members.splice(index, 1);
  res.json(list);
};

// POST /list/leave/:id
export const leaveList = (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const list = lists.find((l) => l.id === id);
  if (!list) return res.status(404).json({ error: "List not found" });

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }

  const trimmedEmail = email.trim().toLowerCase();

  const before = list.members.length;
  list.members = list.members.filter(
    (m) => m.email.toLowerCase() !== trimmedEmail
  );

  if (list.members.length === before) {
    return res
      .status(404)
      .json({ error: "Member with this email is not in the list." });
  }

  res.json(list);
};