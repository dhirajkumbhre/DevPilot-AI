import { createProjectService } from "../services/project.service.js";

/*
 * Create project controller
 */
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    /*
     * req.user.userId comes from the JWT
     * authentication middleware.
     */
    const project = await createProjectService({
      name,
      description,
      userId: req.user.userId,
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};