import Gem from "../models/Gem.js";

// CREATE GEM
export const createGem = async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);

    const gem = new Gem({
      ...req.body,
      images: imageUrls,
    });

    await gem.save();

    res.json({ message: "Gem created", data: gem });
  } catch {
    res.status(500).json({ message: "Create failed" });
  }
};

// UPDATE GEM
export const updateGem = async (req, res) => {
  try {
    const existingImages = JSON.parse(req.body.existingImages || "[]");
    const newImages = req.files.map((file) => file.path);

    const finalImages = [...existingImages, ...newImages];

    const updated = await Gem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: finalImages },
      { new: true }
    );

    res.json({ message: "Updated", data: updated });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

// GET GEMS
export const getGems = async (req, res) => {
  const { page = 1, limit = 6, search = "" } = req.query;

  const query = {
    name: { $regex: search, $options: "i" },
  };

  const total = await Gem.countDocuments(query);

  const gems = await Gem.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    data: gems,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
  });
};

// DELETE GEM
export const deleteGem = async (req, res) => {
  await Gem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};


