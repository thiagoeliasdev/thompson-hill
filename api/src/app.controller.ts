import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { Response } from "express"
import { JwtAuthGuard } from "./auth/guards/jwt-auth/jwt-auth.guard"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("ping")
  @ApiOperation({ summary: "Ping the server" })
  @ApiResponse({ status: 200, description: "Pong" })
  ping() {
    return "Pong"
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('export-csv')
  @ApiOperation({ summary: 'Export all collections to CSV files' })
  @ApiResponse({
    status: 200,
    description: 'Returns a zip file containing all collections exported to CSV',
    content: {
      'application/zip': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async exportAllToCSV(@Res() res: Response) {
    return this.appService.exportCSV(res)
  }
}
