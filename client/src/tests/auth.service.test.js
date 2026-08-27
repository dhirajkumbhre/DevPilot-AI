import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";

import {
    registerUser,
    loginUser,
} from "../services/auth.service.js";


describe("auth.service.js", () => {

    beforeEach(() => {

        vi.restoreAllMocks();

    });


    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    */

    it("should register a user and return the response data", async () => {

        const userData = {

            name: "Dhiraj",

            email: "dhiraj@example.com",

            password: "password123",

        };


        const mockData = {

            user: {

                id: "user-123",

                name: "Dhiraj",

                email: "dhiraj@example.com",

            },

            token: "test-jwt-token",

        };


        const fetchMock =
            vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue({

                    ok: true,

                    json: async () => ({

                        success: true,

                        data: mockData,

                    }),

                });


        const result =
            await registerUser(
                userData
            );


        expect(result).toEqual(
            mockData
        );


        expect(fetchMock)
            .toHaveBeenCalledTimes(1);


        expect(fetchMock)
            .toHaveBeenCalledWith(

                "http://localhost:5000/api/auth/register",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                    },

                    body:
                        JSON.stringify(userData),

                }

            );

    });


    /*
    |--------------------------------------------------------------------------
    | REGISTER ERROR
    |--------------------------------------------------------------------------
    */

    it("should throw the backend registration error", async () => {

        const userData = {

            name: "Dhiraj",

            email: "existing@example.com",

            password: "password123",

        };


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue({

                ok: false,

                json: async () => ({

                    success: false,

                    message:
                        "Email already exists",

                }),

            });


        await expect(

            registerUser(
                userData
            )

        ).rejects.toThrow(
            "Email already exists"
        );

    });


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    it("should login a user and return the response data", async () => {

        const credentials = {

            email: "dhiraj@example.com",

            password: "password123",

        };


        const mockData = {

            user: {

                id: "user-123",

                name: "Dhiraj",

                email: "dhiraj@example.com",

            },

            token: "test-jwt-token",

        };


        const fetchMock =
            vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue({

                    ok: true,

                    json: async () => ({

                        success: true,

                        data: mockData,

                    }),

                });


        const result =
            await loginUser(
                credentials
            );


        expect(result).toEqual(
            mockData
        );


        expect(fetchMock)
            .toHaveBeenCalledTimes(1);


        expect(fetchMock)
            .toHaveBeenCalledWith(

                "http://localhost:5000/api/auth/login",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                    },

                    body:
                        JSON.stringify(credentials),

                }

            );

    });


    /*
    |--------------------------------------------------------------------------
    | LOGIN ERROR
    |--------------------------------------------------------------------------
    */

    it("should throw the backend login error", async () => {

        const credentials = {

            email: "wrong@example.com",

            password: "wrong-password",

        };


        vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue({

                ok: false,

                json: async () => ({

                    success: false,

                    message:
                        "Invalid email or password",

                }),

            });


        await expect(

            loginUser(
                credentials
            )

        ).rejects.toThrow(
            "Invalid email or password"
        );

    });

});