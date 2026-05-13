import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum TimelineEventType {
  DETECTION = 'detection',
  ESCALATION = 'escalation',
  INVESTIGATION = 'investigation',
  CONTAINMENT = 'containment',
  ERADICATION = 'eradication',
  RECOVERY = 'recovery',
  COMMUNICATION = 'communication',
  RESOLUTION = 'resolution',
  CLOSURE = 'closure',
  COMMENT = 'comment',
}

export class CreateTimelineDto {
  @IsString()
  @IsNotEmpty()
  incidentId: string;

  @IsEnum(TimelineEventType)
  @IsNotEmpty()
  eventType: TimelineEventType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  occurredAt: string;

  @IsString()
  @IsOptional()
  recordedBy?: string; // User ID

  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
