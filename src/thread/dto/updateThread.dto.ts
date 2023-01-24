import { PartialType } from "@nestjs/swagger";
import { ThreadDto } from "./thread.dto";

export class UpdateThreadDto extends PartialType(ThreadDto) {}
