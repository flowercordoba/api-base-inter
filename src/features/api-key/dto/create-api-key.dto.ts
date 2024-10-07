import { IsString, IsNotEmpty } from 'class-validator';


export class CreateApiKeyDto {
    @IsString()
    @IsNotEmpty()
    clientName: string;
}
