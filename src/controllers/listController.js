import List from "../models/listModel.js";

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

// GET ALL MY LISTS
export const getAllLists = async (req, res) => {
  try {
    const lists = await List.find({ ownerId: req.user.id });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: "Failed to load lists" });
  }
};

// CREATE NEW LIST
export const createList = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const duplicate = await List.findOne({
      name: name.trim(),
      ownerId: req.user.id
    });

    if (duplicate) {
      return res.status(400).json({ error: "List name must be unique." });
    }

    const newList = await List.create({
      name: name.trim(),
      ownerId: req.user.id,
      items: [],
      members: []
    });

    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ error: "Failed to create list" });
  }
};

// GET LIST BY ID
export const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found" });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to load list" });
  }
};

// UPDATE LIST NAME
export const updateList = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!ensureListOwner(list, req, res)) return;

    const duplicate = await List.findOne({
      name: name.trim(),
      ownerId: req.user.id,
      _id: { $ne: req.params.id }
    });

    if (duplicate) {
      return res.status(400).json({ error: "List name must be unique." });
    }

    list.name = name.trim();
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to update list" });
  }
};

// ARCHIVE LIST
export const archiveList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!ensureListOwner(list, req, res)) return;

    list.archived = true;
    await list.save();
    res.json(list);
  } catch {
    res.status(500).json({ error: "Failed to archive list" });
  }
};

// DELETE LIST
export const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!ensureListOwner(list, req, res)) return;

    await List.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete list" });
  }
};

// ADD MEMBER
export const addMember = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!ensureListOwner(list, req, res)) return;

    const exists = list.members.some(
      (m) => m.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ error: "Member already exists" });
    }

    list.members.push({ email: email.toLowerCase() });
    await list.save();

    res.json(list);
  } catch {
    res.status(500).json({ error: "Failed to add member" });
  }
};

// REMOVE MEMBER
export const removeMember = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!ensureListOwner(list, req, res)) return;

    list.members = list.members.filter(
      (m) => m.email.toLowerCase() !== email.toLowerCase()
    );

    await list.save();
    res.json(list);
  } catch {
    res.status(500).json({ error: "Failed to remove member" });
  }
};

// LEAVE LIST
export const leaveList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Missing user info in token." });
    }

    // Owner cannot leave their own list
    if (list.ownerId.toLowerCase() === req.user.id.toLowerCase()) {
      return res.status(403).json({ error: "Owner cannot leave the list." });
    }

    const before = list.members.length;

    list.members = list.members.filter(
      (m) => m.id.toLowerCase() !== req.user.id.toLowerCase()
    );

    if (list.members.length === before) {
      return res
        .status(404)
        .json({ error: "You are not a member of this list." });
    }

    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to leave list" });
  }
};