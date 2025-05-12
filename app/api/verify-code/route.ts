import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";

export async function POST(request: Request){
    // TODO: ZOD

    await dbConnect();

    try {
        const {email, code}=await request.json();

        const user=await UserModel.findOne({email});

        if(!user){
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {status: 404});
        }

        const isCodeValid= user.verifyCode===code;

        const isCodeNotExpired= new Date(user.verifyCodeExpiry)>new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account Verified Successfully"
            }, {status: 200});
        } else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has been expired, please sign-up again to get a new code"
            }, {status: 400});
        } else{
            return Response.json({
                success: false,
                message: "Invalid Verification Code"
            }, {status: 400});
        }


    } catch (error) {
        console.error("Error in Verifying code ", error);
        return Response.json({
            success: false,
            message: "Error Verifying code"
        }, {status: 500});
    }
}