import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";

import {
    sendMessageToAI,
} from "../services/ai.service.js";


describe("ai.service.js", () => {

    beforeEach(() => {

        localStorage.clear();

        vi.restoreAllMocks();

    });


    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    it("should send the correct request and return the AI response", async () => {

        localStorage.setItem(
            "token",
            "test-jwt-token"
        );


        const mockResponse = {

            ok: true,

            json: async () => ({

                success: true,

                data: {

                    response:
                        "This code looks good.",

                },

            }),

        };


        const fetchMock =
            vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue(
                    mockResponse
                );


        const result =
            await sendMessageToAI({

                message:
                    "Explain this code.",

                projectId:
                    "project123",

                fileId:
                    "file123",

            });


        expect(result).toBe(
            "This code looks good."
        );


        expect(fetchMock)
            .toHaveBeenCalledTimes(1);


        expect(fetchMock)
            .toHaveBeenCalledWith(

                "http://localhost:5000/api/ai/chat",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            "Bearer test-jwt-token",

                    },

                    body: JSON.stringify({

                        message:
                            "Explain this code.",

                        projectId:
                            "project123",

                        fileId:
                            "file123",

                    }),

                }

            );

    });


    /*
    |--------------------------------------------------------------------------
    | BACKEND ERROR
    |--------------------------------------------------------------------------
    */

    it("should throw the backend error message", async () => {

        localStorage.setItem(
            "token",
            "test-jwt-token"
        );


        const mockResponse = {

            ok: false,

            json: async () => ({

                success: false,

                message:
                    "Project not found",

            }),

        };


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(
                mockResponse
            );


        await expect(

            sendMessageToAI({

                message:
                    "Explain this file.",

                projectId:
                    "invalid-project",

                fileId:
                    "file123",

            })

        ).rejects.toThrow(
            "Project not found"
        );

    });


    /*
    |--------------------------------------------------------------------------
    | DEFAULT ERROR
    |--------------------------------------------------------------------------
    */

    it("should use the default error message when backend does not provide one", async () => {

        localStorage.setItem(
            "token",
            "test-jwt-token"
        );


        const mockResponse = {

            ok: false,

            json: async () => ({

                success: false,

            }),

        };


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(
                mockResponse
            );


        await expect(

            sendMessageToAI({

                message:
                    "Review this code.",

                projectId:
                    "project123",

                fileId:
                    "file123",

            })

        ).rejects.toThrow(
            "AI request failed"
        );

    });


    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATION TOKEN
    |--------------------------------------------------------------------------
    */

    it("should send the JWT token in the Authorization header", async () => {

        localStorage.setItem(
            "token",
            "my-secret-token"
        );


        const mockResponse = {

            ok: true,

            json: async () => ({

                success: true,

                data: {

                    response:
                        "Review completed.",

                },

            }),

        };


        const fetchMock =
            vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue(
                    mockResponse
                );


        await sendMessageToAI({

            message:
                "Review this code.",

            projectId:
                "project123",

            fileId:
                "file456",

        });


        expect(fetchMock)
            .toHaveBeenCalledWith(

                "http://localhost:5000/api/ai/chat",

                expect.objectContaining({

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            "Bearer my-secret-token",

                    },

                })

            );

    });

});