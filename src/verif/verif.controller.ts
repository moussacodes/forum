import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards";


@UseGuards(JwtGuard)
@Controller("verify")
export class VerificationController{
    constructor(){

    }


}