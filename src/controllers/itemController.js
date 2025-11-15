import lists from "../data/lists.js";

function findListById(listId) {
  return lists.find((l) => l.id === listId);
}
function findListByItemId(itemId) {
  for (const list of lists) {
    const index = list.items.findIndex((it) => it.itemId === itemId);
    if (index !== -1) {
      return { list, index };
    }
  }
  return null;
}

function ensureListAccess(list, req, res) {
  const userId = req.user?.id;
  const userEmail = req.user?.email?.toLowerCase();

  if (!userId && !userEmail) {
    res.status(401).json({ error: "Missing user info in token." });
    return false;
  }

  const isOwner = userId && list.ownerId === userId;
  const isMember = list.members.some((m) => {
    const byId = userId && m.userId === userId;
    const byEmail =
      userEmail && m.email && m.email.toLowerCase() === userEmail;
    return byId || byEmail;
  });

  if (!isOwner && !isMember) {
    res.status(403).json({ error: "You are not allowed to modify this list's items." });
    return false;
  }

  return true;
}

// POST /item/add
export const addItem = (req, res) => {
  const { listId, text } = req.body;

  if (!listId || !text || !text.trim()) {
    return res
      .status(400)
      .json({ error: "listId and non-empty text are required" });
  }

  const list = findListById(listId);
  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }

  if (!ensureListAccess(list, req, res)) return;

  const trimmedText = text.trim();
  const newItem = {
    itemId: "i" + Date.now(),
    text: trimmedText,
    completed: false,
  };

  list.items.push(newItem);

  return res.status(201).json({
    listId: list.id,
    item: newItem,
  });
};

// GET /item/list/:listId
export const listItems = (req, res) => {
  const { listId } = req.params;

  const list = findListById(listId);
  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }

  if (!ensureListAccess(list, req, res)) return;

  return res.json(list.items);
};

// POST /item/markCompleted/:id
export const markItemCompleted = (req, res) => {
  const { id } = req.params;

  const result = findListByItemId(id);
  if (!result) {
    return res.status(404).json({ error: "Item not found" });
  }

  const { list, index } = result;

  if (!ensureListAccess(list, req, res)) return;

  list.items[index].completed = true;

  return res.json({
    listId: list.id,
    item: list.items[index],
  });
};

// POST /item/markUncompleted/:id
export const markItemUncompleted = (req, res) => {
  const { id } = req.params;

  const result = findListByItemId(id);
  if (!result) {
    return res.status(404).json({ error: "Item not found" });
  }

  const { list, index } = result;

  if (!ensureListAccess(list, req, res)) return;

  list.items[index].completed = false;

  return res.json({
    listId: list.id,
    item: list.items[index],
  });
};

// DELETE /item/remove/:id
export const removeItem = (req, res) => {
  const { id } = req.params;

  const result = findListByItemId(id);
  if (!result) {
    return res.status(404).json({ error: "Item not found" });
  }

  const { list, index } = result;

  if (!ensureListAccess(list, req, res)) return;

  const removed = list.items.splice(index, 1)[0];

  return res.json({
    listId: list.id,
    removedItem: removed,
  });
};