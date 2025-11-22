import Group from "../models/groupModel.js";
// -----------------------------------------
// Get all groups
// -----------------------------------------
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

// -----------------------------------------
// Create a new group
// -----------------------------------------
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    const newGroup = new Group({
      name,
      members,
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};

// -----------------------------------------
// Get group by ID
// -----------------------------------------
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group", error });
  }
};
