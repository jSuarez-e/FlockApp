import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import {
  MedalEntity,
  MedalConditionType,
} from '../../infrastructure/entities/medal.entity';
import { UserMedalEntity } from '../../infrastructure/entities/user-medal.entity';

@Injectable()
export class MedalsService {
  constructor(
    @InjectRepository(MedalEntity)
    private readonly medalRepo: Repository<MedalEntity>,
    @InjectRepository(UserMedalEntity)
    private readonly userMedalRepo: Repository<UserMedalEntity>,
  ) {}

  /**
   * @method evaluateUserMedals
   * @description Evalúa si el usuario cumple condiciones para nuevas medallas y las otorga.
   */
  async evaluateUserMedals(
    userId: string,
    stats: { speciesCount: number; sightingsCount: number; daysInApp: number },
  ): Promise<void> {
    // Obtener medallas que el usuario YA tiene
    const earnedUserMedals = await this.userMedalRepo.find({
      where: { user_id: userId },
      select: ['medal_id'],
    });

    const earnedMedalIds = earnedUserMedals.map((um) => um.medal_id);

    // Obtener medallas que AÚN NO tiene
    const unearnedMedals = await this.medalRepo.find({
      where: earnedMedalIds.length > 0 ? { id: Not(In(earnedMedalIds)) } : {},
    });

    const newMedalsToAward: UserMedalEntity[] = [];

    for (const medal of unearnedMedals) {
      let isEarned = false;

      switch (medal.condition_type) {
        case MedalConditionType.ACCOUNT_CREATED:
          isEarned = true; // Si existe la cuenta, se la gana
          break;
        case MedalConditionType.DAYS_ACTIVE:
          isEarned = stats.daysInApp >= medal.condition_value;
          break;
        case MedalConditionType.BIRD_COUNT:
          // NOTA: BIRD_COUNT en db-aves.json y seed se refiere a "registrar X aves" (sightings o species)
          // Asumimos que se refiere a especies únicas. Si es avistamientos totales, usamos sightingsCount.
          // El seed dice "registrar 10 aves", normalmente en eBird es "especies". Usaremos speciesCount.
          isEarned = stats.speciesCount >= medal.condition_value;
          break;
      }

      if (isEarned) {
        const userMedal = this.userMedalRepo.create({
          user_id: userId,
          medal_id: medal.id,
        });
        newMedalsToAward.push(userMedal);
      }
    }

    if (newMedalsToAward.length > 0) {
      await this.userMedalRepo.save(newMedalsToAward);
    }
  }

  /**
   * @method getUserMedalsWithStatus
   * @description Devuelve todo el catálogo de medallas indicando cuáles ha ganado el usuario.
   */
  async getUserMedalsWithStatus(userId: string) {
    const allMedals = await this.medalRepo.find({
      order: { condition_type: 'ASC', condition_value: 'ASC' },
    });

    const userMedals = await this.userMedalRepo.find({
      where: { user_id: userId },
    });

    const earnedMap = new Map<string, UserMedalEntity>();
    for (const um of userMedals) {
      earnedMap.set(um.medal_id, um);
    }

    return allMedals.map((medal) => {
      const earnedRecord = earnedMap.get(medal.id);
      return {
        id: medal.id,
        name: medal.name,
        description: medal.description,
        iconUrl: medal.iconUrl,
        earned: !!earnedRecord,
        awarded_at: earnedRecord ? earnedRecord.awarded_at : null,
      };
    });
  }
}
