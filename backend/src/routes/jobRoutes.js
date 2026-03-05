import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const { search, location, type, salary, category } = req.query;
    
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (type) {
      query.jobType = type;
    }
    if (category) {
      query.category = category;
    }
    if (salary) {
      switch (salary) {
        case "below-2k":
          query.salary = { $lt: "$2,000" };
          break;
        case "2k-4k":
          query.salary = { $regex: "2,000|3,000|4,000" };
          break;
        case "4k-6k":
          query.salary = { $regex: "4,000|5,000|6,000" };
          break;
        case "6k-plus":
          query.salary = { $regex: "[6-9]," };
          break;
      }
    }
    
    query.status = "active";
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured jobs
router.get("/featured/list", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job categories with count
router.get("/categories/count", async (req, res) => {
  try {
    const categories = await Job.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job (employer only)
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete job
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (job) {
      res.json({ message: "Job removed" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
