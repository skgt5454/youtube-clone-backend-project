import {ApiError} from "../utils/apiError.js"
import {apiresponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new apiresponse(
            200,
            { status: "OK" },
            "Server is running successfully"
        )
    );
});

export {
    healthcheck
    }
    