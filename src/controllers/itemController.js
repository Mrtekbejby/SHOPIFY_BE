import List from "../models/listModel.js";

function ensureListAccess(list, req, res) {
  const userId = req.user?.id;
  const userEmail = req.user?.email?.toLowerCase();

  if (!userId && !userEmail) {
    res.status(401).json({ error: "Missing user info in token." });
    return false;
  }

  const isOwner = list.ownerId === userId;
  const isMember = list.members.some(m =>
    (userId && m.id === userId) ||
    (userEmail && m.email?.toLowerCase() === userEmail)
  );

  if (!isOwner && !isMember) {
    res.status(403).json({ error: "You are not allowed to modify this list's items." });
    return false;
  }

  return true;
}

// ADD ITEM
export const addItem = async (req, res) => {
  const { listId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!ensureListAccess(list, req, res)) return;

    const newItem = {
      id: "i" + Date.now(),
      text: text.trim(),
      completed: false
    };

    list.items.push(newItem);
    await list.save();
    return res.status(201).json(list);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add item" });
  }
};

// UN/COMPLETED ITEM
export const toggleItem = async (req, res) => {
  const { listId, itemId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!ensureListAccess(list, req, res)) return;

    const item = list.items.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.completed = !item.completed;
    await list.save();

    res.json(list);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle item" });
  }
};

// DELETE ITEM
export const deleteItem = async (req, res) => {
  const { listId, itemId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!ensureListAccess(list, req, res)) return;

    list.items = list.items.filter((i) => i.id !== itemId);
    await list.save();

    res.json(list);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
};