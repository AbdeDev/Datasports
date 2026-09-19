import db from "@adonisjs/lucid/services/db";
import { DateTime } from "luxon";
import Mission from "#models/mission";
import MissionTarget from "#models/mission_target";
import Player from "#models/player";
import type User from "#models/user";

class MissionForbiddenError extends Error {}
class MissionConflictError extends Error {}

export { MissionForbiddenError, MissionConflictError };

export default class MissionService {
  async listForUser(user: User) {
    const query = Mission.query()
      .preload("match", (matchQuery) => matchQuery.preload("homeClub").preload("awayClub"))
      .preload("scout")
      .preload("targets", (targetQuery) => targetQuery.preload("player"))
      .orderBy("created_at", "desc");

    if (user.role !== "admin") {
      query.where("scout_id", user.id);
    }

    return query;
  }

  async findForUser(missionId: number, user: User) {
    const mission = await Mission.query()
      .where("id", missionId)
      .preload("match", (matchQuery) => matchQuery.preload("homeClub").preload("awayClub"))
      .preload("scout")
      .preload("targets", (targetQuery) => targetQuery.preload("player"))
      .preload("observations")
      .firstOrFail();

    if (user.role !== "admin" && mission.scoutId !== user.id) {
      throw new MissionForbiddenError("This mission does not belong to you");
    }

    return mission;
  }

  async create(data: { matchId: number; scoutId: number; playerIds: number[] }, createdBy: User) {
    const mission = await db.transaction(async (trx) => {
      const mission = await Mission.create(
        {
          matchId: data.matchId,
          scoutId: data.scoutId,
          createdBy: createdBy.id,
          status: "proposee",
        },
        { client: trx },
      );

      await MissionTarget.createMany(
        data.playerIds.map((playerId) => ({ missionId: mission.id, playerId })),
        { client: trx },
      );

      return mission;
    });

    return this.findForUser(mission.id, createdBy);
  }

  async respond(
    missionId: number,
    scout: User,
    data: { decision: "accept" | "decline"; declineReason?: string },
  ) {
    // A scout who declined (a_reattribuer) or withdrew (scout_indisponible)
    // can still change their mind and respond again — as long as it hasn't
    // been reassigned away from them yet (guarded by the scout_id match
    // below). The update is conditional on both scout and status in one
    // atomic statement so two concurrent requests can't both "win".
    const updated = await Mission.query()
      .where("id", missionId)
      .where("scout_id", scout.id)
      .whereIn("status", ["proposee", "a_reattribuer", "scout_indisponible"])
      .returning("id")
      .update({
        status: data.decision === "accept" ? "acceptee" : "a_reattribuer",
        declineReason: data.decision === "decline" ? (data.declineReason ?? null) : null,
        respondedAt: DateTime.now().toSQL(),
      });

    if (updated.length === 0) {
      const mission = await Mission.findOrFail(missionId);
      if (mission.scoutId !== scout.id) {
        throw new MissionForbiddenError("This mission does not belong to you");
      }
      throw new MissionConflictError("This mission is not awaiting a response");
    }

    return this.findForUser(missionId, scout);
  }

  async reassign(missionId: number, newScoutId: number, admin: User) {
    const updated = await Mission.query()
      .where("id", missionId)
      .whereIn("status", ["proposee", "a_reattribuer", "scout_indisponible"])
      .returning("id")
      .update({
        scoutId: newScoutId,
        status: "proposee",
        declineReason: null,
        respondedAt: null,
      });

    if (updated.length === 0) {
      await Mission.findOrFail(missionId);
      throw new MissionConflictError("Only a pending or unassigned mission can be reassigned");
    }

    return this.findForUser(missionId, admin);
  }

  /**
   * A scout backing out of a mission they had already accepted — distinct
   * from an initial decline (brief §10 status list separates "Scout
   * indisponible" from "À réattribuer").
   */
  async withdraw(missionId: number, scout: User, reason?: string) {
    const updated = await Mission.query()
      .where("id", missionId)
      .where("scout_id", scout.id)
      .where("status", "acceptee")
      .returning("id")
      .update({
        status: "scout_indisponible",
        declineReason: reason ?? null,
        respondedAt: DateTime.now().toSQL(),
      });

    if (updated.length === 0) {
      const mission = await Mission.findOrFail(missionId);
      if (mission.scoutId !== scout.id) {
        throw new MissionForbiddenError("This mission does not belong to you");
      }
      throw new MissionConflictError("Only an accepted mission can be withdrawn from");
    }

    return this.findForUser(missionId, scout);
  }

  /**
   * Admin cancellation. Sets status to "annulee" rather than deleting the
   * row — missions (and any observations already attached) are never
   * destroyed, consistent with the append-only philosophy of the rest of
   * the domain (brief §11).
   */
  async cancel(missionId: number, reason: string | undefined, admin: User) {
    const updated = await Mission.query()
      .where("id", missionId)
      .whereNotIn("status", ["annulee", "terminee"])
      .returning("id")
      .update({
        status: "annulee",
        declineReason: reason ?? null,
      });

    if (updated.length === 0) {
      await Mission.findOrFail(missionId);
      throw new MissionConflictError("This mission can no longer be cancelled");
    }

    return this.findForUser(missionId, admin);
  }

  /**
   * "+ Joueur repéré" (brief §10): the scout spots and quick-creates a
   * player during the match, attached to the current mission's targets.
   * Nom/prénom/poste/club are all required here (product decision).
   */
  async addSpottedPlayer(
    missionId: number,
    scout: User,
    playerData: { firstName: string; lastName: string; officialPosition: string; clubId: number },
  ) {
    const mission = await Mission.findOrFail(missionId);

    if (mission.scoutId !== scout.id) {
      throw new MissionForbiddenError("This mission does not belong to you");
    }

    await db.transaction(async (trx) => {
      const player = await Player.create({ ...playerData, status: "decouvert" }, { client: trx });
      await MissionTarget.create({ missionId: mission.id, playerId: player.id }, { client: trx });
    });

    return this.findForUser(mission.id, scout);
  }
}
