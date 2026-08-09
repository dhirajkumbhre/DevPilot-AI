import Project from "../models/project.model.js";

/*
 * Create a project for the authenticated user.
 */
export const createProjectService = async ({
  name,
  description,
  userId,
}) => {
  const project = await Project.create({
    name,
    description,
    owner: userId,
  });

  return project;
};