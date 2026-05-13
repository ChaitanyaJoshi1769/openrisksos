import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RisksService } from './risks.service';
import { CreateRiskDto, UpdateRiskDto, RiskFilterDto } from './dto';

// TODO: Add JWT guard for authentication
// @UseGuards(JwtGuard)
@Controller('api/v1/risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  /**
   * Create a new risk
   * POST /api/v1/risks
   */
  @Post()
  async create(@Body() dto: CreateRiskDto, @Req() req: any) {
    // Extract tenant ID from JWT token
    const tenantId = req.user?.tenantId || 'default';

    if (!dto.ownerId) {
      dto.ownerId = req.user?.id;
    }

    return this.risksService.createRisk(tenantId, dto);
  }

  /**
   * Get all risks for tenant
   * GET /api/v1/risks
   */
  @Get()
  async findAll(@Query() filter: RiskFilterDto, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'default';
    return this.risksService.getRisks(tenantId, filter);
  }

  /**
   * Get a single risk by ID
   * GET /api/v1/risks/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'default';
    return this.risksService.getRiskById(id, tenantId);
  }

  /**
   * Update a risk
   * PUT /api/v1/risks/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRiskDto,
    @Req() req: any,
  ) {
    const tenantId = req.user?.tenantId || 'default';
    return this.risksService.updateRisk(id, tenantId, dto);
  }

  /**
   * Delete a risk (soft delete)
   * DELETE /api/v1/risks/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'default';
    return this.risksService.deleteRisk(id, tenantId);
  }

  /**
   * Calculate residual risk score
   * POST /api/v1/risks/:id/calculate-residual
   */
  @Post(':id/calculate-residual')
  async calculateResidual(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'default';
    return this.risksService.calculateResidualScore(id, tenantId);
  }

  /**
   * Get risk heatmap
   * GET /api/v1/risks/heatmap
   */
  @Get('/heatmap')
  async getHeatmap(@Req() req: any) {
    const tenantId = req.user?.tenantId || 'default';
    return this.risksService.getRiskHeatmap(tenantId);
  }

  /**
   * Get KRIs for a risk
   * GET /api/v1/risks/:id/kris
   */
  @Get(':id/kris')
  async getKRIs(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'default';
    return this.risksService.getRiskKRIs(id, tenantId);
  }
}
