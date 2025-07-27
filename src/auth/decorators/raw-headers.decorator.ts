import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {

        const { rawHeaders } = ctx.switchToHttp().getRequest();
        console.log({ rawHeaders });

        return rawHeaders;

    }
);
