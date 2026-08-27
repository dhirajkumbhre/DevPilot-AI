import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";

import {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectFiles,
    updateProjectFile,
} from "../services/project.service.js";


describe("project.service.js", () => {

    beforeEach(() => {

        localStorage.clear();

        vi.restoreAllMocks();

    });


    /*
    |--------------------------------------------------------------------------
    | GET PROJECTS
    |--------------------------------------------------------------------------
    */

    it("should fetch projects with authentication", async () => {

        localStorage.setItem(
            "token",
            "test-token"
        );


        const mockProjects = [

            {
                _id: "project-1",
                name: "DevPilot AI",
            },

        ];


        const fetchMock =
            vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue({

                    ok: true,

                    json: async () => ({

                        projects:
                            mockProjects,

                    }),

                });


        const result =
            await getProjects();


        expect(result).toEqual(
            mockProjects
        );


        expect(fetchMock)
            .toHaveBeenCalledWith(

                "http://localhost:5000/api/projects",

                expect.objectContaining({

                    method: "GET",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            "Bearer test-token",

                    },

                })

            );

    });


    /*
    |--------------------------------------------------------------------------
    | CREATE PROJECT
    |--------------------------------------------------------------------------
    */

    it("should create a project", async () => {

        localStorage.setItem(
            "token",
            "test-token"
        );


        const newProject = {

            _id: "project-2",

            name: "QA Testing",

            description:
                "Testing DevPilot",

        };


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue({

                ok: true,

                json: async () => ({

                    project:
                        newProject,

                }),

            });


        const result =
            await createProject({

                name: "QA Testing",

                description:
                    "Testing DevPilot",

            });


        expect(result).toEqual(
            newProject
        );

    });


    /*
    |--------------------------------------------------------------------------
    | GET SINGLE PROJECT
    |--------------------------------------------------------------------------
    */

    it("should fetch a project by ID", async () => {

        localStorage.setItem(
            "token",
            "test-token"
        );


        const project = {

            _id: "project-123",

            name: "DevPilot AI",

        };


        const fetchMock =
            vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue({

                    ok: true,

                    json: async () => ({

                        project,

                    }),

                });


        const result =
            await getProjectById(
                "project-123"
            );


        expect(result).toEqual(
            project
        );


        expect(fetchMock)
            .toHaveBeenCalledWith(

                "http://localhost:5000/api/projects/project-123",

                expect.objectContaining({

                    method: "GET",

                })

            );

    });


    /*
    |--------------------------------------------------------------------------
    | UPDATE PROJECT
    |--------------------------------------------------------------------------
    */

    it("should update a project", async () => {

        localStorage.setItem(
            "token",
            "test-token"
        );


        const updatedProject = {

            _id: "project-123",

            name: "Updated DevPilot",

        };


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue({

                ok: true,

                json: async () => ({

                    project:
                        updatedProject,

                }),

            });


        const result =
            await updateProject(

                "project-123",

                {
                    name:
                        "Updated DevPilot",
                }

            );


        expect(result).toEqual(
            updatedProject
        );

    });


    /*
    |--------------------------------------------------------------------------
    | DELETE PROJECT
    |--------------------------------------------------------------------------
    */

    it("should delete a project", async () => {

        localStorage.setItem(
            "token",
            "test-token"
        );


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue({

                ok: true,

                json: async () => ({

                    success: true,

                    message:
                        "Project deleted",

                }),

            });


        const result =
            await deleteProject(
                "project-123"
            );


        expect(result).toEqual({

            success: true,

            message:
                "Project deleted",

        });

    });


    /*
    |--------------------------------------------------------------------------
    | GET PROJECT FILES
    |--------------------------------------------------------------------------
    */

    it("should fetch project files", async () => {

        localStorage.setItem(
            "token",
            "test-token"
        );


        const files = [

            {
                _id: "file-1",

                path: "src/App.jsx",

            },

            {
                _id: "file-2",

                path: "src/main.jsx",

            },

        ];


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue({

                ok: true,

                json: async () => ({

                    files,

                }),

            });


        const result =
            await getProjectFiles(
                "project-123"
            );


        expect(result).toEqual(
            files
        );

    });


    /*
    |--------------------------------------------------------------------------
    | UPDATE PROJECT FILE
    |--------------------------------------------------------------------------
    */

    it("should update a project file", async () => {

        localStorage.setItem(
            "token",
            "test-token"
        );


        const updatedFile = {

            _id: "file-1",

            path: "src/App.jsx",

            content:
                "const App = () => {};",

        };


        const fetchMock =
            vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue({

                    ok: true,

                    json: async () => ({

                        file:
                            updatedFile,

                    }),

                });


        const result =
            await updateProjectFile(

                "project-123",

                "file-1",

                "const App = () => {};"

            );


        expect(result).toEqual(
            updatedFile
        );


        expect(fetchMock)
            .toHaveBeenCalledWith(

                "http://localhost:5000/api/projects/project-123/files/file-1",

                expect.objectContaining({

                    method: "PUT",

                    body: JSON.stringify({

                        content:
                            "const App = () => {};",

                    }),

                })

            );

    });


    /*
    |--------------------------------------------------------------------------
    | ERROR HANDLING
    |--------------------------------------------------------------------------
    */

    it("should throw the backend error", async () => {

        localStorage.setItem(
            "token",
            "test-token"
        );


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue({

                ok: false,

                json: async () => ({

                    message:
                        "Project not found",

                }),

            });


        await expect(

            getProjectById(
                "invalid-project"
            )

        ).rejects.toThrow(
            "Project not found"
        );

    });

});