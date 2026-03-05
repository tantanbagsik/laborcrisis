import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const router = express.Router();

// Apply for a job
router.post("/", async (req, res) => {
  try {
    const { jobId, workerId, coverLetter, resume } = req.body;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    const existingApplication = await Application.findOne({ job: jobId, worker: workerId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this job" });
    }
    
    const application = await Application.create({
      job: jobId,
      worker: workerId,
      coverLetter,
      resume
    });
    
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id }
    });
    
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get worker's applications
router.get("/worker/:workerId", async (req, res) => {
  try {
    const applications = await Application.find({ worker: req.params.workerId })
      .populate("job")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job's applications
router.get("/job/:jobId", async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("worker", "name email phone skills")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status
router.put("/:id/status", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notes, updatedAt: Date.now() },
      { new: true }
    );
    if (application) {
      res.json(application);
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete application
router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (application) {
      await Job.findByIdAndUpdate(application.job, {
        $pull: { applications: application._id }
      });
      res.json({ message: "Application removed" });
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
