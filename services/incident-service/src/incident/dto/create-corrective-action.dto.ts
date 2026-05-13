import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';

export enum ActionStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue',
}

export enum ActionType {
  IMMEDIATE = 'immediate',
  CORRECTIVE = 'corrective',
  PREVENTIVE = 'preventive',
}

export class CreateCorrectiveActionDto {
  @IsString()
  @IsNotEmpty()
  incidentId: string;

  @IsEnum(ActionType)
  @IsNotEmpty()
  type: ActionType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  assignedTo?: string; // User ID

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsOptional()
  priority?: 'critical' | 'high' | 'medium' | 'low' = 'medium';

  @IsEnum(ActionStatus)
  @IsOptional()
  status?: ActionStatus = ActionStatus.OPEN;

  @IsString()
  @IsOptional()
  expectedOutcome?: string;

  @IsBoolean()
  @IsOptional()
  verified?: boolean = false;
}
