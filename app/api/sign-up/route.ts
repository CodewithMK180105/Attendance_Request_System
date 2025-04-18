import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import { generateClassCode } from "@/lib/codeGeneration";
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest){
    await dbConnect();

    try {
        
        const {
            name, 
            email, 
            password,
            rollNo, 
            userId, 
            division,
            department, 
            college, 
            contactNumber, 
            gender, 
            profilePicture, 
            role, 
            studentCode,
            professorCode
        }= await request.json();

        const doesEmailExists=await UserModel.findOne({email});

        if(doesEmailExists){
            return NextResponse.json({
                success: false,
                message: "Email already exists"
            }, { status: 401 });
        }

        if(role==='hod'){
            const hodUser= await UserModel.findOne({
                college,
                department,
                role: 'hod'
            });

            if(hodUser){
                return NextResponse.json({
                    success: false,
                    message: "Class with the same College and Department exists"
                }, { status: 401 });
            }

            let newStudentCode="stud0000";
            let newProfessorCode= "prof0000";
            
            do{
                newStudentCode= generateClassCode();
                var studentCodeExistInDB= await UserModel.findOne({
                    role,
                    studentCode: newStudentCode
                });
                
            }while(studentCodeExistInDB);
            
            do{
                newProfessorCode= generateClassCode();
                var professorCodeExistInDB= await UserModel.findOne({
                    role,
                    professorCode: newProfessorCode
                });
                
            }while(professorCodeExistInDB);

            if(!newStudentCode){
                return NextResponse.json({
                    success: false,
                    message: "Error in getting the Student class code"
                }, { status: 401 });
            }
            if(!newProfessorCode){
                return NextResponse.json({
                    success: false,
                    message: "Error in getting the Professor class code"
                }, { status: 401 });
            }

            console.log(newStudentCode);
            console.log(newProfessorCode);
            
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser=new UserModel({
                name, 
                email, 
                password: hashedPassword,
                department, 
                college, 
                contactNumber, 
                gender, 
                profilePicture, 
                role, 
                studentCode: newStudentCode,
                professorCode: newProfessorCode
            });

            await newUser.save();

            return NextResponse.json({
                success: true,
                message: "HOD registered successfully"
            }, {status: 200});
            
        } else if(role==='professor'){

            if(!professorCode){
                return NextResponse.json({
                    success: false,
                    message: "To register as a Professor, Professor code is Required"
                }, { status: 401 });
            }

            const hodUser=await UserModel.findOne({
                role: 'hod',
                professorCode
            });

            if(!hodUser){
                return NextResponse.json({
                    success: false,
                    message: "Invalid Professor code"
                }, { status: 401 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser= new UserModel({
                name, 
                email, 
                password: hashedPassword,
                department, 
                college, 
                contactNumber, 
                gender, 
                profilePicture, 
                role, 
                professorCode
            });

            await newUser.save();

            return NextResponse.json({
                success: true,
                message: "Professor registered successfully"
            }, {status: 200});

        } else if (role==='student') {

            if(!studentCode){
                return NextResponse.json({
                    success: false,
                    message: "To register as a Student, Student code is Required"
                }, { status: 401 });
            }

            const hodUser=await UserModel.findOne({
                role: 'hod',
                studentCode
            });

            if(!hodUser){
                return NextResponse.json({
                    success: false,
                    message: "Invalid Student code"
                }, { status: 401 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            if(!rollNo){
                return NextResponse.json({
                    success: false,
                    message: "Enter your roll no."
                }, { status: 401 });
            }

            if(!userId){
                return NextResponse.json({
                    success: false,
                    message: "Enter the Student Id"
                }, { status: 401 });
            }

            if(!division){
                return NextResponse.json({
                    success: false,
                    message: "Enter your class division"
                }, { status: 401 });
            }

            const newUser= new UserModel({
                name, 
                email, 
                password: hashedPassword,
                rollNo, 
                userId, 
                division,
                department, 
                college, 
                contactNumber, 
                gender, 
                profilePicture, 
                role, 
                studentCode,
            });

            await newUser.save();

            return NextResponse.json({
                success: true,
                message: "Student registered successfully"
            }, {status: 200});

        }

        return NextResponse.json({
            success: false,
            message: "Applied for invalid role"
        }, {status: 401});

    } catch (error) {
        return NextResponse.json(
        {
            success: false,
            message: "An error occurred"
        },
        { status: 500 }
        );
    }
}