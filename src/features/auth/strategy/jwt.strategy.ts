import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { envs } from "src/shared/config";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    // Aquí recuperas el usuario desde el servicio de autenticación, incluyendo los roles
    const user = await this.authService.currentUser(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    // Asegurarte de devolver los roles correctamente
    return { ...user, roles: user.roles };  // Asigna los roles del usuario correctamente
  }
}
